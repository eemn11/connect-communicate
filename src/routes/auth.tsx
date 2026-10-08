import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Together" },
      { name: "description", content: "Create your Together account to keep your words, voice, and profile with you." },
      { property: "og:title", content: "Sign in — Together" },
      { property: "og:description", content: "Create your Together account to keep your words, voice, and profile with you." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/profile" }); });
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") navigate({ to: "/profile" });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMessage("");
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: name } } });
      if (error) setMessage(error.message);
      else if (!data.session) setMessage("Check your email and tap the link to finish creating your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }
    setBusy(false);
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) setMessage("Couldn't sign in with Google. Please try again.");
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link to="/" className="text-sm text-muted-foreground inline-flex items-center gap-1"><ArrowLeft className="size-4" />Back home</Link>
        <h1>{mode === "signup" ? "Make your account" : "Welcome back"}</h1>
        <p className="text-muted-foreground">Your words and settings will be saved just for you.</p>
        <Button type="button" variant="outline" onClick={google}>Continue with Google</Button>
        <div className="text-center text-xs text-muted-foreground">or use email</div>
        {mode === "signup" && <div className="grid gap-1.5"><Label htmlFor="name">Name</Label><Input id="name" value={name} onChange={e => setName(e.target.value)} /></div>}
        <div className="grid gap-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="grid gap-1.5"><Label htmlFor="password">Password</Label><Input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} /></div>
        {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
        <Button type="submit" disabled={busy}>{mode === "signup" ? "Create account" : "Sign in"}</Button>
        <Button type="button" variant="ghost" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setMessage(""); }}>
          {mode === "signup" ? "I already have an account" : "I'm new — make an account"}
        </Button>
      </form>
    </div>
  );
}

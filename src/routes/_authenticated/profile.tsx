import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, LogOut, Mic, Image as ImageIcon, UserRound, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My profile — Together" },
      { name: "description", content: "Your Together profile: about you, your voice, your helpers, and permissions." },
      { property: "og:title", content: "My profile — Together" },
      { property: "og:description", content: "Your Together profile: about you, your voice, your helpers, and permissions." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [p, setP] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      let { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      if (!data) {
        const ins = await supabase.from("profiles").insert({ id: u.user.id }).select("*").single();
        data = ins.data;
      }
      setP(data);
      if (data?.avatar_path) loadAvatar(data.avatar_path);
    })();
    if ("speechSynthesis" in window) {
      const load = () => setVoices(window.speechSynthesis.getVoices());
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }, []);

  async function loadAvatar(path: string) {
    const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
    setAvatarUrl(data?.signedUrl ?? null);
  }

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setP(cur => (cur ? { ...cur, [key]: value } : cur));
  }

  async function save() {
    if (!p) return;
    setStatus("Saving…");
    const { id, created_at, updated_at, ...rest } = p;
    const { error } = await supabase.from("profiles").update(rest).eq("id", id);
    setStatus(error ? "Couldn't save. Please try again." : "Saved!");
  }

  async function upload(file: File) {
    if (!p) return;
    const path = `${p.id}/avatar-${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
    setStatus("Uploading photo…");
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setStatus("Couldn't upload photo."); return; }
    set("avatar_path", path);
    await supabase.from("profiles").update({ avatar_path: path }).eq("id", p.id);
    await loadAvatar(path);
    setStatus("Photo updated!");
  }

  async function togglePermission(key: "allow_camera" | "allow_microphone" | "allow_photos", on: boolean) {
    if (on && (key === "allow_camera" || key === "allow_microphone")) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(key === "allow_camera" ? { video: true } : { audio: true });
        stream.getTracks().forEach(t => t.stop());
      } catch {
        setStatus(`Access was blocked. You can allow it in your browser settings.`);
        return;
      }
    }
    set(key, on);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!p) return <div className="profile-page"><p className="text-muted-foreground">Loading your profile…</p></div>;

  const field = (key: keyof Profile, label: string, multiline = false) => (
    <div className="grid gap-1.5">
      <Label htmlFor={key}>{label}</Label>
      {multiline
        ? <Textarea id={key} value={(p[key] as string) ?? ""} onChange={e => set(key, e.target.value as never)} />
        : <Input id={key} value={(p[key] as string) ?? ""} onChange={e => set(key, e.target.value as never)} />}
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <div className="profile-head">
          <Button variant="outline" asChild><Link to="/"><ArrowLeft />Home</Link></Button>
          <h1 className="text-2xl font-extrabold">My profile</h1>
          <Button variant="ghost" onClick={signOut}><LogOut />Sign out</Button>
        </div>
        <div className="profile-grid">
          <section className="profile-card">
            <h2>Name & photo</h2>
            <div className="profile-row" style={{ justifyContent: "flex-start" }}>
              {avatarUrl ? <img src={avatarUrl} alt="Profile photo" className="profile-avatar" /> : <div className="profile-avatar"><UserRound className="size-10" /></div>}
              <Button variant="outline" onClick={() => fileRef.current?.click()}><ImageIcon />Choose photo</Button>
              <input ref={fileRef} type="file" accept="image/*" capture="user" hidden onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
            </div>
            {field("display_name", "Name")}
            {field("set_up_by", "Who set up this account? (me, parent, teacher…)")}
          </section>
          <section className="profile-card">
            <h2>About me</h2>
            {field("age", "Age")}
            {field("likes", "Things I like", true)}
            {field("dislikes", "Things I don't like", true)}
            {field("sensory_notes", "Sensory notes (sounds, lights, touch)", true)}
          </section>
          <section className="profile-card">
            <h2>How I communicate</h2>
            <div className="grid gap-1.5">
              <Label htmlFor="voice">Voice</Label>
              <select id="voice" className="settings-select" value={p.voice_name ?? ""} onChange={e => set("voice_name", e.target.value || null)}>
                <option value="">Default voice</option>
                {voices.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="rate">Speaking speed</Label>
              <select id="rate" className="settings-select" value={String(p.speech_rate)} onChange={e => set("speech_rate", Number(e.target.value))}>
                <option value="0.65">Slow</option><option value="0.85">Gentle</option><option value="0.9">Calm</option><option value="1">Normal</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="size">Picture size</Label>
              <select id="size" className="settings-select" value={p.symbol_size} onChange={e => set("symbol_size", e.target.value)}>
                <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
              </select>
            </div>
          </section>
          <section className="profile-card">
            <h2>My helper</h2>
            {field("caregiver_name", "Name")}
            {field("caregiver_relationship", "Relationship (parent, teacher, therapist…)")}
            {field("caregiver_phone", "Phone")}
          </section>
          <section className="profile-card" style={{ gridColumn: "1 / -1" }}>
            <h2>Permissions</h2>
            <div className="profile-row"><span className="inline-flex items-center gap-2"><Camera className="size-5" />Use the camera</span><Switch checked={p.allow_camera} onCheckedChange={v => togglePermission("allow_camera", v)} aria-label="Allow camera" /></div>
            <div className="profile-row"><span className="inline-flex items-center gap-2"><ImageIcon className="size-5" />Use my photos</span><Switch checked={p.allow_photos} onCheckedChange={v => togglePermission("allow_photos", v)} aria-label="Allow photos" /></div>
            <div className="profile-row"><span className="inline-flex items-center gap-2"><Mic className="size-5" />Use the microphone</span><Switch checked={p.allow_microphone} onCheckedChange={v => togglePermission("allow_microphone", v)} aria-label="Allow microphone" /></div>
          </section>
        </div>
        <div className="profile-head" style={{ marginTop: 24, justifyContent: "flex-end" }}>
          {status && <span role="status" className="text-sm text-muted-foreground">{status}</span>}
          <Button size="lg" onClick={save}><Check />Save profile</Button>
        </div>
      </div>
    </div>
  );
}

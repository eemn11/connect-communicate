import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * The signed-in user's profile photo as a short-lived signed link, or null
 * when nobody is signed in, no photo is saved, or the link could not be made.
 * Like the nickname hook, this never blocks or fails the page.
 */
export function useAvatarUrl() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user || !active) {
        if (active) setUrl(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("avatar_path")
        .eq("id", user.user.id)
        .maybeSingle();
      const path = data?.avatar_path;
      if (!path) {
        if (active) setUrl(null);
        return;
      }
      const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
      if (active) setUrl(signed?.signedUrl ?? null);
    }
    void load();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      void load();
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return url;
}

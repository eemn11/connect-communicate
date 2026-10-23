import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FALLBACK_NAME, greetingName } from "@/lib/nickname";

/**
 * The signed-in user's saved name, or "friend" when nobody is signed in or no
 * name has been saved yet. The home screen keeps working signed-out, so this
 * never blocks or fails the page.
 */
export function useNickname() {
  const [nickname, setNickname] = useState(FALLBACK_NAME);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        if (active) setNickname(FALLBACK_NAME);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.user.id)
        .maybeSingle();
      if (active) setNickname(greetingName(data?.display_name));
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

  return nickname;
}

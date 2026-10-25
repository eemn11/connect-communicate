import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hasAskedPermissions, markPermissionsAsked } from "@/lib/permissions";

/**
 * Shows the permission prompt once per account on this device: the first time
 * the app is opened while signed in. Signed-out use never prompts.
 */
export function usePermissionsPrompt() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function check() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!active || !user) return;
      setUserId(user.id);
      if (!hasAskedPermissions(user.id)) setOpen(true);
    }
    void check();
    const { data: subscription } = supabase.auth.onAuthStateChange(event => {
      if (event === "SIGNED_IN") void check();
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  function dismiss() {
    if (userId) markPermissionsAsked(userId);
    setOpen(false);
  }

  return { open, dismiss };
}

import { useEffect, useState } from "react";
import { PLANNING_CHANGED, PLANNING_STORE, readPlanning, writePlanning, type PlanningSchedules } from "./planning";

export function usePlanning() {
  const [plans, setPlans] = useState<PlanningSchedules>({});
  useEffect(() => {
    const refresh = () => setPlans(readPlanning());
    const onStorage = (event: StorageEvent) => { if (event.key === PLANNING_STORE || event.key === null) refresh(); };
    refresh();
    window.addEventListener(PLANNING_CHANGED, refresh);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(PLANNING_CHANGED, refresh); window.removeEventListener("storage", onStorage); };
  }, []);
  function savePlans(next: PlanningSchedules) { writePlanning(next); setPlans(next); }
  return { plans, savePlans };
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Workout = { id: number; name: string; image: string; muscleGroups: string[]; equipment: string; difficulty: string; duration: number; caloriesBurned: number; sets: number; reps: string; rating: number; description: string; instructions: string[] };
type Store = { workouts: Workout[]; plan: number[]; saved: number[]; loading: boolean; toast: string; addToPlan: (id: number) => void; save: (id: number) => void; remove: (id: number, kind: "plan" | "saved") => void; done: (id: number) => void };
const FitLogContext = createContext<Store | null>(null);
const APIS = [
  "https://api.abcz.workers.dev/api/fitlog",
  "https://api.api-store.workers.dev/api/fitlog",
];

export function FitLogProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [plan, setPlan] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    queueMicrotask(() => {
      const storedPlan = localStorage.getItem("fitlog-plan");
      const storedSaved = localStorage.getItem("fitlog-saved");
      if (storedPlan) setPlan(JSON.parse(storedPlan));
      if (storedSaved) setSaved(JSON.parse(storedSaved));
      setHydrated(true);
    });

    const loadWorkouts = async () => {
      for (const endpoint of APIS) {
        try {
          const response = await fetch(endpoint);
          if (!response.ok) continue;
          const data = await response.json();
          if (Array.isArray(data)) {
            setWorkouts(data);
            return;
          }
        } catch {
          // Try the alternative API when the primary endpoint is unavailable.
        }
      }
      setWorkouts([]);
    };
    loadWorkouts().finally(() => setLoading(false));
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("fitlog-plan", JSON.stringify(plan)); }, [hydrated, plan]);
  useEffect(() => { if (hydrated) localStorage.setItem("fitlog-saved", JSON.stringify(saved)); }, [hydrated, saved]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2600); return () => clearTimeout(t); }, [toast]);
  const addToPlan = (id: number) => { if (plan.length >= 5) return setToast("Today's plan is full"); if (plan.includes(id)) return setToast("Already in today's plan"); setPlan((v) => [...v, id]); setToast("Added to today's plan"); };
  const save = (id: number) => { if (saved.includes(id)) return setToast("Already saved for later"); setSaved((v) => [...v, id]); setToast("Saved for later"); };
  const remove = (id: number, kind: "plan" | "saved") => { kind === "plan" ? setPlan((v) => v.filter((x) => x !== id)) : setSaved((v) => v.filter((x) => x !== id)); setToast("Workout removed"); };
  const done = (id: number) => { setPlan((v) => v.filter((x) => x !== id)); setToast("Workout marked as done"); };
  return <FitLogContext.Provider value={{ workouts, plan, saved, loading, toast, addToPlan, save, remove, done }}>{children}</FitLogContext.Provider>;
}
export function useFitLog() { const value = useContext(FitLogContext); if (!value) throw new Error("FitLogProvider is missing"); return value; }

export function Header() { const pathname = usePathname(); const { plan, saved } = useFitLog(); return <header className="site-header"><Link href="/" className="brand"><img src="/logo.png" alt="" /> <span>FITLOG</span></Link><nav><Link className={pathname === "/" ? "active" : ""} href="/">Workout</Link><Link className={pathname === "/my-plan" ? "active" : ""} href="/my-plan">My Plan</Link></nav><div className="header-stats"><Link className="stat-pill filled" href="/my-plan">Plan <b>{plan.length}</b></Link><Link className="stat-pill" href="/my-plan">Saved <b>{saved.length}</b></Link></div></header>; }
export function Footer() { return <footer><div className="brand"><img src="/logo.png" alt="" /> <span>FITLOG</span></div><span>© 2026 FitLog — Workout Library. Train hard, log honest.</span></footer>; }
export function Toast() { const { toast } = useFitLog(); return toast ? <div className="toast">✓ {toast}</div> : null; }
export function Shell({ children }: { children: ReactNode }) { return <><Header /><main>{children}</main><Footer /><Toast /></>; }
export function WorkoutCard({ workout }: { workout: Workout }) { return <Link className="workout-card" href={`/workout/${workout.id}`}><div className="card-image"><img src={workout.image} alt={workout.name} /></div><div className="card-body"><div className="tags">{workout.muscleGroups.map((tag) => <span key={tag}>{tag}</span>)}</div><h3>{workout.name}</h3><p className="equipment">⌁ {workout.equipment}</p><div className="stats"><span>◷ {workout.duration} min</span><span>♨ {workout.caloriesBurned} kcal</span><span>★ {workout.rating}</span></div></div></Link>; }
export function Loading() { return <div className="loading"><span /> Loading workouts...</div>; }

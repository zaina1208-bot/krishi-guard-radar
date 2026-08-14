import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useMemo, useState } from "react";
import { Activity, BellRing, IndianRupee, Loader2, Waves } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip as RTooltip, Cell } from "recharts";
import { SiteHeader } from "@/components/krishi/SiteHeader";
import { PhoneAlert } from "@/components/krishi/PhoneAlert";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SEVERITY_HEX, inr, timeAgo, type Scan, type Severity } from "@/lib/krishi/data";
import { scansQuery } from "@/lib/krishi/scans";
import { useLang } from "@/lib/krishi/i18n";

const OutbreakMap = lazy(() => import("@/components/krishi/OutbreakMap"));

export const Route = createFileRoute("/command")({
  head: () => ({
    meta: [
      { title: "District Command Center — KrishiRakshak" },
      {
        name: "description",
        content:
          "Live outbreak heatmap, incoming farmer scans and zone-wide alert broadcasting for Mandya district.",
      },
      { property: "og:title", content: "District Command Center — KrishiRakshak" },
      {
        property: "og:description",
        content: "Watch crop disease outbreaks spread across a district in real time.",
      },
    ],
  }),
  component: CommandCenter,
});

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`surface-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 ${
        accent ? "border-accent/40 bg-accent/10" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-2xl font-extrabold text-foreground">{value}</p>
        <p className="truncate text-[11px] text-muted-foreground">{sub}</p>
      </div>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
    </motion.div>
  );
}

function CommandCenter() {
  const { t } = useLang();
  const { data: scans = [], isLoading } = useQuery(scansQuery);
  const [predicted, setPredicted] = useState(false);

  const stats = useMemo(() => {
    const active = scans.filter((s) => s.status === "active");
    const villages = new Set(active.map((s) => s.village_name));
    const week = scans.filter(
      (s) => Date.now() - new Date(s.created_at).getTime() < 7 * 86400000,
    );
    const counts = new Map<string, number>();
    week.forEach((s) => counts.set(s.disease_name, (counts.get(s.disease_name) ?? 0) + 1));
    const trending = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name: name.split(" ")[0]!, full: name, count }));
    return {
      activeZones: villages.size,
      activeCount: active.length,
      alerted: active.length * 37 + 128,
      trending,
      atRisk: active.length * 18500,
    };
  }, [scans]);

  const feed = useMemo(() => scans.slice(0, 14), [scans]);

  function broadcast(village: string, count: number) {
    toast.success(`Alert broadcast to ${village}`, {
      description: `WhatsApp + SMS sent to farmers within 5 km of ${count} affected farms.`,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight text-foreground">
              {t("commandCenter")}
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              Mandya District, Karnataka · {scans.length} scans on radar
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full border bg-card px-3 py-2">
            <Waves className="h-4 w-4 text-sev-high" />
            <span className="text-xs font-semibold text-foreground">{t("predictedSpread")}</span>
            <Switch checked={predicted} onCheckedChange={setPredicted} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Activity}
            label={t("activeOutbreaks")}
            value={String(stats.activeZones)}
            sub={`${stats.activeCount} active detections`}
          />
          <StatCard
            icon={BellRing}
            label={t("farmersAlerted")}
            value={stats.alerted.toLocaleString("en-IN")}
            sub="WhatsApp + SMS delivered"
          />
          <div className="surface-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("trending")}
            </p>
            <div className="mt-2 h-[62px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trending}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <RTooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: 12, fontSize: 12 }}
                    formatter={(v, _n, p) => [`${v} scans`, (p?.payload as { full?: string })?.full ?? ""]}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stats.trending.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? SEVERITY_HEX.Critical : "#2E7D32"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <StatCard
            icon={IndianRupee}
            label={t("valueAtRisk")}
            value={inr(stats.atRisk)}
            sub="estimated across active zones"
            accent
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="surface-card relative h-[560px] overflow-hidden p-0 lg:h-[calc(100vh-320px)] lg:min-h-[560px]">
            <ClientOnly
              fallback={
                <div className="grid h-full place-items-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="grid h-full place-items-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                }
              >
                <OutbreakMap scans={scans} showPredicted={predicted} onBroadcast={broadcast} />
              </Suspense>
            </ClientOnly>

            <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-2xl border bg-card/95 p-3 text-xs shadow-[var(--shadow-soft)]">
              <p className="mb-1.5 font-bold text-foreground">Severity</p>
              {(["Low", "Medium", "High", "Critical"] as Severity[]).map((s) => (
                <p key={s} className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: SEVERITY_HEX[s] }} />
                  {s}
                </p>
              ))}
              {predicted && <p className="mt-2 text-[10px] italic">Dashed ring = 72h predictive model output</p>}
            </div>
          </div>

          <aside className="surface-card flex max-h-[560px] flex-col overflow-hidden lg:max-h-[calc(100vh-320px)]">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-bold text-foreground">{t("liveFeed")}</p>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-sev-low">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sev-low" /> LIVE
              </span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {isLoading && <p className="p-3 text-sm text-muted-foreground">Loading scans…</p>}
              <AnimatePresence initial={false}>
                {feed.map((s: Scan) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border bg-background/60 p-3"
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <p className="min-w-0 text-sm text-foreground">
                        <span className="font-semibold">{s.farmer_name}</span> in {s.village_name} reported{" "}
                        <span className="font-semibold">{s.disease_name}</span>
                      </p>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                        style={{ background: SEVERITY_HEX[s.severity as Severity] }}
                      >
                        {s.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {s.crop_type} · {s.confidence}% confidence · {timeAgo(s.created_at)}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="border-t p-3">
              <Button
                className="w-full rounded-xl"
                onClick={() => broadcast("all active zones", stats.activeCount)}
              >
                {t("broadcast")}
              </Button>
            </div>
          </aside>
        </div>

        <section className="mt-6 grid items-center gap-8 rounded-3xl bg-secondary/60 p-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              What the neighbouring farmer sees
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Every broadcast lands as a plain-language message in the local language — distance, disease and the
              single next action, with no app install required.
            </p>
          </div>
          <PhoneAlert />
        </section>
      </main>
    </div>
  );
}

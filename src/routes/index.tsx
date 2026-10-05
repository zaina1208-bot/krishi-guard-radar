import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Radar, ScanLine, Users, Sprout, TrendingUp, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/krishi/SiteHeader";
import { PhoneAlert } from "@/components/krishi/PhoneAlert";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/krishi/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KrishiRakshak — Village-Level Crop Disease Outbreak Radar" },
      {
        name: "description",
        content:
          "Scan a leaf, detect crop disease in seconds, and warn every farmer nearby before the outbreak reaches their field.",
      },
      { property: "og:title", content: "KrishiRakshak — Outbreak Radar" },
      {
        property: "og:description",
        content: "AI crop disease early warning with a live village-level outbreak heatmap.",
      },
    ],
  }),
  component: Landing,
});

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const FEATURES = [
  {
    icon: ScanLine,
    title: "Scan in seconds",
    body: "Snap a leaf. The model names the disease, scores its confidence and grades severity instantly.",
  },
  {
    icon: Radar,
    title: "Neighbourhood radar",
    body: "Every scan feeds a shared district map, so a spike in one village warns the next one within minutes.",
  },
  {
    icon: Sprout,
    title: "Advice that fits the field",
    body: "Organic and chemical options, real rupee cost, projected loss and the nearest stocking dealer.",
  },
];

function Landing() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="dark" />

      <section className="hero-gradient relative overflow-hidden px-4 pb-16 pt-12 text-primary-foreground sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -bottom-40 left-10 h-72 w-72 rounded-full bg-primary-glow/25 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative mx-auto w-full max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-5 w-fit max-w-full rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest sm:text-xs"
          >
            Mandya District · Live pilot
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-balance text-3xl font-extrabold leading-[1.08] tracking-tight min-[420px]:text-4xl sm:text-6xl"
          >
            {t("tagline")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="mx-auto mt-5 max-w-2xl text-balance text-sm leading-relaxed text-primary-foreground/80 min-[420px]:text-base sm:text-lg"
          >
            KrishiRakshak turns one farmer's leaf photo into a district-wide early warning. Disease is caught
            where it starts — and the next village hears about it before the spores arrive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.6 }}
            className="mt-7 grid grid-cols-1 gap-3 min-[420px]:flex min-[420px]:flex-wrap min-[420px]:items-center min-[420px]:justify-center sm:mt-9"
          >
            <Button asChild size="lg" variant="secondary" className="min-h-[52px] w-full rounded-full px-7 text-base font-semibold min-[420px]:w-auto">
              <Link to="/scan">
                <ScanLine className="mr-1 h-5 w-5 shrink-0" /> <span className="truncate">{t("scanCrop")}</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="min-h-[52px] w-full rounded-full bg-accent px-7 text-base font-semibold text-accent-foreground hover:bg-accent/90 min-[420px]:w-auto"
            >
              <Link to="/command">
                <Radar className="mr-1 h-5 w-5 shrink-0" /> <span className="truncate">{t("commandCenter")}</span>
              </Link>
            </Button>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:mt-16 sm:gap-4">
            {[
              { icon: Users, value: 12400, suffix: "", label: "farmers protected" },
              { icon: TrendingUp, value: 340, suffix: "", label: "outbreaks contained early" },
              { icon: Sprout, value: 47, suffix: " Cr", label: "₹ harvest value defended" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/10 p-6 backdrop-blur"
              >
                <s.icon className="mx-auto mb-2 h-6 w-6 text-accent" />
                <p className="text-3xl font-extrabold">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-sm text-primary-foreground/75">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="surface-card p-5 sm:p-6"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h2 className="text-balance text-base font-bold text-foreground sm:text-lg">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 sm:gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-balance text-2xl font-extrabold tracking-tight text-foreground min-[420px]:text-3xl sm:text-4xl">
              The warning reaches the phone in the pocket.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base md:mx-0">
              When density crosses the outbreak threshold in a zone, every registered farmer within 5 km gets a
              plain-language WhatsApp/SMS alert — with the disease, the distance and the next action.
            </p>
            <Button asChild className="mt-6 min-h-[48px] w-full rounded-full px-6 min-[420px]:w-auto">
              <Link to="/command">
                See the command center <ArrowRight className="ml-1 h-4 w-4 shrink-0" />
              </Link>
            </Button>
          </motion.div>
          <PhoneAlert />
        </div>
      </section>

      <footer className="border-t px-4 py-8 text-center text-xs leading-relaxed text-muted-foreground sm:px-8 sm:text-sm">
        KrishiRakshak · Outbreak Radar — hackathon demo with simulated detection on seeded district data.
      </footer>
    </div>
  );
}

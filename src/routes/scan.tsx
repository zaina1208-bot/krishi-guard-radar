import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  Camera,
  Upload,
  MapPin,
  Loader2,
  ShieldCheck,
  FlaskConical,
  Leaf,
  Store,
  CalendarClock,
  Radar,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/krishi/SiteHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLang } from "@/lib/krishi/i18n";
import {
  CROPS,
  DEALERS,
  VILLAGES,
  inr,
  pickDisease,
  severityFromConfidence,
  type Severity,
} from "@/lib/krishi/data";
import { insertScan } from "@/lib/krishi/scans";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan My Crop — KrishiRakshak" },
      {
        name: "description",
        content:
          "Upload a leaf photo, get an instant disease reading with severity, treatment cost and nearby dealer.",
      },
      { property: "og:title", content: "Scan My Crop — KrishiRakshak" },
      {
        property: "og:description",
        content: "Instant crop disease detection and treatment advisory for Indian farmers.",
      },
    ],
  }),
  component: ScanPage,
});

const SEV_CLASS: Record<Severity, string> = {
  Low: "bg-sev-low/15 text-sev-low border-sev-low/30",
  Medium: "bg-sev-medium/15 text-sev-medium border-sev-medium/30",
  High: "bg-sev-high/15 text-sev-high border-sev-high/30",
  Critical: "bg-sev-critical/15 text-sev-critical border-sev-critical/30",
};

const FARMERS = ["Ramesh Gowda", "Kavitha S", "Manjunath H R", "Devaraju N"];

type Result = {
  disease: ReturnType<typeof pickDisease>;
  confidence: number;
  severity: Severity;
};

function ScanPage() {
  const { t } = useLang();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<string>("Rice");
  const [coords, setCoords] = useState<{ lat: number; lng: number; village: string }>({
    lat: VILLAGES[0]!.lat,
    lng: VILLAGES[0]!.lng,
    village: VILLAGES[0]!.village,
  });
  const [phase, setPhase] = useState<"idle" | "analyzing" | "done">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [notify, setNotify] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  function readFile(file?: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  function detectLocation() {
    if (!("geolocation" in navigator)) {
      toast.info("Using demo village location (Srirangapatna).");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, village: "My Field" });
        toast.success("Field location captured.");
      },
      () => toast.info("Location blocked — using demo village (Srirangapatna)."),
      { timeout: 6000 },
    );
  }

  function analyze() {
    if (!image) {
      toast.error("Add a leaf photo first.");
      return;
    }
    setPhase("analyzing");
    setSubmitted(false);
    setTimeout(() => {
      const disease = pickDisease(crop);
      const confidence = Math.round((83 + Math.random() * 15) * 10) / 10;
      setResult({ disease, confidence, severity: severityFromConfidence(confidence) });
      setPhase("done");
    }, 2600);
  }

  async function submitToRadar() {
    if (!result) return;
    try {
      await insertScan({
        crop_type: crop,
        disease_name: result.disease.name,
        confidence: result.confidence,
        severity: result.severity,
        latitude: coords.lat,
        longitude: coords.lng,
        village_name: coords.village === "My Field" ? VILLAGES[0]!.village : coords.village,
        farmer_name: FARMERS[Math.floor(Math.random() * FARMERS.length)]!,
        status: "active",
      });
      await qc.invalidateQueries({ queryKey: ["scans"] });
      setSubmitted(true);
      toast.success(
        notify ? "Logged. 214 nearby farmers alerted." : "Logged privately to your scan history.",
      );
    } catch {
      toast.error("Could not reach the radar. Try again.");
    }
  }

  const dealer = DEALERS[0]!;

  return (
    <div className="min-h-screen bg-background pb-16">
      <SiteHeader />

      <main className="mx-auto w-full max-w-xl px-4 py-5 sm:px-6 sm:py-6">
        <h1 className="text-balance text-xl font-extrabold tracking-tight text-foreground min-[420px]:text-2xl">{t("scanCrop")}</h1>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Three taps: photo, crop, analyze. The result also protects the fields around you.
        </p>

        {/* Step 1 */}
        <section className="surface-card mt-5 p-4 sm:p-5">
          <p className="text-sm font-semibold text-foreground">{t("uploadLeaf")}</p>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              readFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileRef.current?.click()}
            className="relative mt-3 grid min-h-44 cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-secondary/40 p-4 text-center transition hover:border-primary-glow"
          >
            {image ? (
              <>
                <img src={image} alt="Uploaded crop leaf" className="max-h-64 w-full rounded-xl object-cover" />
                {phase === "analyzing" && (
                  <>
                    <div className="absolute inset-0 bg-primary-deep/35" />
                    <motion.div
                      initial={{ top: "0%" }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-0 h-1 w-full bg-accent shadow-[0_0_22px_6px_var(--accent)]"
                    />
                  </>
                )}
              </>
            ) : (
              <div className="text-muted-foreground">
                <div className="mb-2 flex items-center justify-center gap-3">
                  <Upload className="h-6 w-6" />
                  <Camera className="h-6 w-6" />
                </div>
                <p className="text-sm">{t("dropHint")}</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => readFile(e.target.files?.[0])}
          />

          <div className="mt-4 grid gap-3">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("cropType")}
              </Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CROPS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={detectLocation}
              className="flex min-h-[48px] flex-col gap-1 rounded-xl bg-secondary px-3 py-2.5 text-left text-sm min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between"
            >
              <span className="flex min-w-0 items-center gap-2 font-medium text-secondary-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" /> <span className="truncate">{t("location")}: {coords.village}</span>
              </span>
              <span className="shrink-0 pl-6 text-xs text-muted-foreground min-[420px]:pl-0">
                {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
              </span>
            </button>
          </div>

          <Button
            className="mt-4 min-h-[52px] w-full rounded-xl py-3 text-base font-semibold"
            onClick={analyze}
            disabled={phase === "analyzing"}
          >
            {phase === "analyzing" ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("analyzing")}
              </>
            ) : (
              t("analyze")
            )}
          </Button>
        </section>

        <AnimatePresence>
          {phase === "done" && result && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-5 space-y-5"
            >
              {/* Step 2 — result */}
              <section className="surface-card p-4 sm:p-5">
                <div className="flex flex-col gap-3 min-[420px]:grid min-[420px]:grid-cols-[minmax(0,1fr)_auto] min-[420px]:items-start">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("result")}
                    </p>
                    <h2 className="text-balance break-words text-xl font-extrabold text-foreground min-[420px]:text-2xl">{result.disease.name}</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {crop} · {t("confidence")} {result.confidence}%
                    </p>
                  </div>
                  <Badge variant="outline" className={`w-fit shrink-0 rounded-full px-3 py-1 ${SEV_CLASS[result.severity]}`}>
                    {result.severity}
                  </Badge>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">{result.disease.explain}</p>
              </section>

              {/* Step 3 — advisory */}
              <section className="surface-card p-4 sm:p-5">
                <p className="text-sm font-bold text-foreground">{t("advisory")}</p>
                <div className="mt-3 space-y-3">
                  <div className="rounded-2xl bg-secondary/70 p-3 sm:p-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
                      <Leaf className="h-4 w-4 shrink-0" /> {t("organic")}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/80">{result.disease.organic}</p>
                  </div>
                  <div className="rounded-2xl bg-accent/10 p-3 sm:p-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                      <FlaskConical className="h-4 w-4 shrink-0" /> {t("chemical")}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/80">{result.disease.chemical}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                  <div className="rounded-2xl border p-3">
                    <p className="text-xs text-muted-foreground">{t("estCost")}</p>
                    <p className="break-words text-lg font-extrabold text-foreground">{inr(result.disease.cost)}</p>
                    <p className="text-[11px] text-muted-foreground">per acre</p>
                  </div>
                  <div className="rounded-2xl border border-sev-critical/30 bg-sev-critical/10 p-3">
                    <p className="text-xs text-muted-foreground">{t("yieldLoss")}</p>
                    <p className="break-words text-lg font-extrabold text-sev-critical">{inr(result.disease.lossPerAcre)}</p>
                    <p className="text-[11px] text-muted-foreground">per acre</p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl border p-3">
                  <Store className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{t("dealer")}</p>
                    <p className="break-words text-sm font-semibold text-foreground">{dealer.name}</p>
                    <p className="break-words text-xs leading-relaxed text-muted-foreground">
                      {dealer.village} · {dealer.km} km · {dealer.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-primary/5 p-3">
                  <div className="min-w-0 flex-1 pr-1">
                    <p className="text-sm font-semibold text-foreground">{t("notify")}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{t("notifyHint")}</p>
                  </div>
                  <Switch checked={notify} onCheckedChange={setNotify} className="shrink-0" />
                </div>

                <Button className="mt-4 min-h-[52px] w-full rounded-xl py-3 text-[15px] font-semibold sm:text-base" onClick={submitToRadar} disabled={submitted}>
                  {submitted ? (
                    <>
                      <ShieldCheck className="mr-2 h-5 w-5 shrink-0" /> <span className="truncate">Added to Outbreak Radar</span>
                    </>
                  ) : (
                    <>
                      <Radar className="mr-2 h-5 w-5 shrink-0" /> <span className="truncate">{t("submit")}</span>
                    </>
                  )}
                </Button>
              </section>

              {/* Step 4 */}
              <AnimatePresence>
                {submitted && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="surface-card border-accent/40 bg-accent/10 p-4 sm:p-5"
                  >
                    <p className="flex items-start gap-2 text-sm font-bold text-accent-foreground">
                      <CalendarClock className="h-5 w-5 shrink-0" /> <span>{t("followUp")}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/75">{t("followUpBody")}</p>
                    <div className="mt-4 grid grid-cols-1 gap-2 min-[420px]:flex min-[420px]:flex-wrap">
                      <Button variant="secondary" className="min-h-[48px] w-full rounded-full min-[420px]:w-auto" onClick={() => {
                        setImage(null);
                        setPhase("idle");
                        setResult(null);
                        setSubmitted(false);
                      }}>
                        {t("scanAnother")}
                      </Button>
                      <Button asChild variant="outline" className="min-h-[48px] w-full rounded-full min-[420px]:w-auto">
                        <Link to="/command">{t("commandCenter")}</Link>
                      </Button>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

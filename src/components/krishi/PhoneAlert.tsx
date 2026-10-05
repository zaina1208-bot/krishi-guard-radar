import { motion } from "framer-motion";
import { ShieldAlert, Check } from "lucide-react";

export function PhoneAlert({ village = "Srirangapatna" }: { village?: string }) {
  return (
    <div className="mx-auto w-full max-w-[280px] rounded-[2.5rem] border-8 border-primary-deep bg-primary-deep p-1 shadow-[var(--shadow-lift)]">
      <div className="relative h-[480px] overflow-hidden rounded-[2rem] bg-[oklch(0.96_0.01_140)] p-3 min-[420px]:h-[520px]">
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-primary-deep/30" />
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-primary-foreground">
          <ShieldAlert className="h-4 w-4" />
          <span className="text-xs font-semibold">KrishiRakshak Alerts</span>
        </div>

        <div className="space-y-3">
          {[
            {
              delay: 0.2,
              text: `⚠️ Rice Blast detected 3km from your farm (${village}). Inspect your crop and consider a preventive spray. Tap for guidance.`,
              time: "10:24 AM",
            },
            {
              delay: 1.1,
              text: "🌦️ Humidity 88% tonight — blast risk high. Spray before 9 AM tomorrow for best effect.",
              time: "10:26 AM",
            },
            {
              delay: 2.0,
              text: "🧪 Tricyclazole available at Kaveri Krishi Kendra, 5.8 km. Stock: yes.",
              time: "10:27 AM",
            },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: m.delay, duration: 0.5, ease: "easeOut" }}
              className="max-w-[92%] rounded-2xl rounded-tl-sm bg-card p-3 shadow-[var(--shadow-soft)]"
            >
              <p className="text-[13px] leading-snug text-foreground">{m.text}</p>
              <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                {m.time} <Check className="h-3 w-3 text-primary-glow" />
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="absolute bottom-4 left-3 right-3 rounded-full bg-accent px-4 py-2 text-center text-xs font-semibold text-accent-foreground"
        >
          Sent to 214 farmers within 5 km
        </motion.div>
      </div>
    </div>
  );
}

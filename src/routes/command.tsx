import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClientOnly } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useMemo, useState } from "react";
import {
  Activity,
  BellRing,
  IndianRupee,
  Radar,
  Loader2,
  Waves,
} from "lucide-react";
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
  component: CommandCenter;
});

function CommandCenter() {
  return null;
}

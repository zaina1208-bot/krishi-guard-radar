export type Severity = "Low" | "Medium" | "High" | "Critical";

export type Scan = {
  id: string;
  crop_type: string;
  disease_name: string;
  confidence: number;
  severity: Severity;
  latitude: number;
  longitude: number;
  village_name: string;
  farmer_name: string;
  status: string;
  created_at: string;
};

export const DISTRICT_CENTER: [number, number] = [12.5242, 76.8958];

export const VILLAGES = [
  { village: "Srirangapatna", lat: 12.4181, lng: 76.6947 },
  { village: "Pandavapura", lat: 12.501, lng: 76.665 },
  { village: "Mandya Town", lat: 12.5242, lng: 76.8958 },
  { village: "Maddur", lat: 12.5847, lng: 77.0433 },
  { village: "Malavalli", lat: 12.3847, lng: 77.0611 },
  { village: "Nagamangala", lat: 12.818, lng: 76.755 },
];

export const CROPS = ["Rice", "Wheat", "Cotton", "Tomato", "Sugarcane", "Maize"] as const;

type DiseaseInfo = {
  name: string;
  explain: string;
  organic: string;
  chemical: string;
  cost: number;
  lossPerAcre: number;
};

export const DISEASE_BOOK: Record<string, DiseaseInfo[]> = {
  Rice: [
    {
      name: "Rice Blast",
      explain:
        "Diamond-shaped grey lesions on the leaf. It spreads fast in humid weather and can empty the grain heads.",
      organic: "Spray neem oil 3% + Pseudomonas fluorescens (5g/litre), twice a week apart.",
      chemical: "Tricyclazole 75% WP @ 0.6g/litre, one spray now, repeat after 12 days.",
      cost: 850,
      lossPerAcre: 18000,
    },
    {
      name: "Bacterial Leaf Blight",
      explain: "Yellow wavy streaks from the leaf tip drying downward. Spreads with irrigation water.",
      organic: "Cow-dung slurry filtrate spray + stop flood irrigation for 4 days.",
      chemical: "Copper oxychloride 0.25% + Streptocycline 100ppm spray.",
      cost: 700,
      lossPerAcre: 15000,
    },
    {
      name: "Brown Spot",
      explain: "Small brown oval spots, usually a sign of potash-hungry soil plus fungal attack.",
      organic: "Potash-rich wood ash + neem cake soil dressing.",
      chemical: "Mancozeb 75% WP @ 2g/litre.",
      cost: 520,
      lossPerAcre: 9000,
    },
  ],
  Sugarcane: [
    {
      name: "Red Rot",
      explain: "Inner cane turns red with white patches and smells of alcohol. Highly infectious in a field.",
      organic: "Uproot and burn affected clumps, drench with Trichoderma viride.",
      chemical: "Carbendazim 50% WP @ 2g/litre as sett dip and soil drench.",
      cost: 1400,
      lossPerAcre: 42000,
    },
    {
      name: "Sugarcane Smut",
      explain: "A long black whip emerges from the cane top. Cuts sugar recovery sharply.",
      organic: "Rogue out whips into a sealed bag; use disease-free setts next season.",
      chemical: "Propiconazole 25% EC @ 1ml/litre sett treatment.",
      cost: 1100,
      lossPerAcre: 30000,
    },
  ],
  Tomato: [
    {
      name: "Late Blight",
      explain: "Water-soaked dark patches on leaves with white mould underneath. Can wipe a plot in 4 days.",
      organic: "Bordeaux mixture 1% + remove lower infected leaves.",
      chemical: "Metalaxyl + Mancozeb @ 2g/litre, repeat after 8 days.",
      cost: 950,
      lossPerAcre: 26000,
    },
    {
      name: "Early Blight",
      explain: "Brown spots with concentric rings on older leaves, moving upward.",
      organic: "Neem oil 3% + Trichoderma soil application.",
      chemical: "Chlorothalonil 75% WP @ 2g/litre.",
      cost: 640,
      lossPerAcre: 14000,
    },
    {
      name: "Leaf Curl Virus",
      explain: "Curled, thickened, cup-shaped leaves. Carried by whitefly, not curable — control the vector.",
      organic: "Yellow sticky traps + neem soap spray for whitefly.",
      chemical: "Imidacloprid 17.8% SL @ 0.3ml/litre for whitefly control.",
      cost: 780,
      lossPerAcre: 22000,
    },
  ],
  Cotton: [
    {
      name: "Bacterial Blight",
      explain: "Angular water-soaked spots on leaves and black arm on stems.",
      organic: "Pseudomonas fluorescens spray + balanced potash.",
      chemical: "Copper oxychloride 3g/litre + Streptocycline.",
      cost: 900,
      lossPerAcre: 20000,
    },
    {
      name: "Cotton Leaf Curl",
      explain: "Upward curling with thick veins, stunted bolls. Whitefly borne.",
      organic: "Sticky traps + neem-based spray every 7 days.",
      chemical: "Diafenthiuron 50% WP @ 1g/litre.",
      cost: 1050,
      lossPerAcre: 24000,
    },
  ],
  Wheat: [
    {
      name: "Yellow Rust",
      explain: "Yellow powdery stripes along the leaf veins. Cool, moist weather accelerates it.",
      organic: "Remove volunteer plants, spray cow-urine extract 10%.",
      chemical: "Propiconazole 25% EC @ 1ml/litre.",
      cost: 720,
      lossPerAcre: 16000,
    },
    {
      name: "Powdery Mildew",
      explain: "White floury growth on the leaf surface reducing grain filling.",
      organic: "Wettable sulphur 0.2% spray.",
      chemical: "Hexaconazole 5% EC @ 2ml/litre.",
      cost: 600,
      lossPerAcre: 11000,
    },
  ],
  Maize: [
    {
      name: "Fall Armyworm Damage",
      explain: "Ragged holes and moist sawdust-like frass in the whorl. Larvae feed at night.",
      organic: "Sand + lime in the whorl, release Trichogramma cards.",
      chemical: "Emamectin benzoate 5% SG @ 0.4g/litre into the whorl.",
      cost: 880,
      lossPerAcre: 19000,
    },
    {
      name: "Turcicum Leaf Blight",
      explain: "Long cigar-shaped grey-green lesions on leaves.",
      organic: "Crop rotation + Trichoderma seed treatment.",
      chemical: "Mancozeb 75% WP @ 2.5g/litre.",
      cost: 640,
      lossPerAcre: 13000,
    },
  ],
};

export const DEALERS = [
  { name: "Sri Chamundeshwari Agro Centre", village: "Mandya Town", phone: "+91 98450 21134", km: 3.2 },
  { name: "Kaveri Krishi Kendra", village: "Srirangapatna", phone: "+91 99012 77450", km: 5.8 },
  { name: "Raitha Samparka Kendra", village: "Maddur", phone: "+91 94488 30219", km: 7.1 },
];

export function pickDisease(crop: string) {
  const list = DISEASE_BOOK[crop] ?? DISEASE_BOOK["Rice"]!;
  return list[Math.floor(Math.random() * list.length)]!;
}

export function severityFromConfidence(confidence: number): Severity {
  if (confidence > 95) return "Critical";
  if (confidence > 90) return "High";
  if (confidence > 85) return "Medium";
  return "Low";
}

export const SEVERITY_COLOR: Record<Severity, string> = {
  Low: "var(--sev-low)",
  Medium: "var(--sev-medium)",
  High: "var(--sev-high)",
  Critical: "var(--sev-critical)",
};

export const SEVERITY_HEX: Record<Severity, string> = {
  Low: "#4CAF50",
  Medium: "#F9A825",
  High: "#EF6C00",
  Critical: "#C62828",
};

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(diff / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export function inr(value: number) {
  return "₹" + value.toLocaleString("en-IN");
}

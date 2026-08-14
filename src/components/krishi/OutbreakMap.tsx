import { MapContainer, TileLayer, CircleMarker, Circle, Popup, Tooltip } from "react-leaflet";
import { useMemo } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { DISTRICT_CENTER, SEVERITY_HEX, VILLAGES, inr, type Scan, type Severity } from "@/lib/krishi/data";

type Props = {
  scans: Scan[];
  showPredicted: boolean;
  onBroadcast: (village: string, count: number) => void;
};

function clusterByVillage(scans: Scan[]) {
  return VILLAGES.map((v) => {
    const items = scans.filter((s) => s.village_name === v.village);
    const active = items.filter((s) => s.status === "active");
    const counts = new Map<string, number>();
    items.forEach((s) => counts.set(s.disease_name, (counts.get(s.disease_name) ?? 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    const trend = [0, 1, 2, 3, 4, 5, 6].map((d) => ({
      v: items.filter((s) => {
        const days = (Date.now() - new Date(s.created_at).getTime()) / 86400000;
        return days <= 7 - d && days > 6 - d;
      }).length,
    }));
    return {
      ...v,
      items,
      activeCount: active.length,
      topDisease: top?.[0] ?? "No detections",
      trend,
    };
  }).filter((c) => c.items.length > 0);
}

export default function OutbreakMap({ scans, showPredicted, onBroadcast }: Props) {
  const clusters = useMemo(() => clusterByVillage(scans), [scans]);

  return (
    <MapContainer
      center={DISTRICT_CENTER}
      zoom={10}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {clusters.map((c) => (
        <Circle
          key={`heat-${c.village}`}
          center={[c.lat, c.lng]}
          radius={1400 + c.activeCount * 520}
          pathOptions={{
            color: "transparent",
            fillColor: c.activeCount > 6 ? SEVERITY_HEX.Critical : c.activeCount > 3 ? SEVERITY_HEX.High : SEVERITY_HEX.Medium,
            fillOpacity: 0.22,
          }}
        />
      ))}

      {showPredicted &&
        clusters.map((c) => (
          <Circle
            key={`pred-${c.village}`}
            center={[c.lat, c.lng]}
            radius={3200 + c.activeCount * 900}
            className="spread-ring"
            pathOptions={{
              color: SEVERITY_HEX.High,
              weight: 1.5,
              dashArray: "6 8",
              fillColor: SEVERITY_HEX.High,
              fillOpacity: 0.12,
            }}
          >
            <Tooltip direction="top">Predicted 72h spread risk — model output</Tooltip>
          </Circle>
        ))}

      {scans.map((s) => (
        <CircleMarker
          key={s.id}
          center={[s.latitude, s.longitude]}
          radius={s.status === "active" ? 7 : 5}
          className={s.status === "active" ? "pulse-marker" : undefined}
          pathOptions={{
            color: "#ffffff",
            weight: 1.5,
            fillColor: SEVERITY_HEX[s.severity as Severity] ?? SEVERITY_HEX.Medium,
            fillOpacity: s.status === "active" ? 0.9 : 0.4,
          }}
        >
          <Tooltip direction="top">
            {s.disease_name} · {s.severity}
          </Tooltip>
        </CircleMarker>
      ))}

      {clusters.map((c) => (
        <CircleMarker
          key={`hub-${c.village}`}
          center={[c.lat, c.lng]}
          radius={13}
          pathOptions={{ color: "#1B5E20", weight: 2, fillColor: "#2E7D32", fillOpacity: 0.85 }}
        >
          <Popup minWidth={240}>
            <div className="space-y-2">
              <p className="text-base font-bold text-primary-deep">{c.village}</p>
              <p className="text-sm">
                Dominant: <span className="font-semibold">{c.topDisease}</span>
              </p>
              <p className="text-sm">
                Affected farms: <span className="font-semibold">{c.items.length}</span> ({c.activeCount} active)
              </p>
              <p className="text-sm">
                Value at risk: <span className="font-semibold">{inr(c.activeCount * 18500)}</span>
              </p>
              <div className="h-10 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={c.trend}>
                    <Line type="monotone" dataKey="v" stroke="#C62828" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <Button size="sm" className="w-full" onClick={() => onBroadcast(c.village, c.items.length)}>
                Broadcast Alert to Zone
              </Button>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

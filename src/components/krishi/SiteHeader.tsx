import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { LANGS, useLang } from "@/lib/krishi/i18n";
import { cn } from "@/lib/utils";

export function SiteHeader({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, setLang, t } = useLang();
  const dark = variant === "dark";

  return (
    <header
      className={cn(
        "sticky top-0 z-[1000] grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 backdrop-blur sm:flex sm:justify-between sm:px-8",
        dark ? "bg-primary-deep/80 text-primary-foreground" : "border-b bg-background/85 text-foreground",
      )}
    >
      <Link to="/" className="flex min-w-0 items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
          <Leaf className="h-5 w-5" />
        </span>
        <span className="truncate text-lg font-extrabold tracking-tight">
          {t("appName")} <span className="font-medium opacity-70">· Outbreak Radar</span>
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-3">
        <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
          <Link to="/scan" className="opacity-80 transition hover:opacity-100">
            {t("scanCrop")}
          </Link>
          <Link to="/command" className="opacity-80 transition hover:opacity-100">
            {t("commandCenter")}
          </Link>
        </nav>
        <div
          className={cn(
            "flex items-center rounded-full p-0.5",
            dark ? "bg-primary-foreground/15" : "bg-secondary",
          )}
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold transition",
                lang === l.code
                  ? "bg-accent text-accent-foreground"
                  : dark
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, Menu, X, ScanLine, Radar, Home } from "lucide-react";
import { useState } from "react";
import { LANGS, useLang } from "@/lib/krishi/i18n";
import { cn } from "@/lib/utils";

export function SiteHeader({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, setLang, t } = useLang();
  const dark = variant === "dark";
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { to: "/", label: t("appName"), icon: Home },
    { to: "/scan", label: t("scanCrop"), icon: ScanLine },
    { to: "/command", label: t("commandCenter"), icon: Radar },
  ] as const;

  return (
    <header
      className={cn(
        "sticky top-0 z-[1000] backdrop-blur",
        dark ? "bg-primary-deep/85 text-primary-foreground" : "border-b bg-background/90 text-foreground",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 flex-1 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="min-w-0 truncate text-base font-extrabold tracking-tight sm:text-lg">
            {t("appName")}{" "}
            <span className="hidden font-medium opacity-70 min-[420px]:inline sm:inline">
              · Outbreak Radar
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            <Link
              to="/scan"
              className="rounded-full px-3 py-1.5 opacity-80 transition hover:bg-black/5 hover:opacity-100"
              activeProps={{ className: "!opacity-100 bg-black/5 font-semibold" }}
            >
              {t("scanCrop")}
            </Link>
            <Link
              to="/command"
              className="rounded-full px-3 py-1.5 opacity-80 transition hover:bg-black/5 hover:opacity-100"
              activeProps={{ className: "!opacity-100 bg-black/5 font-semibold" }}
            >
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
                aria-pressed={lang === l.code}
                className={cn(
                  "min-h-[28px] min-w-[40px] rounded-full px-2.5 py-1 text-xs font-semibold transition",
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
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl transition md:hidden",
              dark ? "bg-primary-foreground/15 hover:bg-primary-foreground/25" : "bg-secondary hover:bg-secondary/70",
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className={cn(
            "border-t px-4 pb-4 pt-2 md:hidden",
            dark ? "border-primary-foreground/15 bg-primary-deep" : "border-border bg-background",
          )}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-[48px] items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold transition",
                pathname === l.to
                  ? "bg-accent/20 text-foreground"
                  : "text-foreground/80 hover:bg-black/5",
                dark && pathname !== l.to && "text-primary-foreground/90 hover:bg-primary-foreground/10",
                dark && pathname === l.to && "bg-accent/25 text-primary-foreground",
              )}
            >
              <l.icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{l.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

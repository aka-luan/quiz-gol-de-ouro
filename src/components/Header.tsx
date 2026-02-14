"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CirclePlay, Home, ShieldCheck, Trophy } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/quiz", label: "Quiz", icon: CirclePlay },
  { href: "/ranking", label: "Ranking", icon: BarChart3 },
  { href: "/conquistas", label: "Conquistas", icon: Trophy },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Header() {
  const pathname = usePathname();

  return (
    <header className="mx-auto mb-5 w-full max-w-6xl">
      <div className="card-surface border-surface-2 mb-4 flex items-center justify-between border px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-button text-deep rounded-lg p-1.5">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-sm leading-none font-semibold tracking-wide uppercase">
              Quiz Bola de Ouro
            </p>
            <p className="text-text-secondary font-mono text-[11px] leading-none uppercase tracking-[0.12em]">
              Modo app
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  active ?
                    "bg-gradient-button text-deep border-transparent shadow-elevated"
                  : "bg-surface-1 border-surface-2 text-text-secondary hover:text-text-primary"
                }`}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <nav className="fixed inset-x-0 bottom-3 z-50 px-3 md:hidden">
        <ul className="bg-deep/92 border-surface-2 mx-auto grid w-full max-w-xl grid-cols-4 gap-1 rounded-full border p-1 backdrop-blur-xl">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2 text-xs font-medium transition ${
                    active ?
                      "bg-gradient-button text-deep shadow-elevated"
                    : "text-text-secondary hover:text-text-primary"
                  }`}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Header;

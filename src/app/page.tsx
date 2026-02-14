import Link from "next/link";
import { ArrowRight, BarChart3, CirclePlay, Sparkles, Trophy } from "lucide-react";

const APP_HOOKS = [
  {
    href: "/quiz",
    title: "Iniciar quiz",
    description: "Rodada rapida com 10 perguntas.",
    icon: CirclePlay,
  },
  {
    href: "/ranking",
    title: "Ver ranking",
    description: "Acompanhe sua evolucao no jogo.",
    icon: BarChart3,
  },
  {
    href: "/conquistas",
    title: "Conquistas",
    description: "Escolha seu proximo desafio.",
    icon: Trophy,
  },
] as const;

const page = () => {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-2">
      <section className="card-surface border-surface-2 relative overflow-hidden border px-6 py-7 sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/15 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="badge mb-4 font-mono text-xs tracking-[0.14em] uppercase">
            Quiz Bola de Ouro
          </span>
          <h1 className="font-display text-4xl leading-tight font-semibold sm:text-5xl">
            Pronto para entrar em campo?
          </h1>
          <p className="text-text-secondary mt-3 max-w-xl text-sm sm:text-base">
            Responda perguntas, mantenha sequencia e avance no ranking.
          </p>

          <Link
            href="/quiz"
            className="bg-gradient-button text-deep shadow-elevated mt-6 inline-flex min-w-52 items-center justify-center rounded-full px-8 py-3 text-base font-semibold transition hover:scale-[1.02] active:scale-[0.98]">
            Jogar
          </Link>

          <div className="mt-5 flex items-center gap-2">
            <span className="h-2 w-6 rounded-full bg-accent-amber-400" />
            <span className="bg-surface-2 h-2 w-2 rounded-full" />
            <span className="bg-surface-2 h-2 w-2 rounded-full" />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {APP_HOOKS.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="bg-surface-1 border-surface-2 shadow-elevated group flex items-start gap-3 rounded-2xl border p-4 transition hover:border-accent-amber-500/50">
              <span className="bg-deep mt-0.5 rounded-xl p-2">
                <Icon className="h-4 w-4 text-accent-amber-400" />
              </span>

              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-sm font-semibold">{item.title}</span>
                <span className="text-text-secondary text-xs">{item.description}</span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent-amber-400">
                  Abrir
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          );
        })}
      </section>

      <section className="bg-surface-1 border-surface-2 flex items-center gap-3 rounded-2xl border px-4 py-3">
        <span className="bg-deep rounded-lg p-2">
          <Sparkles className="h-4 w-4 text-accent-amber-400" />
        </span>
        <p className="text-text-secondary text-sm">
          Dica rapida: termine uma rodada e ja confira ranking e conquistas para definir o proximo alvo.
        </p>
      </section>
    </main>
  );
};

export default page;

import { SKOOL_URL } from "@/lib/contact";

export function SkoolClassroomBanner() {
  return (
    <section className="rounded-3xl glass-panel border border-emerald-500/20 bg-emerald-50/50 p-6 dark:border-emerald-500/30 dark:bg-slate-900/50 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
      <div className="min-w-0">
        <p className="inline-flex rounded-full border border-emerald-500/30 bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-slate-950/60 dark:text-emerald-200">
          VIP 專屬社群與課程
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Tenth Project Skool 官方教室
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          點擊前往 Skool 觀看最新 10 小時 Vibe Coding 課程、Workshop 錄影與參與社群討論。
        </p>
      </div>
      <a
        href={SKOOL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-800 sm:mt-0"
      >
        🚀 開啟 Skool 教室
      </a>
    </section>
  );
}

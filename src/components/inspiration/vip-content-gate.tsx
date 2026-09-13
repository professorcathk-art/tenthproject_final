import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";

export function VipContentGate({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-8 overflow-hidden rounded-3xl border border-emerald-500/20 dark:border-emerald-500/30">
      <div className="max-h-[400px] overflow-hidden blur-sm shadow-inner">{children}</div>
      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-white via-white/80 to-transparent p-6 dark:from-slate-950 dark:via-slate-950/85">
        <div className="w-full max-w-lg rounded-3xl border border-emerald-500/20 bg-white/90 p-6 text-center shadow-lg dark:border-emerald-500/30 dark:bg-slate-900/80">
          <p className="text-sm font-semibold leading-relaxed text-slate-900 dark:text-white">
            🔒 這是 VIP 終身會員專屬內容。升級 VIP 即可查看完整系統架構與 Copy-Paste Prompt。
          </p>
          <JoinLifetimeButton className="mt-4">⚡ 升級 VIP 終身會員解鎖</JoinLifetimeButton>
        </div>
      </div>
    </div>
  );
}

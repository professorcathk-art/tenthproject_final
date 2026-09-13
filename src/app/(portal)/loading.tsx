export default function PortalLoading() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

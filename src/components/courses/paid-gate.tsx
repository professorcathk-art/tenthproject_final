import Link from "next/link";
import { Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaidGate({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-950">
      <Lock className="mx-auto h-8 w-8 text-slate-400" />
      <h2 className="mt-4 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{body}</p>
      <Link href="/courses" className={cn(buttonVariants(), "mt-6")}>
        {cta}
      </Link>
    </div>
  );
}

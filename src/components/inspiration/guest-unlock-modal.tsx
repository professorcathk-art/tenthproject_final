"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function GuestUnlockModal({ title, redirectTo }: { title: string; redirectTo: string }) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-white/20 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Link
          href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
          className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-800"
        >
          免費註冊即可解鎖基礎拆解
        </Link>
      </DialogContent>
    </Dialog>
  );
}

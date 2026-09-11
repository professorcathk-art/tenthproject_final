import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { getCertificateByCode } from "@/lib/db/platform-store";
import { format } from "date-fns";
import { zhTW, enUS } from "date-fns/locale";
import { getDict, getLocale } from "@/lib/i18n/server";

export default async function CertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert = await getCertificateByCode(code);
  if (!cert) notFound();
  const dict = await getDict();
  const locale = await getLocale();

  return (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
        <Card className="border-2 border-slate-900">
          <CardContent className="py-12 px-8">
            <Award className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <p className="text-sm uppercase tracking-widest text-slate-500 mb-2">{dict.cert.title}</p>
            <h1 className="text-2xl font-bold mb-2">{cert.course?.title ?? "Tenth Project"}</h1>
            <p className="text-slate-600 mb-6">{dict.cert.body}</p>
            <Badge variant="secondary" className="font-mono text-base px-4 py-1">
              {cert.certificate_code}
            </Badge>
            <p className="text-xs text-slate-400 mt-4">
              {dict.cert.issued} {format(new Date(cert.issued_at), "PPP", { locale: locale === "zh" ? zhTW : enUS })}
            </p>
            <p className="text-xs text-green-600 mt-2">✓ {dict.cert.verified}</p>
          </CardContent>
        </Card>
      </div>
    </MarketingShell>
  );
}

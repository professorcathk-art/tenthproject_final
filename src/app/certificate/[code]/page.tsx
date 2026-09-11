import { notFound } from "next/navigation";
import { PlatformHeader } from "@/components/layout/platform-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { getCertificateByCode } from "@/lib/db/platform-store";
import { format } from "date-fns";

export default async function CertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert = await getCertificateByCode(code);
  if (!cert) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      <PlatformHeader />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
        <Card className="border-2 border-slate-900">
          <CardContent className="py-12 px-8">
            <Award className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <p className="text-sm uppercase tracking-widest text-slate-500 mb-2">Certificate of Completion</p>
            <h1 className="text-2xl font-bold mb-2">{cert.course?.title ?? "Tenth Project Course"}</h1>
            <p className="text-slate-600 mb-6">This certifies successful completion of all modules and quizzes.</p>
            <Badge variant="secondary" className="font-mono text-base px-4 py-1">{cert.certificate_code}</Badge>
            <p className="text-xs text-slate-400 mt-4">
              Issued {format(new Date(cert.issued_at), "MMMM d, yyyy")}
            </p>
            <p className="text-xs text-green-600 mt-2">✓ Verified by Tenth Project Academy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import Link from "next/link";
import { MarketingShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  ListChecks,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
} from "lucide-react";

const workflowSteps = [
  {
    step: "1",
    title: "Describe your idea",
    description: "Tell us what you want to build in plain language — no tech jargon needed.",
  },
  {
    step: "2",
    title: "Upload what you have",
    description: "Share screenshots, URLs, or docs so we understand your current progress.",
  },
  {
    step: "3",
    title: "Get your roadmap",
    description: "AI analyzes your project and creates phases, tasks, and a UAT checklist.",
  },
  {
    step: "4",
    title: "Copy your prompt",
    description: "Get a ready-to-paste prompt for Cursor, Lovable, Gemini, Claude, or ChatGPT.",
  },
  {
    step: "5",
    title: "Test & iterate",
    description: "Track UAT results, fix bugs, and generate the next sprint prompt.",
  },
];

const features = [
  {
    icon: Target,
    title: "Clear next steps",
    description: "Always know exactly what to build next and what prompt to paste into your AI tool.",
  },
  {
    icon: ListChecks,
    title: "UAT made simple",
    description: "Track testing with plain-language checklists, remarks, and status updates.",
  },
  {
    icon: MessageSquare,
    title: "Tool-specific prompts",
    description: "Prompts formatted for Cursor, Lovable, Gemini, Claude, and more.",
  },
  {
    icon: Zap,
    title: "Website checks",
    description: "Run automated checks on your live site and attach screenshots as evidence.",
  },
];

export default function LandingPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 mb-6">
            <Sparkles className="h-4 w-4" />
            AI product development coach
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
            Build with AI,{" "}
            <span className="text-slate-500">stay in control</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Tenth Project helps non-technical creators using Cursor, Lovable, and other AI tools
            plan, test, and ship their products — with clear roadmaps, UAT checklists, and copy-paste prompts.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {workflowSteps.map((item) => (
              <Card key={item.step} className="border-slate-200 bg-white">
                <CardHeader>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-bold">
                    {item.step}
                  </div>
                  <CardTitle className="text-base mt-3">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-4">Everything you need to ship</h2>
          <p className="text-center text-slate-600 mb-12 max-w-xl mx-auto">
            From first idea to launch-ready product — organized, tested, and always knowing your next move.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-4 p-6 rounded-xl border border-slate-200">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Icon className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-900 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to take control of your build?</h2>
          <p className="text-slate-400 mb-8">Join creators who ship faster with structured AI development.</p>
          <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-slate-400 mb-8">
            {["No credit card required", "Works with any AI tool", "Free to start"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                {item}
              </span>
            ))}
          </div>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Start your first project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Tenth Project</span>
          <span>Built for vibe coders everywhere</span>
        </div>
      </footer>
    </MarketingShell>
  );
}

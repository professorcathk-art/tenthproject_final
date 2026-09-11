"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/types/platform";
import { useI18n } from "@/components/i18n/provider";

interface QuizDialogProps {
  questions: QuizQuestion[];
  open: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export function QuizDialog({ questions, open, onClose, onComplete }: QuizDialogProps) {
  const { dict } = useI18n();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions.length) return null;

  function handleSubmit() {
    const next = Math.round(
      (questions.filter((q) => answers[q.id] === q.correctIndex).length / questions.length) * 100
    );
    setScore(next);
    setSubmitted(true);
    if (next >= 70) onComplete(next);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{dict.courses.quiz}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {questions.map((q, qi) => (
            <div key={q.id} className="space-y-2">
              <p className="font-medium text-sm">{qi + 1}. {q.question}</p>
              <div className="space-y-1">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers({ ...answers, [q.id]: oi })}
                    className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors ${
                      answers[q.id] === oi ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-300"
                    } ${submitted && oi === q.correctIndex ? "border-green-500 bg-green-50" : ""}
                    ${submitted && answers[q.id] === oi && oi !== q.correctIndex ? "border-red-400 bg-red-50" : ""}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}>
              {dict.courses.submitQuiz}
            </Button>
          ) : (
            <div className="text-sm">
              {dict.courses.score}: <strong>{score}%</strong>
              {score >= 70 ? ` — ${dict.courses.passed}` : ` — ${dict.courses.retry}`}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

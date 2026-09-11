"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/types/platform";

interface QuizDialogProps {
  questions: QuizQuestion[];
  open: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export function QuizDialog({ questions, open, onClose, onComplete }: QuizDialogProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!questions.length) return null;

  const score = submitted
    ? Math.round((questions.filter((q) => answers[q.id] === q.correctIndex).length / questions.length) * 100)
    : 0;

  function handleSubmit() {
    setSubmitted(true);
    if (score >= 70 || questions.every((q) => answers[q.id] === q.correctIndex)) {
      onComplete(score);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Module Quiz</DialogTitle>
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
              Submit Quiz
            </Button>
          ) : (
            <div className="text-sm">
              Score: <strong>{score}%</strong>
              {score >= 70 ? " — Passed!" : " — Try again (need 70%)"}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

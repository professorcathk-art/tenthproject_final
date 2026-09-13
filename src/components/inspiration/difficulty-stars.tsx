import { Star } from "lucide-react";
import { DIFFICULTY_LABELS, clampDifficulty } from "@/lib/inspiration/case-fields";

export function DifficultyStars({
  value,
  locale,
  showLabel = true,
  size = "sm",
}: {
  value?: number | null;
  locale: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}) {
  const stars = clampDifficulty(value);
  const label = DIFFICULTY_LABELS[stars];
  const icon = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div className="inline-flex items-center gap-1.5" title={locale === "en" ? label.en : label.zh}>
      <span className="text-xs font-medium text-slate-500">{locale === "en" ? "Difficulty" : "難度"}</span>
      <span className="inline-flex" aria-label={locale === "en" ? `Difficulty ${stars} of 5` : `難度 ${stars} 星`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`${icon} ${n <= stars ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
          />
        ))}
      </span>
      {showLabel ? (
        <span className="text-xs text-slate-500">{locale === "en" ? label.en : label.zh}</span>
      ) : null}
    </div>
  );
}

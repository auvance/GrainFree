"use client";

type Props = {
  question: {
    id: number;
    question: string;
    type: "multiple" | "single" | "text";
    options?: string[];
  };
  answer: string[] | string | undefined;
  onAnswer: (id: number, value: string | string[]) => void;
};

export default function QuestionCard({ question, answer, onAnswer }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-6">
      <p className="font-[AeonikArabic] text-xs uppercase tracking-[0.22em] text-white/60">
        question
      </p>

      <h2 className="mt-2 font-[AeonikArabic] text-xl sm:text-2xl font-semibold text-white leading-tight">
        {question.question}
      </h2>

      <div className="mt-5 space-y-3 font-[AeonikArabic]">
        {question.type === "multiple" &&
          question.options?.map((opt) => {
            const checked = Array.isArray(answer) && answer.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = Array.isArray(answer) ? [...answer] : [];
                  const set = new Set(current);
                  if (set.has(opt)) set.delete(opt);
                  else set.add(opt);
                  onAnswer(question.id, Array.from(set));
                }}
                className={[
                  "w-full rounded-xl border px-4 py-3 text-left transition",
                  checked
                    ? "bg-[#00B84A]/90 border-[#00B84A] text-white"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white/90",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{opt}</span>
                  <span
                    className={[
                      "h-5 w-5 rounded-md border",
                      checked ? "border-white/80 bg-white/20" : "border-white/25 bg-black/10",
                    ].join(" ")}
                  />
                </div>
              </button>
            );
          })}

        {question.type === "single" &&
          question.options?.map((opt) => {
            const selected = answer === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onAnswer(question.id, opt)}
                className={[
                  "w-full rounded-xl border px-4 py-3 text-left transition",
                  selected
                    ? "bg-[#00B84A]/90 border-[#00B84A] text-white"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white/90",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{opt}</span>
                  <span
                    className={[
                      "h-5 w-5 rounded-full border",
                      selected ? "border-white/80 bg-white/20" : "border-white/25 bg-black/10",
                    ].join(" ")}
                  />
                </div>
              </button>
            );
          })}

        {question.type === "text" && (
          <textarea
            className={[
              "w-full min-h-[160px] rounded-2xl border border-white/10 bg-white/5",
              "p-4 outline-none placeholder:text-white/45 font-[AeonikArabic] text-white",
              "focus:ring-2 focus:ring-[#9DE7C5]/30 resize-none",
            ].join(" ")}
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            placeholder="Type your answer here..."
          />
        )}
      </div>
    </section>
  );
}

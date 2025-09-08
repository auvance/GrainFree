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
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">{question.question}</h2>

      {question.type === "multiple" &&
        question.options?.map((opt) => (
          <label key={opt} className="block mb-2">
            <input
              type="checkbox"
              checked={Array.isArray(answer) && answer.includes(opt)}
              onChange={(e) => {
                let updated = Array.isArray(answer) ? [...answer] : [];
                if (e.target.checked) updated.push(opt);
                else updated = updated.filter((a) => a !== opt);
                onAnswer(question.id, updated);
              }}
              className="mr-2"
            />
            {opt}
          </label>
        ))}

      {question.type === "single" &&
        question.options?.map((opt) => (
          <label key={opt} className="block mb-2">
            <input
              type="radio"
              checked={answer === opt}
              onChange={() => onAnswer(question.id, opt)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}

      {question.type === "text" && (
        <textarea
          className="w-full rounded-lg p-3 bg-white/5 border border-white/20"
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          placeholder="Type your answer here..."
        />
      )}
    </div>
  );
}

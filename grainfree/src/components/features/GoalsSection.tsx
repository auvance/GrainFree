"use client";

type Goal = {
  title: string;
  progress: number; // 0–100
};

export default function GoalsSection({ goals = [] }: { goals?: Goal[] }) {
  // fallback static if none
  const fallback = [
    { title: "Staying Gluten-Free", progress: 70 },
    { title: "Gain Healthy Weight", progress: 30 },
    { title: "Staying Lacto Free", progress: 50 },
    { title: "Feel Energetic", progress: 20 },
  ];

  const toRender = goals.length ? goals : fallback;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Health Goals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toRender.map((goal) => (
          <div
            key={goal.title}
            className="bg-white/5 border border-white/10 p-4 rounded-lg"
          >
            <h3 className="font-semibold mb-2">{goal.title}</h3>
            <div className="w-full bg-gray-700 h-2 rounded">
              <div
                className="bg-[#008509] h-2 rounded"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Progress – {goal.progress}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

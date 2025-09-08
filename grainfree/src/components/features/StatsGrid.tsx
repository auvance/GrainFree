"use client";

export default function StatsGrid() {
  const stats = [
    { label: "Today's Calories", value: "1450/2000" },
    { label: "Streak", value: "200 days" },
    { label: "Meals Logged", value: "3" },
    { label: "Saved Meals", value: "200" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/10 px-4 py-3 rounded-lg text-center"
        >
          <p className="text-sm text-gray-300">{stat.label}</p>
          <p className="text-lg font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

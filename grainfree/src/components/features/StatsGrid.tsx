"use client";

export default function StatsGrid({
  caloriesToday,
  goal,
  streak,
  mealsLogged,
  savedMeals,
}: {
  caloriesToday: number;
  goal: number;
  streak: number;
  mealsLogged: number;
  savedMeals: number;
}) {
  const stats = [
    { label: "Today's Calories", value: `${caloriesToday}/${goal}` },
    { label: "Streak", value: `${streak} days` },
    { label: "Meals Logged", value: `${mealsLogged}` },
    { label: "Saved Meals", value: `${savedMeals}` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#223528] px-20 py-3 rounded-lg text-center"
        >
          <p className="font-[AeonikArabic] font-bold text-[1.2rem] text-gray-300">
            {stat.label}
          </p>
          <p className="font-[AeonikArabic] text-lg italic">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

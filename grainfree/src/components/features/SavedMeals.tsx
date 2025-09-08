"use client";

export default function SavedMeals() {
  const meals = [
    { title: "Quinoa Buddha Bowl" },
    { title: "Gluten-Free Overnight Oats" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Saved Meals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meals.map((meal) => (
          <div
            key={meal.title}
            className="bg-white/5 border border-white/10 p-4 rounded-lg"
          >
            <h3 className="font-semibold">{meal.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

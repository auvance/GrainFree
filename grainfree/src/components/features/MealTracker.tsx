"use client";

export default function MealTracker() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Today's Meals</h2>
      <p className="text-gray-300 mb-6">
        Track your daily meals and monitor your nutrition.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal) => (
          <div
            key={meal}
            className="bg-white/5 border border-white/10 p-4 rounded-lg"
          >
            <h3 className="font-semibold">{meal}</h3>
            <p className="text-sm text-gray-400">No {meal} logged yet.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

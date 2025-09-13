"use client";

type Meal = {
  name: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories?: number;
};

export default function MealTracker({ meals = [] }: { meals?: Meal[] }) {
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Today's Meals</h2>
      <p className="text-gray-300 mb-6">
        Track your daily meals and monitor your nutrition.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealTypes.map((mealType) => {
          const logged = meals.find((m) => m.type === mealType);

          return (
            <div
              key={mealType}
              className="bg-white/5 border border-white/10 p-4 rounded-lg"
            >
              <h3 className="font-semibold">{mealType}</h3>
              {logged ? (
                <p className="text-sm text-gray-200">
                  {logged.name} – {logged.calories || "??"} kcal
                </p>
              ) : (
                <p className="text-sm text-gray-400">No {mealType} logged yet.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

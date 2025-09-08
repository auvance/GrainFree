"use client";

export default function Recommendations() {
  const items = [
    { title: "Mediterranean Quinoa Salad" },
    { title: "Coconut Flour Muffins" },
    { title: "Zucchini Noodle Pasta" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Recommended For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white/5 border border-white/10 p-4 rounded-lg"
          >
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <button className="mt-2 px-3 py-1 text-sm rounded bg-[#008509] hover:bg-green-700">
              Save Recipe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

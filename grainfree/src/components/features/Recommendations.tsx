"use client";

type Recommendation = {
  title: string;
  why?: string;
};

export default function Recommendations({ items = [] }: { items?: Recommendation[] }) {
  const fallback: Recommendation[] = [
    { title: "Mediterranean Quinoa Salad" },
    { title: "Coconut Flour Muffins" },
    { title: "Zucchini Noodle Pasta" },
  ];

const toRender: Recommendation[] = items.length ? items : fallback;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Recommended For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {toRender.map((item) => (
          <div
            key={item.title}
            className="bg-white/5 border border-white/10 p-4 rounded-lg"
          >
            <h3 className="font-semibold mb-2">{item.title}</h3>
            {item.why && <p className="text-sm text-gray-400 mb-2">{item.why}</p>}
            <button className="mt-2 px-3 py-1 text-sm rounded bg-[#008509] hover:bg-green-700">
              Save Recipe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

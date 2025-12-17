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
      <div className="bg-[#2C4435] pt-8 pb-8 pr-15 pl-15 font-[AeonikArabic] mb-6 rounded-[20px]">
        <h2 className="text-3xl font-semibold">Recommended For You</h2>
        <p>Based on your dietary preferences and past meals.</p>
      </div>
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

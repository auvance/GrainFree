import PlanGoals from "@/components/features/PlanGoals";
import SafetySnapshot from "@/components/features/SafetySnapshot";


type PlanGoal = { title: string; progress: number };
const CARD_HEIGHT = "min-h-[600px] lg:min-h-[600px]";

export default function     GoalsUpdate({
    planGoals,
    onUpdateGuide,
    onViewAllGoals,
  }: {
    planGoals: PlanGoal[];
    onUpdateGuide: () => void;
    onViewAllGoals: () => void;
  }) {
    return (
      <section className={`rounded-[28px] border border-white/10 bg-gradient-to-br from-[#22362F] via-[#1B2A25] to-[#15211D] p-0 ${CARD_HEIGHT}`}>
  
      {/* Need to move this */}
        <div className="mt-5 grid grid-cols-1 lg:flex flex-col gap-5">
          <div className="">
            <SafetySnapshot title="Safety snapshot" onUpdateGuide={onUpdateGuide} />
          </div>
          <div className="">
            <PlanGoals
              goals={planGoals}
              variant="preview"
              limit={4}
              onViewAll={onViewAllGoals}
              onBuildGuide={onUpdateGuide}
            />
          </div>
        </div>
        
      </section>
    );
  }
  
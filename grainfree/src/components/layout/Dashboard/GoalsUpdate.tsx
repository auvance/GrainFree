import PlanGoals from "@/components/features/PlanGoals";
type PlanGoal = { title: string; progress: number };

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
      <section className={`rounded-[28px] bg-gradient-to-br p-0`}>          
          <div className="">
            <PlanGoals
              goals={planGoals}
              variant="preview"
              limit={4}
              onViewAll={onViewAllGoals}
              onBuildGuide={onUpdateGuide}
            />
          </div>    
      </section>
    );
  }
  
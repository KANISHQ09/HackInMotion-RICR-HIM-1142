"use client"

import { useMemo, useState } from "react"
import { GoalCard } from "@/components/dashboard/goals/goal-card"
import { InsightCard } from "@/components/dashboard/goals/insight-card"
import { MilestonesCard } from "@/components/dashboard/goals/milestones-card"
import { ProjectionCard } from "@/components/dashboard/goals/projection-card"
import { goals, type GoalName, type Period } from "@/components/dashboard/goals/data"

export function GoalsDashboard() {
  const [period, setPeriod] = useState<Period>("6M")
  const [contribution, setContribution] = useState(850)
  const [selectedGoal, setSelectedGoal] = useState(goals[0].name)
  const [projection, setProjection] = useState({
    contribution: 850,
    goalName: goals[0].name as GoalName,
  })

  const selectedGoalData = useMemo(
    () => goals.find((goal) => goal.name === projection.goalName) ?? goals[0],
    [projection.goalName],
  )
  const projectedMonths = period === "6M" ? 6 : period === "1Y" ? 12 : 36
  const monthsRemaining = Math.max(
    1,
    Math.ceil(
      (selectedGoalData.target - selectedGoalData.saved) /
        Math.max(projection.contribution, 1),
    ),
  )
  const projectedTotal = Math.min(
    selectedGoalData.target,
    selectedGoalData.saved + projection.contribution * projectedMonths,
  )

  return (
    <div className="mx-auto flex w-full max-w-[1296px] flex-col gap-14 px-4 pb-28 pt-10 sm:px-6 md:px-12 md:py-20 lg:gap-20">
      <header className="border-b border-zinc-200/80 pb-6">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-normal text-zinc-950 md:text-5xl">
            Goals
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
            Track and manage your progression towards future milestones.
          </p>
        </div>
      </header>

      <section aria-labelledby="active-goals">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2
            id="active-goals"
            className="font-serif text-2xl font-medium tracking-normal text-zinc-950"
          >
            Active Targets
          </h2>
          <span className="rounded-full bg-emerald-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
            3 In Progress
          </span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.name} goal={goal} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <ProjectionCard
          contribution={contribution}
          goalName={selectedGoal}
          monthsRemaining={monthsRemaining}
          period={period}
          projectedTotal={projectedTotal}
          target={selectedGoalData.target}
          onContributionChange={setContribution}
          onGoalNameChange={setSelectedGoal}
          onPeriodChange={setPeriod}
          onSubmit={() =>
            setProjection({
              contribution,
              goalName: selectedGoal,
            })
          }
        />

        <aside className="grid gap-6 lg:grid-cols-2 xl:flex xl:flex-col">
          <InsightCard />
          <MilestonesCard />
        </aside>
      </section>
    </div>
  )
}

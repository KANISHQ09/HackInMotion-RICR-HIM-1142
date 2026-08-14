"use client"

import { useEffect, useMemo, useState } from "react"
import { Car, PiggyBank, Plane, ShieldPlus, type LucideIcon } from "lucide-react"
import type { SavingsGoal } from "@/api/types"
import { GoalCard } from "@/components/dashboard/goals/goal-card"
import { InsightCard } from "@/components/dashboard/goals/insight-card"
import { MilestonesCard } from "@/components/dashboard/goals/milestones-card"
import { ProjectionCard } from "@/components/dashboard/goals/projection-card"
import { goals, type Goal, type GoalName, type Period } from "@/components/dashboard/goals/data"
import { useGoals, useRecommendations } from "@/hooks/use-finance-api"
import { parseApiAmount } from "@/lib/finance-format"

const goalIcons: Record<string, LucideIcon> = {
  emergency: ShieldPlus,
  vehicle: Car,
  car: Car,
  trip: Plane,
  travel: Plane,
}

function iconForGoal(name: string) {
  const key = name.toLowerCase()
  return Object.entries(goalIcons).find(([match]) => key.includes(match))?.[1] ?? PiggyBank
}

function formatGoalDate(date: string) {
  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(parsed)
}

function buildGoals(apiGoals?: SavingsGoal[]): Goal[] {
  return (apiGoals ?? []).map((goal) => {
    const saved = parseApiAmount(goal.currentProgress)
    const target = parseApiAmount(goal.targetAmount)
    const progress = Number(goal.progress) || (target > 0 ? (saved / target) * 100 : 0)

    return {
      icon: iconForGoal(goal.name),
      name: goal.name,
      saved,
      target,
      progress: Math.max(0, Math.min(100, Math.round(progress))),
      completion: formatGoalDate(goal.targetDate),
    }
  })
}

function buildMilestones(liveGoals: Goal[]): readonly (readonly [string, string])[] {
  return liveGoals
    .filter((goal) => goal.progress >= 100)
    .map((goal) => [goal.name, `Reached ${goal.completion}`] as const)
}

export function GoalsDashboard() {
  const goalsQuery = useGoals()
  const recommendations = useRecommendations()
  const [period, setPeriod] = useState<Period>("6M")
  const [contribution, setContribution] = useState(850)
  const [selectedGoal, setSelectedGoal] = useState(goals[0].name)
  const [projection, setProjection] = useState({
    contribution: 850,
    goalName: goals[0].name as GoalName,
  })
  const liveGoals = useMemo(() => buildGoals(goalsQuery.data), [goalsQuery.data])
  const displayedGoals = useMemo(
    () => (goalsQuery.isLoading ? goals : liveGoals),
    [goalsQuery.isLoading, liveGoals],
  )
  const firstGoalName = displayedGoals[0]?.name ?? ""

  useEffect(() => {
    if (!firstGoalName) return

    setSelectedGoal((current) => (displayedGoals.some((goal) => goal.name === current) ? current : firstGoalName))
    setProjection((current) =>
      displayedGoals.some((goal) => goal.name === current.goalName)
        ? current
        : { ...current, goalName: firstGoalName },
    )
  }, [displayedGoals, firstGoalName])

  const selectedGoalData = useMemo(
    () => displayedGoals.find((goal) => goal.name === projection.goalName) ?? displayedGoals[0] ?? goals[0],
    [displayedGoals, projection.goalName],
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
            {displayedGoals.length} In Progress
          </span>
        </div>

        {goalsQuery.error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
            {goalsQuery.error.message}
          </p>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {!goalsQuery.isLoading && displayedGoals.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm font-medium text-zinc-500 md:col-span-2 xl:col-span-3">
              No savings goals yet.
            </div>
          ) : null}

          {displayedGoals.map((goal) => (
            <GoalCard key={goal.name} goal={goal} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <ProjectionCard
          contribution={contribution}
          goalName={selectedGoal}
          goals={displayedGoals}
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
          <InsightCard
            title={recommendations.data?.[0]?.title}
            copy={recommendations.data?.[0]?.action}
            isLoading={recommendations.isLoading}
          />
          <MilestonesCard milestones={buildMilestones(liveGoals)} />
        </aside>
      </section>
    </div>
  )
}

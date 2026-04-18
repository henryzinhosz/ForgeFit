
"use client";

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useForgeStore, DayOfWeek } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Droplets, Zap, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { weeklyPlan, waterCount, waterGoal, proteinGoalReached, incrementWater, toggleProtein, resetWeeklyChecks } = useForgeStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const today = DAYS[new Date().getDay()];
  const todaysExercises = weeklyPlan[today] || [];
  const completedToday = todaysExercises.filter(ex => ex.completed).length;
  const totalToday = todaysExercises.length;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <section className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-foreground">Welcome back, Athlete!</h1>
          <p className="text-muted-foreground">Today is <span className="text-primary font-semibold">{today}</span>. Stay consistent!</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-sm border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline">Today's Session</CardTitle>
                <CardDescription>
                  {totalToday > 0 ? `${completedToday} of ${totalToday} exercises finished` : 'No exercises planned for today.'}
                </CardDescription>
              </div>
              <CheckCircle2 className={cn("w-10 h-10 transition-colors", progressPercent === 100 ? "text-green-500" : "text-muted")} />
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progressPercent} className="h-3 bg-secondary" />
              
              <div className="space-y-3">
                {todaysExercises.length > 0 ? (
                  todaysExercises.map((ex) => (
                    <div key={ex.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full", ex.completed ? "bg-green-500" : "bg-primary")} />
                        <span className={cn("font-medium", ex.completed && "line-through text-muted-foreground")}>{ex.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{ex.sets}x{ex.reps}{ex.time && ` | ${ex.time}`}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground italic mb-4">Nothing scheduled yet.</p>
                    <Button asChild variant="outline">
                      <Link href="/planner">Go to Planner</Link>
                    </Button>
                  </div>
                )}
              </div>
              
              {totalToday > 0 && (
                <Button asChild className="w-full h-12 text-lg font-semibold shadow-md">
                  <Link href="/planner">Open Planner <ChevronRight className="ml-2 w-5 h-5" /></Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm border-none bg-white overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <Droplets className="w-12 h-12 text-primary" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-headline">Hydration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-primary">{waterCount}</span>
                  <span className="text-muted-foreground mb-1">/ {waterGoal} cups</span>
                </div>
                <Button onClick={incrementWater} className="w-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-none">
                  Add Cup <Droplets className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-headline">Nutrition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className={cn("w-5 h-5", proteinGoalReached ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
                    <span className="font-medium">Protein Goal</span>
                  </div>
                  <Button 
                    variant={proteinGoalReached ? "default" : "outline"}
                    size="sm"
                    onClick={toggleProtein}
                    className={cn(proteinGoalReached ? "bg-green-500 hover:bg-green-600" : "")}
                  >
                    {proteinGoalReached ? "Reached!" : "Mark Reached"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Focus on hitting your macronutrient needs for optimal recovery.</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none shadow-lg">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" /> AI Coach
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-sm opacity-90">Need a variation for your squats or better form instructions? Use our AI Assistant in the Planner.</p>
                <Button asChild variant="secondary" size="sm" className="w-full font-semibold">
                  <Link href="/planner">Try AI Coach</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-2xl p-4 flex items-center gap-4 border border-primary/10">
          <div className="bg-primary/20 p-2 rounded-full">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-primary">Pro Tip: Weekly Reset</p>
            <p className="text-muted-foreground">Checks will automatically reset every Monday at 00:00 to keep your progress tracking clean and fresh!</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto text-primary" onClick={resetWeeklyChecks}>
            Manual Reset
          </Button>
        </div>
      </main>
    </div>
  );
}

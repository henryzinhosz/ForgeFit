"use client";

import { Navigation } from '@/components/Navigation';
import { useForgeStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, Apple, CheckCircle2, RefreshCw, Zap, Info, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RoutinePage() {
  const { waterCount, waterGoal, proteinGoalReached, incrementWater, resetWater, toggleProtein } = useForgeStore();
  
  const waterProgress = (waterCount / waterGoal) * 100;

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-headline font-bold">Healthy Routine</h1>
          <p className="text-muted-foreground">Track the essential building blocks of your fitness success.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hydration Mastery */}
          <Card className="border-none shadow-sm bg-white overflow-hidden flex flex-col">
            <CardHeader className="bg-primary/5 pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-headline flex items-center gap-2 text-primary">
                    <Droplets className="w-7 h-7" /> Hydration
                  </CardTitle>
                  <CardDescription>Target: {waterGoal} cups of water daily</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={resetWater} className="text-muted-foreground">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-8 flex flex-col items-center justify-center space-y-8 text-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-secondary flex items-center justify-center overflow-hidden">
                {/* Wave animation simulation */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-700 ease-in-out" 
                  style={{ height: `${Math.min(waterProgress, 100)}%` }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-6xl md:text-8xl font-bold text-primary font-headline">{waterCount}</span>
                  <span className="text-sm md:text-lg font-medium text-primary/80 uppercase tracking-widest">Cups</span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Current Progress</span>
                  <span>{Math.round(waterProgress)}%</span>
                </div>
                <Progress value={waterProgress} className="h-4 bg-secondary" />
              </div>

              <Button 
                size="lg" 
                onClick={incrementWater} 
                className="w-full h-16 text-xl rounded-2xl shadow-lg transition-transform active:scale-95"
              >
                Drink 1 Cup <Droplets className="ml-2 w-6 h-6" />
              </Button>
            </CardContent>
          </Card>

          {/* Nutrition Mastery - Protein Focus */}
          <Card className="border-none shadow-sm bg-white overflow-hidden flex flex-col">
            <CardHeader className="bg-accent/5 pb-6">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline flex items-center gap-2 text-accent">
                  <Utensils className="w-7 h-7" /> Nutrition Focus
                </CardTitle>
                <CardDescription>Track key protein intake goals for recovery</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-8 space-y-8">
              <div className={cn(
                "p-8 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center text-center space-y-4",
                proteinGoalReached ? "bg-green-50 border-green-200" : "bg-secondary/20 border-transparent"
              )}>
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center shadow-inner",
                  proteinGoalReached ? "bg-green-500 text-white" : "bg-secondary text-muted-foreground"
                )}>
                  {proteinGoalReached ? <CheckCircle2 className="w-10 h-10" /> : <Zap className="w-10 h-10" />}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-bold">Protein Milestone</h3>
                  <p className="text-muted-foreground">
                    {proteinGoalReached 
                      ? "Great! Your body has the building blocks it needs today." 
                      : "Did you hit your daily protein requirement today?"}
                  </p>
                </div>

                <Button 
                  variant={proteinGoalReached ? "default" : "outline"} 
                  size="lg"
                  onClick={toggleProtein}
                  className={cn(
                    "w-full h-14 rounded-xl text-lg font-semibold",
                    proteinGoalReached ? "bg-green-500 hover:bg-green-600 border-none" : "border-accent text-accent hover:bg-accent/5"
                  )}
                >
                  {proteinGoalReached ? "Goal Achieved!" : "Mark as Achieved"}
                </Button>
              </div>

              <Card className="bg-accent/10 border-none shadow-none">
                <CardContent className="p-4 flex gap-4">
                  <div className="bg-accent/20 p-3 rounded-full shrink-0">
                    <Info className="w-5 h-5 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-accent text-sm">Why focus on Protein?</p>
                    <p className="text-xs text-accent/80 leading-relaxed">
                      Protein is essential for muscle tissue repair and hormone production. We recommend hitting 1.6g to 2.2g of protein per kg of body weight for active individuals.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h4 className="font-headline font-bold text-lg">Daily Reminders</h4>
                <div className="space-y-2">
                  {[
                    "Eat 20-40g of protein every 3-4 hours.",
                    "Drink 500ml of water right after waking up.",
                    "Include fiber with every major meal."
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

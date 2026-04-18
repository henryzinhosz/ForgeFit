
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

const DAYS: DayOfWeek[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { weeklyPlan, waterCount, waterGoal, proteinGoalReached, incrementWater, toggleProtein, resetWeeklyChecks } = useForgeStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const todayIndex = new Date().getDay();
  const dayKeys: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayKey = dayKeys[todayIndex];
  const todaysExercises = weeklyPlan[todayKey] || [];
  const completedToday = todaysExercises.filter(ex => ex.completed).length;
  const totalToday = todaysExercises.length;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background text-foreground">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <section className="space-y-2">
          <h1 className="text-4xl font-headline font-bold">Bem-vindo de volta, Atleta!</h1>
          <p className="text-muted-foreground">Hoje é <span className="text-primary font-semibold">{DAYS[todayIndex]}</span>. Mantenha a constância!</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-xl border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline">Sessão de Hoje</CardTitle>
                <CardDescription>
                  {totalToday > 0 ? `${completedToday} de ${totalToday} exercícios concluídos` : 'Nenhum exercício planejado para hoje.'}
                </CardDescription>
              </div>
              <CheckCircle2 className={cn("w-10 h-10 transition-colors", progressPercent === 100 ? "text-green-500" : "text-muted")} />
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progressPercent} className="h-3 bg-secondary" />
              
              <div className="space-y-3">
                {todaysExercises.length > 0 ? (
                  todaysExercises.map((ex) => (
                    <div key={ex.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full", ex.completed ? "bg-green-500" : "bg-primary")} />
                        <span className={cn("font-medium", ex.completed && "line-through text-muted-foreground")}>{ex.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{ex.sets}x{ex.reps}{ex.time && ` | ${ex.time}`}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground italic mb-4">Nada agendado ainda.</p>
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      <Link href="/planner">Ir para o Planejador</Link>
                    </Button>
                  </div>
                )}
              </div>
              
              {totalToday > 0 && (
                <Button asChild className="w-full h-12 text-lg font-semibold shadow-lg bg-primary hover:bg-primary/90">
                  <Link href="/planner">Abrir Planejador <ChevronRight className="ml-2 w-5 h-5" /></Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-xl border-border bg-card overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Droplets className="w-12 h-12 text-accent" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-headline">Hidratação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-accent">{waterCount}</span>
                  <span className="text-muted-foreground mb-1">/ {waterGoal} litros</span>
                </div>
                <Button onClick={incrementWater} className="w-full bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">
                  Adicionar 1 Litro <Droplets className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-headline">Nutrição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className={cn("w-5 h-5", proteinGoalReached ? "text-green-500" : "text-muted-foreground")} />
                    <span className="font-medium">Meta de Proteína</span>
                  </div>
                  <Button 
                    variant={proteinGoalReached ? "default" : "outline"}
                    size="sm"
                    onClick={toggleProtein}
                    className={cn(proteinGoalReached ? "bg-green-600 hover:bg-green-700 border-none" : "border-muted text-muted-foreground")}
                  >
                    {proteinGoalReached ? "Alcançada!" : "Marcar como Alcançada"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Foque em bater seus macronutrientes para uma recuperação ideal.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-accent text-white border-none shadow-2xl">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" /> Coach IA
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-sm opacity-90">Precisa de uma variação para agachamento ou dicas de execução? Use nosso assistente no Planejador.</p>
                <Button asChild variant="secondary" size="sm" className="w-full font-bold bg-white text-primary hover:bg-white/90">
                  <Link href="/planner">Testar Coach IA</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
          <div className="bg-primary/20 p-2 rounded-full">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-primary">Dica Pro: Reset Semanal</p>
            <p className="text-muted-foreground">O progresso reseta automaticamente toda segunda-feira às 00:00 para manter seu foco renovado!</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto text-primary hover:bg-primary/10" onClick={resetWeeklyChecks}>
            Reset Manual
          </Button>
        </div>
      </main>
    </div>
  );
}

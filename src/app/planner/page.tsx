"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useForgeStore, DayOfWeek, PlannedExercise } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Sparkles, Plus, Loader2, Calendar } from 'lucide-react';
import { aiAssistWorkoutInstructions } from '@/ai/flows/ai-assist-workout-instructions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PlannerPage() {
  const { weeklyPlan, toggleExercise, removeExercise } = useForgeStore();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleAiRefine = async (exercise: PlannedExercise) => {
    setIsAiLoading(true);
    try {
      const result = await aiAssistWorkoutInstructions({
        exerciseName: exercise.title,
        currentInstructions: `Meta: ${exercise.sets} séries de ${exercise.reps}.`,
        userGoals: "Melhorar a forma e maximizar o recrutamento muscular"
      });
      setAiResponse(result.detailedInstructions);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const days: { key: DayOfWeek; label: string }[] = [
    { key: 'Monday', label: 'Segunda' },
    { key: 'Tuesday', label: 'Terça' },
    { key: 'Wednesday', label: 'Quarta' },
    { key: 'Thursday', label: 'Quinta' },
    { key: 'Friday', label: 'Sexta' },
    { key: 'Saturday', label: 'Sábado' },
    { key: 'Sunday', label: 'Domingo' }
  ];

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold">Agenda Semanal</h1>
            <p className="text-muted-foreground">Gerencie suas rotinas e acompanhe suas sessões concluídas.</p>
          </div>
          <Button asChild className="shadow-xl h-12 px-8 rounded-full bg-primary hover:bg-primary/90">
            <Link href="/database">
              <Plus className="mr-2 w-5 h-5" /> Adicionar Exercício
            </Link>
          </Button>
        </header>

        <Tabs defaultValue="Monday" className="w-full" onValueChange={(v) => setSelectedDay(v as DayOfWeek)}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-secondary/30 p-1 h-auto flex flex-wrap justify-center gap-1 md:gap-2 border border-white/5">
              {days.map((day) => (
                <TabsTrigger 
                  key={day.key} 
                  value={day.key}
                  className="px-4 py-2 md:px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-medium transition-all"
                >
                  {day.label.substring(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {days.map((day) => (
            <TabsContent key={day.key} value={day.key} className="space-y-6">
              <Card className="border-border bg-card shadow-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-white/5">
                  <div>
                    <CardTitle className="text-2xl font-headline text-primary">{day.label}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {weeklyPlan[day.key].length} exercícios planejados para este dia
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {weeklyPlan[day.key].length > 0 ? (
                    <div className="divide-y divide-border">
                      {weeklyPlan[day.key].map((ex) => (
                        <div key={ex.id} className={cn(
                          "flex items-center gap-4 p-4 md:p-6 transition-colors",
                          ex.completed ? "bg-green-500/5" : "hover:bg-white/5"
                        )}>
                          <Checkbox 
                            checked={ex.completed} 
                            onCheckedChange={() => toggleExercise(day.key, ex.id)}
                            className="w-6 h-6 rounded-full border-primary/50 data-[state=checked]:bg-primary"
                          />
                          <div className="flex-1 space-y-1">
                            <h4 className={cn("text-lg font-semibold", ex.completed && "line-through text-muted-foreground")}>
                              {ex.title}
                            </h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span>{ex.sets} Séries</span>
                              <span>{ex.reps} Repetições</span>
                              {ex.time && <span>{ex.time}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleAiRefine(ex)}
                              className="text-accent hover:text-accent hover:bg-accent/10"
                              disabled={isAiLoading}
                            >
                              {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeExercise(day.key, ex.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
                      <div className="bg-white/5 p-6 rounded-full">
                        <Calendar className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-headline font-semibold">Dia de Descanso?</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">Nenhum exercício agendado para {day.label.toLowerCase()}. Adicione alguns para começar.</p>
                      </div>
                      <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10">
                        <Link href="/database">Explorar Exercícios</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={!!aiResponse} onOpenChange={(open) => !open && setAiResponse(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-primary font-headline text-xl">
                <Sparkles className="w-5 h-5" /> Refinamento do Coach IA
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Dicas avançadas e variações para seu exercício.
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-invert mt-4 whitespace-pre-wrap text-muted-foreground leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
              {aiResponse}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setAiResponse(null)} className="w-full bg-primary hover:bg-primary/90">Entendido!</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
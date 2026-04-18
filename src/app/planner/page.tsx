
"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useForgeStore, DayOfWeek, PlannedExercise } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Sparkles, Plus, ChevronRight, Loader2, Calendar } from 'lucide-react';
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
        currentInstructions: `Target: ${exercise.sets} sets of ${exercise.reps}.`,
        userGoals: "Improve form and maximize muscle engagement"
      });
      setAiResponse(result.detailedInstructions);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold">Weekly Spreadsheet</h1>
            <p className="text-muted-foreground">Manage your routines and check off completed sessions.</p>
          </div>
          <Button asChild className="shadow-lg h-12 px-8 rounded-full">
            <Link href="/database">
              <Plus className="mr-2 w-5 h-5" /> Add New Exercise
            </Link>
          </Button>
        </header>

        <Tabs defaultValue="Monday" className="w-full" onValueChange={(v) => setSelectedDay(v as DayOfWeek)}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-secondary/50 p-1 h-auto flex flex-wrap justify-center gap-1 md:gap-2">
              {days.map((day) => (
                <TabsTrigger 
                  key={day} 
                  value={day}
                  className="px-4 py-2 md:px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium"
                >
                  {day.substring(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {days.map((day) => (
            <TabsContent key={day} value={day} className="space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-headline text-primary">{day}'s Workout</CardTitle>
                      <CardDescription>
                        {weeklyPlan[day].length} exercises planned for this day
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {weeklyPlan[day].length > 0 ? (
                    <div className="divide-y divide-border">
                      {weeklyPlan[day].map((ex) => (
                        <div key={ex.id} className={cn(
                          "flex items-center gap-4 p-4 md:p-6 transition-colors",
                          ex.completed ? "bg-green-50/30" : "hover:bg-secondary/20"
                        )}>
                          <Checkbox 
                            checked={ex.completed} 
                            onCheckedChange={() => toggleExercise(day, ex.id)}
                            className="w-6 h-6 rounded-full border-2"
                          />
                          <div className="flex-1 space-y-1">
                            <h4 className={cn("text-lg font-semibold", ex.completed && "line-through text-muted-foreground")}>
                              {ex.title}
                            </h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span>{ex.sets} Sets</span>
                              <span>{ex.reps} Reps</span>
                              {ex.time && <span>{ex.time}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleAiRefine(ex)}
                              className="text-primary hover:text-primary hover:bg-primary/10"
                              disabled={isAiLoading}
                            >
                              {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeExercise(day, ex.id)}
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
                      <div className="bg-secondary p-6 rounded-full">
                        <Calendar className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-headline font-semibold">Rest Day?</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">No exercises scheduled for {day}. Add some from the database to get started.</p>
                      </div>
                      <Button asChild variant="outline" className="rounded-full">
                        <Link href="/database">Browse Exercises</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={!!aiResponse} onOpenChange={(open) => !open && setAiResponse(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-primary font-headline">
                <Sparkles className="w-5 h-5" /> AI Coach Refinement
              </DialogTitle>
              <DialogDescription>
                Advanced tips and variations for your exercise.
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm dark:prose-invert mt-4 whitespace-pre-wrap text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-xl">
              {aiResponse}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setAiResponse(null)} className="w-full">Got it!</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

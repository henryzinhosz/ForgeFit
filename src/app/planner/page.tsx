
"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { DayOfWeek } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Pencil, Plus, Loader2, Calendar, Info, CheckCircle2, Activity, Dumbbell, Timer, Navigation as NavIcon } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { EXERCISE_DATABASE, Exercise } from '@/lib/exercise-db';
import { getPlaceholderById } from '@/lib/placeholder-images';

export default function PlannerPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  
  const [editingExercise, setEditingExercise] = useState<any | null>(null);
  const [editSets, setEditSets] = useState('');
  const [editReps, setEditReps] = useState('');
  const [editTime, setEditTime] = useState('');
  
  // Estados para Registro de Performance
  const [loggingExercise, setLoggingExercise] = useState<any | null>(null);
  const [actualSets, setActualSets] = useState('');
  const [actualReps, setActualReps] = useState('');
  const [actualWeight, setActualWeight] = useState('');
  const [actualDistance, setActualDistance] = useState('');
  const [actualDuration, setActualDuration] = useState('');
  const [actualRest, setActualRest] = useState('');

  const [isFinalizeDialogOpen, setIsFinalizeDialogOpen] = useState(false);

  const workoutsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'workouts');
  }, [db, user]);

  const { data: rawWorkouts, loading } = useCollection(workoutsQuery);
  const workouts = rawWorkouts || [];

  const dayWorkouts = workouts.filter(w => w.day === selectedDay);
  const isAllCompleted = dayWorkouts.length > 0 && dayWorkouts.every(w => w.completed);

  const toggleExercise = (workoutId: string, currentStatus: boolean) => {
    if (!db || !user) return;
    const docRef = doc(db, 'users', user.uid, 'workouts', workoutId);
    updateDocumentNonBlocking(docRef, { completed: !currentStatus });
  };

  const removeExercise = (workoutId: string) => {
    if (!db || !user) return;
    const docRef = doc(db, 'users', user.uid, 'workouts', workoutId);
    deleteDocumentNonBlocking(docRef);
    toast({
      title: "Exercício removido",
      description: "O item foi excluído da sua agenda.",
    });
  };

  const openEditDialog = (ex: any) => {
    setEditingExercise(ex);
    setEditSets(ex.sets || '');
    setEditReps(ex.reps || '');
    setEditTime(ex.time || '');
  };

  const handleUpdateExercise = () => {
    if (!db || !user || !editingExercise) return;
    const docRef = doc(db, 'users', user.uid, 'workouts', editingExercise.id);
    updateDocumentNonBlocking(docRef, { sets: editSets, reps: editReps, time: editTime });
    toast({ title: "Treino atualizado", description: "O plano padrão foi alterado." });
    setEditingExercise(null);
  };

  const handleLogPerformance = () => {
    if (!db || !user || !loggingExercise) return;
    
    const logsRef = collection(db, 'users', user.uid, 'logs');
    const performanceData = {
      workoutId: loggingExercise.id,
      exerciseId: loggingExercise.exerciseId,
      date: new Date().toISOString(),
      actualSets: parseInt(actualSets) || 0,
      actualReps: parseInt(actualReps) || 0,
      actualWeight: parseFloat(actualWeight) || 0,
      actualDistance: parseFloat(actualDistance) || 0,
      actualDuration: actualDuration,
      restTime: actualRest,
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(logsRef, performanceData);

    // Se for musculação e tiver peso, registra como novo PR se for relevante
    if (actualWeight) {
      const metricsRef = collection(db, 'users', user.uid, 'metrics');
      addDocumentNonBlocking(metricsRef, {
        type: 'maxLoad',
        exerciseName: loggingExercise.title,
        value: parseFloat(actualWeight),
        date: new Date().toISOString()
      });
    }

    // Marcar exercício como completado automaticamente ao registrar performance
    const workoutRef = doc(db, 'users', user.uid, 'workouts', loggingExercise.id);
    updateDocumentNonBlocking(workoutRef, { completed: true });

    toast({
      title: "Performance Registrada!",
      description: "Dados salvos no seu histórico de evolução.",
    });

    setLoggingExercise(null);
    setActualSets('');
    setActualReps('');
    setActualWeight('');
    setActualDistance('');
    setActualDuration('');
    setActualRest('');
  };

  const executeFinalize = () => {
    if (!db || !user) return;
    const sessionsRef = collection(db, 'users', user.uid, 'metrics');
    addDocumentNonBlocking(sessionsRef, {
      type: 'session_completed',
      day: selectedDay,
      exerciseCount: dayWorkouts.length,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    toast({ title: "Treino Finalizado!", description: "Missão cumprida! Progresso registrado." });
    setIsFinalizeDialogOpen(false);
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
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-4">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold uppercase italic tracking-tighter">Agenda Semanal</h1>
            <p className="text-muted-foreground font-medium">Configure seu plano padrão e registre sua execução real.</p>
          </div>
          <Button asChild className="shadow-xl h-12 px-8 rounded-full bg-primary hover:bg-primary/90 font-black uppercase italic">
            <Link href="/database">
              <Plus className="mr-2 w-5 h-5" /> Adicionar Exercício
            </Link>
          </Button>
        </header>

        <Tabs defaultValue="Monday" className="w-full" onValueChange={(v) => setSelectedDay(v as DayOfWeek)}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-secondary/30 p-1 h-auto flex flex-wrap justify-center gap-1 md:gap-2 border border-white/5 rounded-2xl">
              {days.map((day) => (
                <TabsTrigger 
                  key={day.key} 
                  value={day.key}
                  className="px-4 py-2 md:px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold uppercase text-[10px] transition-all"
                >
                  {day.label.substring(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            days.map((day) => (
              <TabsContent key={day.key} value={day.key} className="space-y-6">
                <Card className="border-white/10 bg-card/60 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-white/5 p-6 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-headline text-primary uppercase italic">{day.label}</CardTitle>
                      <CardDescription className="font-bold text-muted-foreground uppercase text-xs">
                        {dayWorkouts.length} exercícios planejados
                      </CardDescription>
                    </div>
                    {dayWorkouts.length > 0 && (
                      <Button 
                        onClick={() => isAllCompleted ? executeFinalize() : setIsFinalizeDialogOpen(true)}
                        className={cn(
                          "h-12 px-6 rounded-2xl font-black uppercase italic transition-all",
                          isAllCompleted ? "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(255,0,0,0.5)]" : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        <CheckCircle2 className="mr-2 w-5 h-5" /> Finalizar Treino
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    {dayWorkouts.length > 0 ? (
                      <div className="divide-y divide-white/5">
                        {dayWorkouts.map((ex) => {
                          const exerciseData = EXERCISE_DATABASE.find(e => e.id === ex.exerciseId);
                          
                          return (
                            <div key={ex.id} className={cn(
                              "flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-6 transition-colors",
                              ex.completed ? "bg-green-500/5" : "hover:bg-white/5"
                            )}>
                              <div className="flex items-center gap-4 flex-1">
                                <Checkbox 
                                  checked={ex.completed} 
                                  onCheckedChange={() => toggleExercise(ex.id, ex.completed)}
                                  className="w-6 h-6 rounded-full border-primary/50 data-[state=checked]:bg-primary"
                                />
                                <div className="space-y-1">
                                  <h4 className={cn("text-lg font-bold uppercase italic", ex.completed && "line-through text-muted-foreground")}>
                                    {ex.title}
                                  </h4>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-black text-muted-foreground italic uppercase">
                                    <span>Padrão: {ex.sets} Séries x {ex.reps} Reps</span>
                                    {ex.time && <span>Meta: {ex.time}</span>}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                                <Button 
                                  onClick={() => {
                                    setLoggingExercise(ex);
                                    setActualSets(ex.sets || '');
                                    setActualReps(ex.reps || '');
                                  }}
                                  className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 rounded-xl h-10 px-4 font-black uppercase italic text-xs flex-1 md:flex-none"
                                >
                                  <Activity className="mr-2 w-4 h-4" /> Registrar Performance
                                </Button>
                                
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(ex)} className="text-zinc-500 hover:text-white rounded-xl">
                                    <Pencil className="w-5 h-5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => removeExercise(ex.id)} className="text-destructive hover:bg-destructive/10 rounded-xl">
                                    <Trash2 className="w-5 h-5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
                        <div className="bg-white/5 p-6 rounded-full"><Calendar className="w-12 h-12 text-muted-foreground" /></div>
                        <h3 className="text-xl font-headline font-bold uppercase italic">Dia de Descanso?</h3>
                        <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10 h-12 px-8 font-black uppercase italic">
                          <Link href="/database">Explorar Exercícios</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))
          )}
        </Tabs>

        {/* Modal de Registro de Performance Real */}
        <Dialog open={!!loggingExercise} onOpenChange={(open) => !open && setLoggingExercise(null)}>
          <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-white rounded-3xl">
            <DialogHeader className="text-left">
              <DialogTitle className="text-3xl font-headline text-accent uppercase italic">Execução Real</DialogTitle>
              <DialogDescription className="text-muted-foreground uppercase text-[10px] font-bold">
                Registre o que você realmente fez em {loggingExercise?.title}
              </DialogDescription>
            </DialogHeader>

            {loggingExercise && (
              <div className="grid gap-6 py-4">
                {/* Campos Dinâmicos baseado na Categoria */}
                {(() => {
                  const category = EXERCISE_DATABASE.find(e => e.id === loggingExercise.exerciseId)?.category;
                  
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="uppercase font-black text-[10px] text-accent flex items-center gap-1"><Dumbbell className="w-3 h-3"/> Séries</Label>
                          <Input value={actualSets} onChange={(e) => setActualSets(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl font-bold" placeholder="Ex: 4" />
                        </div>
                        <div className="space-y-2">
                          <Label className="uppercase font-black text-[10px] text-accent flex items-center gap-1"><Activity className="w-3 h-3"/> Reps</Label>
                          <Input value={actualReps} onChange={(e) => setActualReps(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl font-bold" placeholder="Ex: 10" />
                        </div>
                      </div>

                      {category === 'Musculação' && (
                        <div className="space-y-2">
                          <Label className="uppercase font-black text-[10px] text-accent">Peso Utilizado (KG)</Label>
                          <Input value={actualWeight} onChange={(e) => setActualWeight(e.target.value)} className="bg-white/5 border-white/10 h-14 text-2xl text-center font-black rounded-xl" placeholder="0" />
                        </div>
                      )}

                      {category === 'Cardio' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="uppercase font-black text-[10px] text-accent flex items-center gap-1"><NavIcon className="w-3 h-3"/> Distância (KM)</Label>
                            <Input value={actualDistance} onChange={(e) => setActualDistance(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl font-bold" placeholder="Ex: 5.2" />
                          </div>
                          <div className="space-y-2">
                            <Label className="uppercase font-black text-[10px] text-accent flex items-center gap-1"><Timer className="w-3 h-3"/> Tempo Execução</Label>
                            <Input value={actualDuration} onChange={(e) => setActualDuration(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl font-bold" placeholder="Ex: 25min" />
                          </div>
                        </div>
                      )}

                      {(category === 'Calistenia' || category === 'Cardio' || category === 'Musculação') && (
                        <div className="space-y-2">
                          <Label className="uppercase font-black text-[10px] text-muted-foreground">Tempo de Descanso</Label>
                          <Input value={actualRest} onChange={(e) => setActualRest(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl font-bold" placeholder="Ex: 60s" />
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            <DialogFooter>
              <Button onClick={handleLogPerformance} className="w-full bg-accent hover:bg-accent/90 h-16 text-xl font-black rounded-2xl shadow-2xl uppercase italic">
                REGISTRAR NO SILO
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Edição (Template Padrão) */}
        <Dialog open={!!editingExercise} onOpenChange={(open) => !open && setEditingExercise(null)}>
          <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-white rounded-3xl">
            <DialogHeader className="text-left">
              <DialogTitle className="text-3xl font-headline text-primary uppercase italic">Plano Padrão</DialogTitle>
              <DialogDescription className="text-muted-foreground uppercase text-xs font-bold">
                Ajuste sua meta base para {editingExercise?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Séries</Label>
                  <Input value={editSets} onChange={(e) => setEditSets(e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl text-center text-xl font-bold" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Reps</Label>
                  <Input value={editReps} onChange={(e) => setEditReps(e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl text-center text-xl font-bold" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Meta de Tempo / Descanso</Label>
                <Input value={editTime} onChange={(e) => setEditTime(e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl font-bold" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateExercise} className="w-full bg-primary hover:bg-primary/90 h-16 text-xl font-black rounded-2xl shadow-2xl uppercase italic">
                ATUALIZAR PLANO
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Finalização Incompleta */}
        <Dialog open={isFinalizeDialogOpen} onOpenChange={setIsFinalizeDialogOpen}>
          <DialogContent className="bg-card border-white/10 text-white rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline text-primary uppercase italic">Treino Incompleto</DialogTitle>
              <DialogDescription className="text-muted-foreground font-bold">
                Você ainda não realizou todos os exercícios de hoje, deseja realmente finalizar o treino?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={executeFinalize} className="flex-1 h-14 bg-primary hover:bg-primary/90 font-black uppercase italic rounded-2xl">SIM</Button>
              <Button onClick={() => setIsFinalizeDialogOpen(false)} variant="outline" className="flex-1 h-14 border-white/10 hover:bg-white/5 font-black uppercase italic rounded-2xl">NÃO</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

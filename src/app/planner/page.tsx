
"use client";

import { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { DayOfWeek } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Pencil, Plus, Loader2, Calendar, Activity, Dumbbell, Timer, Navigation as NavIcon, Clock, CheckCircle2, Info, Eye, AlertCircle } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { EXERCISE_DATABASE } from '@/lib/exercise-db';
import { getPlaceholderById } from '@/lib/placeholder-images';

const DAYS_EN: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function PlannerPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const todayIndex = new Date().getDay();
  const todayName = DAYS_EN[todayIndex];
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayName);
  
  const [editingExercise, setEditingExercise] = useState<any | null>(null);
  const [editSets, setEditSets] = useState('');
  const [editReps, setEditReps] = useState('');
  const [editNotes, setEditNotes] = useState('');
  
  const [loggingExercise, setLoggingExercise] = useState<any | null>(null);
  const [actualSets, setActualSets] = useState('');
  const [actualReps, setActualReps] = useState('');
  const [actualWeight, setActualWeight] = useState('');
  const [actualNotes, setActualNotes] = useState('');

  const [viewingExercise, setViewingExercise] = useState<any | null>(null);
  const [isFinalizeDialogOpen, setIsFinalizeDialogOpen] = useState(false);

  // Consulta de treinos planejados
  const workoutsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'workouts');
  }, [db, user]);

  // Consulta de métricas para verificar se já foi finalizado hoje
  const metricsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'metrics'),
      where('type', '==', 'session_completed'),
      where('day', '==', selectedDay)
    );
  }, [db, user, selectedDay]);

  const { data: rawWorkouts, isLoading: loading } = useCollection(workoutsQuery);
  const { data: rawMetrics } = useCollection(metricsQuery);

  const workouts = rawWorkouts || [];
  const dayWorkouts = workouts.filter(w => w.day === selectedDay);
  
  // Verifica se já existe uma finalização para HOJE (data ISO YYYY-MM-DD)
  const isAlreadyFinalizedToday = useMemo(() => {
    if (!rawMetrics) return false;
    return rawMetrics.some(m => m.date.startsWith(todayStr));
  }, [rawMetrics, todayStr]);

  const isToday = selectedDay === todayName;
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
    setEditNotes(ex.notes || '');
  };

  const handleUpdateExercise = () => {
    if (!db || !user || !editingExercise) return;
    const docRef = doc(db, 'users', user.uid, 'workouts', editingExercise.id);
    updateDocumentNonBlocking(docRef, { 
      sets: editSets, 
      reps: editReps, 
      notes: editNotes
    });
    toast({ title: "Plano atualizado", description: "As metas padrão foram salvas." });
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
      notes: actualNotes,
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(logsRef, performanceData);

    const workoutRef = doc(db, 'users', user.uid, 'workouts', loggingExercise.id);
    updateDocumentNonBlocking(workoutRef, { completed: true });

    toast({
      title: "Performance Registrada!",
      description: "Dados salvos no seu histórico de evolução.",
    });

    setLoggingExercise(null);
  };

  const executeFinalize = () => {
    if (!db || !user) return;
    
    if (isAlreadyFinalizedToday) {
      toast({
        variant: "destructive",
        title: "Treino já finalizado",
        description: "Você já registrou a conclusão deste treino hoje.",
      });
      return;
    }

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

  const getExerciseData = (exerciseId: string) => {
    return EXERCISE_DATABASE.find(e => e.id === exerciseId);
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-4">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold uppercase italic tracking-tighter text-white">Agenda Semanal</h1>
            <p className="text-muted-foreground font-medium">Configure seu plano padrão e registre sua execução real.</p>
          </div>
          <Button asChild className="shadow-xl h-12 px-8 rounded-full bg-primary hover:bg-primary/90 font-black uppercase italic">
            <Link href="/database">
              <Plus className="mr-2 w-5 h-5" /> Adicionar Exercício
            </Link>
          </Button>
        </header>

        <Tabs defaultValue={todayName} className="w-full" onValueChange={(v) => setSelectedDay(v as DayOfWeek)}>
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
                  <CardHeader className="bg-primary/5 border-b border-white/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-3xl font-headline text-primary uppercase italic">{day.label}</CardTitle>
                      <CardDescription className="font-bold text-muted-foreground uppercase text-xs">
                        {dayWorkouts.length} exercícios planejados
                      </CardDescription>
                    </div>
                    
                    {dayWorkouts.length > 0 && (
                      <div className="flex flex-col items-center sm:items-end gap-2">
                        {isToday ? (
                          isAlreadyFinalizedToday ? (
                            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-[10px] font-black uppercase italic">Treino Finalizado Hoje</span>
                            </div>
                          ) : (
                            <Button 
                              onClick={() => isAllCompleted ? executeFinalize() : setIsFinalizeDialogOpen(true)}
                              className={cn(
                                "h-12 px-6 rounded-2xl font-black uppercase italic transition-all",
                                isAllCompleted ? "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(255,0,0,0.5)]" : "bg-muted text-muted-foreground hover:bg-muted/80"
                              )}
                            >
                              <CheckCircle2 className="mr-2 w-5 h-5" /> Finalizar Treino
                            </Button>
                          )
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground bg-white/5 px-4 py-2 rounded-xl border border-white/10 italic">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">Finalização apenas no dia correto</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    {dayWorkouts.length > 0 ? (
                      <div className="divide-y divide-white/5">
                        {dayWorkouts.map((ex) => {
                          const exInfo = getExerciseData(ex.exerciseId);
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
                                    {exInfo?.category === 'Musculação' && <span>Meta: {ex.sets}x{ex.reps} {ex.weight && `- ${ex.weight}kg`}</span>}
                                    {exInfo?.category === 'Calistenia' && <span>Meta: {ex.sets}x{ex.reps}</span>}
                                    {exInfo?.category === 'Cardio' && <span>Meta: {ex.duration}</span>}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                                <Button 
                                  onClick={() => {
                                    setLoggingExercise(ex);
                                    setActualSets(ex.sets || '');
                                    setActualReps(ex.reps || '');
                                    setActualWeight(ex.weight || '');
                                    setActualNotes(ex.notes || '');
                                  }}
                                  className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 rounded-xl h-10 px-4 font-black uppercase italic text-xs flex-1 md:flex-none"
                                >
                                  <Activity className="mr-2 w-4 h-4" /> Registrar Performance
                                </Button>
                                
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => setViewingExercise(ex)} className="text-accent hover:bg-accent/10 rounded-xl">
                                    <Eye className="w-5 h-5" />
                                  </Button>
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
                        <h3 className="text-xl font-headline font-bold uppercase italic text-white">Dia de Descanso?</h3>
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

        {/* Modal de Visualização Detalhada */}
        <Dialog open={!!viewingExercise} onOpenChange={(open) => !open && setViewingExercise(null)}>
          <DialogContent className="sm:max-w-[500px] bg-card border-white/10 text-white rounded-3xl overflow-hidden p-0">
            {viewingExercise && (() => {
              const exInfo = getExerciseData(viewingExercise.exerciseId);
              const imgData = getPlaceholderById(exInfo?.imageId || 'exercise-weights');
              return (
                <>
                  <div className="aspect-video relative bg-white flex items-center justify-center border-b border-white/10">
                    <Image 
                      src={imgData.imageUrl} 
                      alt={viewingExercise.title}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <div className="p-6 space-y-6">
                    <DialogHeader className="p-0 text-left">
                      <DialogTitle className="text-3xl font-headline text-primary uppercase italic">{viewingExercise.title}</DialogTitle>
                      <DialogDescription className="text-accent font-bold uppercase tracking-widest text-xs">{exInfo?.category}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-sm text-white border-l-4 border-primary pl-3 uppercase italic">Instruções</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">{exInfo?.instructions}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {viewingExercise.sets && (
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <Label className="text-[10px] uppercase font-black text-muted-foreground">Séries</Label>
                            <p className="text-xl font-black italic">{viewingExercise.sets}</p>
                          </div>
                        )}
                        {viewingExercise.reps && (
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <Label className="text-[10px] uppercase font-black text-muted-foreground">Reps</Label>
                            <p className="text-xl font-black italic">{viewingExercise.reps}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="p-6 pt-0">
                    <Button onClick={() => setViewingExercise(null)} className="w-full bg-primary hover:bg-primary/90 h-14 font-black uppercase italic rounded-2xl">FECHAR</Button>
                  </DialogFooter>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>

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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px] text-accent">Séries</Label>
                    <Input value={actualSets} onChange={(e) => setActualSets(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px] text-accent">Reps</Label>
                    <Input value={actualReps} onChange={(e) => setActualReps(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="uppercase font-black text-[10px] text-accent">Peso (KG)</Label>
                  <Input value={actualWeight} onChange={(e) => setActualWeight(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase font-black text-[10px] text-accent">Observação</Label>
                  <Textarea value={actualNotes} onChange={(e) => setActualNotes(e.target.value)} className="bg-white/5 border-white/10 min-h-[80px] rounded-xl" placeholder="Como foi a execução?" />
                </div>
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
                <div className="space-y-2">
                  <Label className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Séries</Label>
                  <Input value={editSets} onChange={(e) => setEditSets(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl text-center font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Reps</Label>
                  <Input value={editReps} onChange={(e) => setEditReps(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl text-center font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Observação</Label>
                <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className="bg-white/5 border-white/10 min-h-[80px] rounded-xl" />
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


"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { DayOfWeek } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Pencil, Plus, Loader2, Calendar, Info, CheckCircle2 } from 'lucide-react';
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
import { EXERCISE_DATABASE } from '@/lib/exercise-db';
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
    
    updateDocumentNonBlocking(docRef, {
      sets: editSets,
      reps: editReps,
      time: editTime
    });

    toast({
      title: "Treino atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    setEditingExercise(null);
  };

  const handleFinalizeWorkout = () => {
    if (!db || !user || dayWorkouts.length === 0) return;

    if (!isAllCompleted) {
      setIsFinalizeDialogOpen(true);
    } else {
      executeFinalize();
    }
  };

  const executeFinalize = () => {
    if (!db || !user) return;
    
    // Registrar sessão para análise futura
    const sessionsRef = collection(db, 'users', user.uid, 'metrics');
    addDocumentNonBlocking(sessionsRef, {
      type: 'session_completed',
      day: selectedDay,
      exerciseCount: dayWorkouts.length,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });

    toast({
      title: "Treino Finalizado!",
      description: "Missão cumprida! Seu progresso foi registrado no silo.",
    });
    
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
            <p className="text-muted-foreground font-medium">Gerencie suas rotinas reais sincronizadas na nuvem.</p>
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
                        onClick={handleFinalizeWorkout}
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
                          const imgData = exerciseData ? getPlaceholderById(exerciseData.imageId) : null;
                          
                          return (
                            <div key={ex.id} className={cn(
                              "flex items-center gap-4 p-4 md:p-6 transition-colors",
                              ex.completed ? "bg-green-500/5" : "hover:bg-white/5"
                            )}>
                              <Checkbox 
                                checked={ex.completed} 
                                onCheckedChange={() => toggleExercise(ex.id, ex.completed)}
                                className="w-6 h-6 rounded-full border-primary/50 data-[state=checked]:bg-primary"
                              />
                              <div className="flex-1 space-y-1">
                                <h4 className={cn("text-lg font-bold uppercase italic", ex.completed && "line-through text-muted-foreground")}>
                                  {ex.title}
                                </h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-black text-primary/80 italic">
                                  <span>{ex.sets} Séries</span>
                                  <span>{ex.reps} Reps</span>
                                  {ex.time && <span>{ex.time}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {exerciseData && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="text-accent hover:text-accent hover:bg-accent/10 rounded-xl">
                                        <Info className="w-5 h-5" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-card border-white/10 text-white max-w-lg rounded-3xl overflow-hidden">
                                      <DialogHeader className="p-6 pb-0 text-left">
                                        <DialogTitle className="text-3xl font-headline text-primary italic uppercase">{exerciseData.title}</DialogTitle>
                                        <DialogDescription className="text-accent font-bold uppercase tracking-widest">{exerciseData.category}</DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-6 p-6">
                                        {imgData && (
                                          <div className="aspect-video bg-white rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl flex items-center justify-center">
                                            <Image 
                                              src={imgData.imageUrl} 
                                              alt={exerciseData.title}
                                              fill
                                              unoptimized
                                              className="object-contain object-center"
                                              data-ai-hint={imgData.imageHint}
                                            />
                                            <div className="absolute bottom-3 right-3 pointer-events-none select-none">
                                              <span className="text-[12px] font-black uppercase italic text-primary/30 tracking-tighter">ForgeFIT</span>
                                            </div>
                                          </div>
                                        )}
                                        <div className="space-y-4">
                                          <h4 className="font-bold text-lg text-white border-l-4 border-primary pl-4 uppercase italic">Guia de Execução Profissional</h4>
                                          <p className="text-muted-foreground leading-relaxed text-base bg-white/5 p-4 rounded-2xl border border-white/5">{exerciseData.instructions}</p>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => openEditDialog(ex)}
                                  className="text-accent hover:text-accent hover:bg-accent/10 rounded-xl"
                                >
                                  <Pencil className="w-5 h-5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeExercise(ex.id)}
                                  className="text-destructive hover:bg-destructive/10 rounded-xl"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
                        <div className="bg-white/5 p-6 rounded-full">
                          <Calendar className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-headline font-bold uppercase italic">Dia de Descanso?</h3>
                          <p className="text-muted-foreground max-w-xs mx-auto text-sm uppercase font-medium">Nenhum exercício agendado para {day.label.toLowerCase()}.</p>
                        </div>
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

        {/* Modal de Edição */}
        <Dialog open={!!editingExercise} onOpenChange={(open) => !open && setEditingExercise(null)}>
          <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-white rounded-3xl">
            <DialogHeader className="text-left">
              <DialogTitle className="text-3xl font-headline text-primary uppercase italic">Editar Treino</DialogTitle>
              <DialogDescription className="text-muted-foreground uppercase text-xs font-bold">
                Ajuste os parâmetros para {editingExercise?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Séries</Label>
                  <Input 
                    value={editSets} 
                    onChange={(e) => setEditSets(e.target.value)} 
                    placeholder="ex: 3" 
                    className="bg-white/5 border-white/10 h-14 rounded-xl text-center text-xl font-bold" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Reps</Label>
                  <Input 
                    value={editReps} 
                    onChange={(e) => setEditReps(e.target.value)} 
                    placeholder="ex: 12" 
                    className="bg-white/5 border-white/10 h-14 rounded-xl text-center text-xl font-bold" 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Tempo / Descanso</Label>
                <Input 
                  value={editTime} 
                  onChange={(e) => setEditTime(e.target.value)} 
                  placeholder="ex: 45s" 
                  className="bg-white/5 border-white/10 h-14 rounded-xl font-bold" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateExercise} className="w-full bg-primary hover:bg-primary/90 h-16 text-xl font-black rounded-2xl shadow-2xl uppercase italic">
                SALVAR ALTERAÇÕES
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
              <Button 
                onClick={executeFinalize}
                className="flex-1 h-14 bg-primary hover:bg-primary/90 font-black uppercase italic rounded-2xl"
              >
                SIM
              </Button>
              <Button 
                onClick={() => setIsFinalizeDialogOpen(false)}
                variant="outline"
                className="flex-1 h-14 border-white/10 hover:bg-white/5 font-black uppercase italic rounded-2xl"
              >
                NÃO
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

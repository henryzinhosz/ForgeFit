
"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { EXERCISE_DATABASE, Exercise } from '@/lib/exercise-db';
import { getPlaceholderById } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Info, LogIn, Lock } from 'lucide-react';
import { DayOfWeek } from '@/lib/store';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useFirestore, useUser, errorEmitter, FirestorePermissionError, useAuth, signInWithGoogle } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export default function DatabasePage() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const db = useFirestore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('Todos');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetDay, setTargetDay] = useState<DayOfWeek>('Monday');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('12');
  const [time, setTime] = useState('');

  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    const matchesSearch = ex.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todos' || ex.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    if (selectedExercise && db && user) {
      const workoutRef = collection(db, 'users', user.uid, 'workouts');
      const data = {
        exerciseId: selectedExercise.id,
        title: selectedExercise.title,
        sets,
        reps,
        time,
        day: targetDay,
        completed: false,
        createdAt: new Date().toISOString()
      };

      addDoc(workoutRef, data).catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: workoutRef.path,
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      toast({
        title: "Treino Agendado!",
        description: `${selectedExercise.title} foi adicionado à sua rotina.`,
      });

      setIsDialogOpen(false);
      setSelectedExercise(null);
    } else if (!user) {
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Faça login com sua conta Google para salvar dados na nuvem.",
      });
    }
  };

  const dayOptions: { key: DayOfWeek; label: string }[] = [
    { key: 'Monday', label: 'Segunda' },
    { key: 'Tuesday', label: 'Terça' },
    { key: 'Wednesday', label: 'Quarta' },
    { key: 'Thursday', label: 'Quinta' },
    { key: 'Friday', label: 'Sexta' },
    { key: 'Saturday', label: 'Sábado' },
    { key: 'Sunday', label: 'Domingo' }
  ];

  return (
    <div className="min-h-screen pb-32 pt-20 bg-black">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <header className="space-y-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(255,0,0,0.4)]">
              <Plus className="text-white w-8 h-8" />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter text-white italic">Banco de Exercícios</h1>
              <p className="text-muted-foreground font-medium">Sincronização em tempo real via Cloud Firestore.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar exercício (ex: Supino)..." 
                className="pl-12 h-14 rounded-2xl bg-secondary/80 border-white/10 focus:border-primary/50 transition-all text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {['Todos', 'Musculação', 'Calistenia', 'Cardio'].map((cat) => (
                <Button 
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-full px-8 h-12 font-bold transition-all duration-300 shrink-0",
                    category === cat ? "bg-primary text-white border-none shadow-[0_0_20px_rgba(255,0,0,0.5)]" : "border-white/10 text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExercises.map((ex) => {
            const imgData = getPlaceholderById(ex.imageId);
            return (
              <Card key={ex.id} className="overflow-hidden border-white/10 bg-card/60 backdrop-blur-md shadow-2xl hover:border-primary/50 transition-all group flex flex-col rounded-3xl">
                <div className="h-56 bg-black relative overflow-hidden">
                  <Image 
                    src={imgData.imageUrl} 
                    alt={ex.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    data-ai-hint={imgData.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-primary text-white border-none shadow-xl font-bold px-3 py-1">{ex.category}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors text-white italic">{ex.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                  <p className="text-sm text-muted-foreground line-clamp-2 italic leading-relaxed border-l-2 border-accent/30 pl-3">"{ex.instructions}"</p>
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl h-12 shadow-[0_4px_15px_rgba(255,0,0,0.3)]" 
                      onClick={() => {
                        setSelectedExercise(ex);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 w-5 h-5" /> Adicionar
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 border-white/10 hover:bg-white/10 rounded-2xl w-12 h-12">
                          <Info className="w-6 h-6 text-accent" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-white/10 text-white max-w-lg rounded-3xl overflow-hidden">
                        <DialogHeader className="p-6 pb-0 text-left">
                          <DialogTitle className="text-3xl font-headline text-primary italic uppercase">{ex.title}</DialogTitle>
                          <DialogDescription className="text-accent font-bold uppercase tracking-widest">{ex.category}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 p-6">
                          <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
                            <Image 
                              src={imgData.imageUrl} 
                              alt={ex.title}
                              fill
                              className="object-cover object-top opacity-90"
                              data-ai-hint={imgData.imageHint}
                            />
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-bold text-lg text-white border-l-4 border-primary pl-4 uppercase italic">Guia de Execução Profissional</h4>
                            <p className="text-muted-foreground leading-relaxed text-base bg-white/5 p-4 rounded-2xl border border-white/5">{ex.instructions}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-white rounded-3xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-3xl font-headline text-primary uppercase italic">Configurar Treino</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {user ? `Defina as metas para ${selectedExercise?.title}.` : 'Identificação necessária para salvar dados.'}
            </DialogDescription>
          </DialogHeader>

          {user ? (
            <>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="text-white/80 font-bold uppercase tracking-widest text-xs">Dia da Semana</Label>
                  <Select onValueChange={(v) => setTargetDay(v as DayOfWeek)} defaultValue="Monday">
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-14">
                      <SelectValue placeholder="Escolha um dia" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      {dayOptions.map(d => (
                        <SelectItem key={d.key} value={d.key}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-white/80 font-bold uppercase tracking-widest text-xs">Séries</Label>
                    <Input value={sets} onChange={(e) => setSets(e.target.value)} placeholder="ex: 3" className="bg-white/5 border-white/10 h-14 rounded-xl text-center text-xl" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white/80 font-bold uppercase tracking-widest text-xs">Reps</Label>
                    <Input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="ex: 12" className="bg-white/5 border-white/10 h-14 rounded-xl text-center text-xl" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-white/80 font-bold uppercase tracking-widest text-xs">Tempo / Descanso (opcional)</Label>
                  <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="ex: 45s" className="bg-white/5 border-white/10 h-14 rounded-xl" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90 h-16 text-xl font-black rounded-2xl shadow-2xl">CONFIRMAR</Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 space-y-6 text-center">
              <div className="flex justify-center">
                <div className="bg-primary/20 p-4 rounded-full">
                  <Lock className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Acesso Restrito</h3>
                <p className="text-muted-foreground text-sm">Para salvar seus treinos no Cloud Firestore, você precisa entrar com sua conta.</p>
              </div>
              <Button 
                onClick={() => signInWithGoogle(auth)} 
                className="w-full h-16 bg-white text-black hover:bg-white/90 font-black rounded-2xl text-lg flex items-center justify-center gap-3"
              >
                <LogIn className="w-6 h-6" /> ENTRAR COM GOOGLE
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

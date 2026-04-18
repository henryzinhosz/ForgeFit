
"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { EXERCISE_DATABASE, Exercise } from '@/lib/exercise-db';
import { getPlaceholderById } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Info } from 'lucide-react';
import { useForgeStore, DayOfWeek } from '@/lib/store';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('Todos');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [targetDay, setTargetDay] = useState<DayOfWeek>('Monday');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('12');
  const [time, setTime] = useState('');
  
  const addExerciseToDay = useForgeStore(state => state.addExerciseToDay);

  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    const matchesSearch = ex.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todos' || ex.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    if (selectedExercise) {
      addExerciseToDay(targetDay, {
        exerciseId: selectedExercise.id,
        title: selectedExercise.title,
        sets,
        reps,
        time
      });
      setSelectedExercise(null);
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
    <div className="min-h-screen pb-24 md:pt-20 bg-background">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Plus className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-headline font-bold uppercase tracking-tight">Banco de Exercícios</h1>
          </div>
          <p className="text-muted-foreground">Biblioteca profissional com guias anatômicos 3D.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar exercícios..." 
                className="pl-10 h-12 rounded-xl bg-secondary/50 border-white/5 focus:border-primary/50 transition-all"
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
                    "rounded-full px-6 transition-all duration-300",
                    category === cat ? "bg-primary text-white border-none shadow-[0_0_15px_rgba(255,0,0,0.3)]" : "border-border text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((ex) => {
            const imgData = getPlaceholderById(ex.imageId);
            return (
              <Card key={ex.id} className="overflow-hidden border-border bg-card/40 backdrop-blur-sm shadow-xl hover:border-primary/50 transition-all group flex flex-col">
                <div className="h-48 bg-black relative overflow-hidden">
                  <Image 
                    src={imgData.imageUrl} 
                    alt={ex.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    data-ai-hint={imgData.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <Badge className="absolute top-3 right-3 bg-primary text-white border-none shadow-lg">{ex.category}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{ex.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 italic leading-relaxed">"{ex.instructions}"</p>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl" onClick={() => setSelectedExercise(ex)}>
                          <Plus className="mr-2 w-4 h-4" /> Adicionar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-headline text-primary">Configurar Exercício</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Personalize sua meta para {selectedExercise?.title}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label className="text-white/80">Dia da Semana</Label>
                            <Select onValueChange={(v) => setTargetDay(v as DayOfWeek)} defaultValue="Monday">
                              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                                <SelectValue placeholder="Escolha um dia" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-white/10">
                                {dayOptions.map(d => (
                                  <SelectItem key={d.key} value={d.key}>{d.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label className="text-white/80">Séries</Label>
                              <Input value={sets} onChange={(e) => setSets(e.target.value)} placeholder="ex: 3" className="bg-white/5 border-white/10 h-12 rounded-xl" />
                            </div>
                            <div className="grid gap-2">
                              <Label className="text-white/80">Reps</Label>
                              <Input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="ex: 12" className="bg-white/5 border-white/10 h-12 rounded-xl" />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-white/80">Tempo (opcional)</Label>
                            <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="ex: 45s" className="bg-white/5 border-white/10 h-12 rounded-xl" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90 h-14 text-lg font-bold rounded-xl">Confirmar Treino</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 border-white/10 hover:bg-white/5 rounded-xl">
                          <Info className="w-5 h-5 text-accent" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-white/10 text-white max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-headline text-primary">{ex.title}</DialogTitle>
                          <DialogDescription className="text-accent font-semibold">{ex.category}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 pt-4">
                          <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/5 relative">
                            <Image 
                              src={imgData.imageUrl} 
                              alt={ex.title}
                              fill
                              className="object-cover opacity-90"
                              data-ai-hint={imgData.imageHint}
                            />
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-bold text-lg text-white border-l-4 border-primary pl-3">Guia de Execução</h4>
                            <p className="text-muted-foreground leading-relaxed text-base italic">{ex.instructions}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                            <p className="text-sm text-primary font-medium">Dica Pro: Foque na conexão mente-músculo para maximizar os resultados.</p>
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
    </div>
  );
}

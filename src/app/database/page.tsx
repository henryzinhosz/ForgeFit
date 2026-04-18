
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
          <h1 className="text-4xl font-headline font-bold">Banco de Exercícios</h1>
          <p className="text-muted-foreground">Explore nossa biblioteca de exercícios profissionais para otimizar seu treino.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar exercícios..." 
                className="pl-10 h-12 rounded-xl bg-card border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {['Todos', 'Musculação', 'Calistenia', 'Cardio'].map((cat) => (
                <Button 
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-full px-6",
                    category === cat ? "bg-primary text-white border-none" : "border-border text-muted-foreground hover:bg-white/5"
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
              <Card key={ex.id} className="overflow-hidden border-border bg-card shadow-lg hover:border-primary/50 transition-all group flex flex-col">
                <div className="h-48 bg-muted relative overflow-hidden">
                  <Image 
                    src={imgData.imageUrl} 
                    alt={ex.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    data-ai-hint={imgData.imageHint}
                  />
                  <Badge className="absolute top-3 right-3 bg-black/80 text-white hover:bg-black">{ex.category}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{ex.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 italic">"{ex.instructions}"</p>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10" onClick={() => setSelectedExercise(ex)}>
                          <Plus className="mr-2 w-4 h-4" /> Adicionar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-card border-border">
                        <DialogHeader>
                          <DialogTitle>Adicionar {selectedExercise?.title}</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Configure as metas para este exercício na sua agenda.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label>Selecione o Dia</Label>
                            <Select onValueChange={(v) => setTargetDay(v as DayOfWeek)} defaultValue="Monday">
                              <SelectTrigger className="bg-white/5 border-border">
                                <SelectValue placeholder="Escolha um dia" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                {dayOptions.map(d => (
                                  <SelectItem key={d.key} value={d.key}>{d.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>Séries</Label>
                              <Input value={sets} onChange={(e) => setSets(e.target.value)} placeholder="ex: 3" className="bg-white/5 border-border" />
                            </div>
                            <div className="grid gap-2">
                              <Label>Repetições</Label>
                              <Input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="ex: 12" className="bg-white/5 border-border" />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label>Tempo/Duração (Opcional)</Label>
                            <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="ex: 30s ou 5 min" className="bg-white/5 border-border" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90 text-white font-bold">Confirmar Adição</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:bg-white/5">
                          <Info className="w-5 h-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-border">
                        <DialogHeader>
                          <DialogTitle>{ex.title}</DialogTitle>
                          <DialogDescription>{ex.category}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="aspect-video bg-muted rounded-xl overflow-hidden border border-white/5 relative">
                            <Image 
                              src={imgData.imageUrl} 
                              alt={ex.title}
                              fill
                              className="object-cover"
                              data-ai-hint={imgData.imageHint}
                            />
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold text-primary">Instruções de Execução</h4>
                            <p className="text-muted-foreground leading-relaxed">{ex.instructions}</p>
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

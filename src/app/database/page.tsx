"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { EXERCISE_DATABASE, Exercise } from '@/lib/exercise-db';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Info, Image as ImageIcon } from 'lucide-react';
import { useForgeStore, DayOfWeek } from '@/lib/store';
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
  const [category, setCategory] = useState<string>('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [targetDay, setTargetDay] = useState<DayOfWeek>('Monday');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('12');
  const [time, setTime] = useState('');
  
  const addExerciseToDay = useForgeStore(state => state.addExerciseToDay);

  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    const matchesSearch = ex.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || ex.category === category;
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

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-headline font-bold">Exercise Database</h1>
          <p className="text-muted-foreground">Browse over 50 professionally curated exercises across various modalities.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search exercises..." 
                className="pl-10 h-12 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {['All', 'Musculação', 'Calistenia', 'Cardio'].map((cat) => (
                <Button 
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  onClick={() => setCategory(cat)}
                  className="rounded-full px-6"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((ex) => (
            <Card key={ex.id} className="overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="h-48 bg-secondary relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${ex.imageHint}/600/400`} 
                  alt={ex.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  data-ai-hint={ex.imageHint}
                />
                <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white">{ex.category}</Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{ex.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2 italic">"{ex.instructions}"</p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1" onClick={() => setSelectedExercise(ex)}>
                        <Plus className="mr-2 w-4 h-4" /> Add to Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add {selectedExercise?.title} to Weekly Plan</DialogTitle>
                        <DialogDescription>
                          Configure your goals for this exercise.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Select Day</Label>
                          <Select onValueChange={(v) => setTargetDay(v as DayOfWeek)} defaultValue="Monday">
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Sets</Label>
                            <Input value={sets} onChange={(e) => setSets(e.target.value)} placeholder="e.g. 3" />
                          </div>
                          <div className="grid gap-2">
                            <Label>Reps</Label>
                            <Input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="e.g. 12" />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Time/Duration (Optional)</Label>
                          <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 30s or 5 min" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAdd} className="w-full">Confirm Add</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Info className="w-5 h-5 text-muted-foreground" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{ex.title}</DialogTitle>
                        <DialogDescription>{ex.category}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                          <img 
                            src={`https://picsum.photos/seed/${ex.imageHint}/800/600`} 
                            className="w-full h-full object-cover" 
                            alt={ex.title}
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Instructions</h4>
                          <p className="text-muted-foreground leading-relaxed">{ex.instructions}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

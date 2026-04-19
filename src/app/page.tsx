"use client";

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Droplets, CheckCircle2, Settings2, Flame, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

const DAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Home() {
  const { user } = useUser();
  const db = useFirestore();
  
  const [currentDate, setCurrentDate] = useState<{
    index: number;
    key: string;
    str: string;
  } | null>(null);

  const [weightInput, setWeightInput] = useState<string>('');
  const [heightInput, setHeightInput] = useState<string>('');
  const [ageInput, setAgeInput] = useState<string>('');
  const [genderInput, setGenderInput] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    setCurrentDate({
      index: now.getDay(),
      key: DAYS_EN[now.getDay()],
      str: now.toISOString().split('T')[0]
    });
  }, []);

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(profileRef);

  const workoutsQuery = useMemoFirebase(() => {
    if (!db || !user || !currentDate) return null;
    return query(collection(db, 'users', user.uid, 'workouts'), where('day', '==', currentDate.key));
  }, [db, user, currentDate]);

  const waterQuery = useMemoFirebase(() => {
    if (!db || !user || !currentDate) return null;
    return query(collection(db, 'users', user.uid, 'water'), where('date', '==', currentDate.str));
  }, [db, user, currentDate]);

  const { data: todaysExercises } = useCollection(workoutsQuery);
  const { data: waterLogs } = useCollection(waterQuery);

  const completedToday = (todaysExercises || []).filter(ex => ex.completed).length;
  const totalToday = (todaysExercises || []).length;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;
  
  const currentWater = (waterLogs || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  
  const userWeight = profile?.weight || 0;
  const userHeight = profile?.height || 0;
  const userAge = profile?.age || 0;
  const userGender = profile?.gender || 'Masculino';

  const waterGoal = userWeight > 0 ? (userWeight * 0.05) : 4;
  const proteinGoal = userWeight > 0 ? Math.round(userWeight * 2) : 160;

  // Meta Calórica Oficial (Mifflin-St Jeor)
  const calculateCalorieGoal = () => {
    if (userWeight > 0 && userHeight > 0 && userAge > 0) {
      const bmr = userGender === 'Masculino'
        ? (10 * userWeight) + (6.25 * userHeight) - (5 * userAge) + 5
        : (10 * userWeight) + (6.25 * userHeight) - (5 * userAge) - 161;
      // Multiplicado por fator de atividade 1.6 para militares em treinamento
      return Math.round(bmr * 1.6);
    }
    return 2500;
  };
  const calorieGoal = calculateCalorieGoal();

  const handleIncrementWater = () => {
    if (!db || !user || !currentDate) return;
    const waterRef = collection(db, 'users', user.uid, 'water');
    addDocumentNonBlocking(waterRef, {
      date: currentDate.str,
      amount: 1,
      createdAt: new Date().toISOString()
    });
  };

  const handleSaveProfile = () => {
    if (!profileRef) return;
    setDocumentNonBlocking(profileRef, {
      weight: weightInput ? parseFloat(weightInput) : profile?.weight || 0,
      height: heightInput ? parseFloat(heightInput) : profile?.height || 0,
      age: ageInput ? parseInt(ageInput) : profile?.age || 0,
      gender: genderInput || profile?.gender || "Masculino",
      updatedAt: new Date().toISOString()
    }, { merge: true });
    setIsSettingsOpen(false);
  };

  useEffect(() => {
    if (profile) {
      setWeightInput(profile.weight?.toString() || '');
      setHeightInput(profile.height?.toString() || '');
      setAgeInput(profile.age?.toString() || '');
      setGenderInput(profile.gender || 'Masculino');
    }
  }, [profile]);

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background text-foreground">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter italic text-white">Quartel General</h1>
            <div className="flex items-center gap-3">
              <p className="text-muted-foreground font-medium">
                Hoje é <span className="text-primary font-bold">{currentDate ? DAYS_PT[currentDate.index] : 'Carregando...'}</span>.
              </p>
              {userAge > 0 && (
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase italic text-white/60">
                  {userAge} Anos
                </span>
              )}
            </div>
          </div>
          
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-2xl border-white/10 hover:bg-white/5 h-12 gap-2 uppercase font-black italic">
                <Settings2 className="w-5 h-5" /> Perfil Biométrico
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white rounded-3xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline italic text-primary uppercase">Configurações de Saúde</DialogTitle>
                <DialogDescription className="uppercase font-bold text-[10px] tracking-widest text-muted-foreground">Dados para metas oficiais de água, proteína e calorias.</DialogDescription>
              </DialogHeader>
              <div className="py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px] italic text-primary">Peso Atual (kg)</Label>
                    <input 
                      type="number" 
                      placeholder="Ex: 85" 
                      value={weightInput} 
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="h-12 w-full bg-white/5 border border-white/10 rounded-xl text-lg font-bold px-4 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px] italic text-primary">Altura (cm)</Label>
                    <input 
                      type="number" 
                      placeholder="Ex: 180" 
                      value={heightInput} 
                      onChange={(e) => setHeightInput(e.target.value)}
                      className="h-12 w-full bg-white/5 border border-white/10 rounded-xl text-lg font-bold px-4 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px] italic text-primary">Idade</Label>
                    <input 
                      type="number" 
                      placeholder="Ex: 25" 
                      value={ageInput} 
                      onChange={(e) => setAgeInput(e.target.value)}
                      className="h-12 w-full bg-white/5 border border-white/10 rounded-xl text-lg font-bold px-4 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase font-black text-[10px] italic text-primary">Gênero</Label>
                    <Select value={genderInput} onValueChange={setGenderInput}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl font-bold">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveProfile} className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase italic shadow-2xl">ATUALIZAR PERFIL</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-2xl border-white/10 bg-card/60 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline uppercase italic text-white">Missões do Dia</CardTitle>
                <CardDescription className="font-bold text-muted-foreground">
                  {totalToday > 0 ? `${completedToday} de ${totalToday} exercícios prontos` : 'Nenhum treino agendado para hoje.'}
                </CardDescription>
              </div>
              <CheckCircle2 className={cn("w-10 h-10", progressPercent === 100 ? "text-green-500" : "text-muted")} />
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progressPercent} className="h-4 bg-secondary" />
              <div className="space-y-3">
                {todaysExercises && todaysExercises.length > 0 ? todaysExercises.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className={cn("font-bold text-sm uppercase italic text-white", ex.completed && "line-through text-muted-foreground")}>{ex.title}</span>
                    <span className="text-xs font-black text-primary/80 italic tracking-tighter">{ex.sets}x{ex.reps}</span>
                  </div>
                )) : (
                  <div className="p-10 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-xs font-bold uppercase text-muted-foreground italic">Monte seu treino no Banco de Exercícios.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-2xl border-white/10 bg-card/60 backdrop-blur-md rounded-3xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-headline uppercase italic text-white">Hidratação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-accent italic leading-none">{currentWater}</span>
                  <span className="text-muted-foreground font-bold uppercase text-xs mb-1">/ {waterGoal.toFixed(1)}L</span>
                </div>
                <Button onClick={handleIncrementWater} className="w-full h-14 bg-accent/10 text-accent hover:bg-accent/20 border-accent/20 border-2 rounded-2xl font-black uppercase italic">
                  +1 LITRO <Droplets className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-accent text-white border-none shadow-[0_10px_30px_rgba(255,0,0,0.4)] rounded-3xl overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center gap-2 uppercase italic font-black">
                  <Target className="w-5 h-5" /> Metas Médicas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="bg-white/20 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase italic block">Meta Calórica (Mifflin)</span>
                    <span className="text-sm font-black italic">{calorieGoal} kcal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase italic">Proteína (2g/kg)</span>
                    <span className="text-sm font-black italic">{proteinGoal}g</span>
                  </div>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-[9px] font-bold uppercase italic opacity-80">{userWeight}kg | {userHeight}cm | {userAge} anos</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
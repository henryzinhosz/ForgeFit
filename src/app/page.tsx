
"use client";

import { useMemo, useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Droplets, Zap, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';

const DAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Home() {
  const { user } = useUser();
  const db = useFirestore();
  
  // Estado para evitar erros de hidratação (SSR vs Client mismatch)
  const [currentDate, setCurrentDate] = useState<{
    index: number;
    key: string;
    str: string;
  } | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentDate({
      index: now.getDay(),
      key: DAYS_EN[now.getDay()],
      str: now.toISOString().split('T')[0]
    });
  }, []);

  const workoutsQuery = useMemo(() => {
    if (!db || !user || !currentDate) return null;
    return query(collection(db, 'users', user.uid, 'workouts'), where('day', '==', currentDate.key));
  }, [db, user, currentDate]);

  const waterQuery = useMemo(() => {
    if (!db || !user || !currentDate) return null;
    return query(collection(db, 'users', user.uid, 'water'), where('date', '==', currentDate.str));
  }, [db, user, currentDate]);

  const { data: todaysExercises = [] } = useCollection(workoutsQuery);
  const { data: waterLogs = [] } = useCollection(waterQuery);

  const completedToday = todaysExercises.filter(ex => ex.completed).length;
  const totalToday = todaysExercises.length;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;
  
  const currentWater = waterLogs.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const waterGoal = 4;

  const handleIncrementWater = () => {
    if (!db || !user || !currentDate) return;
    const waterRef = collection(db, 'users', user.uid, 'water');
    addDoc(waterRef, {
      date: currentDate.str,
      amount: 1,
      createdAt: serverTimestamp()
    });
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background text-foreground">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <section className="space-y-2">
          <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter italic">Bem-vindo de volta, Atleta!</h1>
          <p className="text-muted-foreground font-medium">
            Hoje é <span className="text-primary font-bold">{currentDate ? DAYS_PT[currentDate.index] : 'Carregando...'}</span>. Mantenha a constância!
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-2xl border-white/10 bg-card/60 backdrop-blur-md rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline uppercase italic">Sessão de Hoje</CardTitle>
                <CardDescription className="font-bold text-muted-foreground">
                  {totalToday > 0 ? `${completedToday} de ${totalToday} exercícios concluídos` : 'Nenhum exercício planejado para hoje.'}
                </CardDescription>
              </div>
              <CheckCircle2 className={cn("w-10 h-10 transition-colors", progressPercent === 100 ? "text-green-500" : "text-muted")} />
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progressPercent} className="h-4 bg-secondary" />
              
              <div className="space-y-3">
                {todaysExercises.length > 0 ? (
                  todaysExercises.map((ex) => (
                    <div key={ex.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full", ex.completed ? "bg-green-500" : "bg-primary")} />
                        <span className={cn("font-bold text-sm uppercase", ex.completed && "line-through text-muted-foreground")}>{ex.title}</span>
                      </div>
                      <span className="text-xs font-black text-primary/80 italic">{ex.sets}x{ex.reps}{ex.time && ` | ${ex.time}`}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground italic mb-6">Nada agendado para este dia.</p>
                    <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10 h-12 px-8 font-black uppercase">
                      <Link href="/planner">Ir para o Planejador</Link>
                    </Button>
                  </div>
                )}
              </div>
              
              {totalToday > 0 && (
                <Button asChild className="w-full h-14 text-lg font-black rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.3)] bg-primary hover:bg-primary/90 uppercase italic">
                  <Link href="/planner">Abrir Agenda Completa <ChevronRight className="ml-2 w-6 h-6" /></Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-2xl border-white/10 bg-card/60 backdrop-blur-md rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Droplets className="w-20 h-20 text-accent" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-headline uppercase italic">Hidratação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-accent italic leading-none">{currentWater}</span>
                  <span className="text-muted-foreground font-bold uppercase text-xs mb-1">/ {waterGoal} Litros</span>
                </div>
                <Button onClick={handleIncrementWater} className="w-full h-14 bg-accent/10 text-accent hover:bg-accent/20 border-accent/20 border-2 rounded-2xl font-black uppercase italic">
                  Adicionar 1 Litro <Droplets className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-accent text-white border-none shadow-[0_10px_30px_rgba(255,0,0,0.4)] rounded-3xl">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center gap-2 uppercase italic font-black">
                  <Info className="w-5 h-5" /> Coach IA
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-xs font-bold opacity-90 leading-relaxed uppercase">Dúvidas sobre a execução? Use o assistente no planejador para refinar sua técnica.</p>
                <Button asChild variant="secondary" className="w-full h-12 font-black bg-white text-black hover:bg-white/90 rounded-2xl uppercase italic">
                  <Link href="/planner">Consultar IA</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-secondary/20 rounded-2xl p-6 flex items-center gap-6 border border-white/10 backdrop-blur-sm">
          <div className="bg-primary/20 p-3 rounded-2xl text-primary animate-glow">
            <Zap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-black text-primary uppercase italic text-sm tracking-wider">Status: Operacional</p>
            <p className="text-xs text-muted-foreground font-bold uppercase">Todos os dados estão sendo sincronizados em tempo real com o Cloud Firestore.</p>
          </div>
        </div>
      </main>
    </div>
  );
}


"use client";

import { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Scale, Dumbbell, TrendingUp, Loader2, Activity, Zap, Cpu, CalendarCheck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { getHealthAssessment, HealthMetrics } from '@/lib/health-utils';
import { MuscleMap } from '@/components/MuscleMap';
import { EXERCISE_MUSCLE_MAP, MuscleGroup } from '@/lib/muscle-mapping';

export default function ProgressPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [weightInput, setWeightInput] = useState('');
  const [loadInput, setLoadInput] = useState('');
  const [selectedEx, setSelectedEx] = useState('Supino Reto');

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const metricsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'metrics');
  }, [db, user]);

  const logsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'logs');
  }, [db, user]);

  const { data: rawMetrics, isLoading: isMetricsLoading } = useCollection(metricsQuery);
  const { data: rawLogs } = useCollection(logsQuery);

  /**
   * Lógica de Score de Frequência Muscular (MuscleHeatMap)
   */
  const muscleIntensities = useMemo(() => {
    const intensity: Record<MuscleGroup, number> = {
      peito: 0, costas: 0, ombros: 0, biceps: 0, triceps: 0,
      antebraco: 0, core: 0, quadriceps: 0, isquios: 0, gluteos: 0, panturrilha: 0
    };

    if (!rawLogs) return intensity;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    rawLogs.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate < thirtyDaysAgo) return;

      const muscles = EXERCISE_MUSCLE_MAP[log.exerciseId] || [];
      muscles.forEach(m => {
        intensity[m] = Math.min(100, intensity[m] + 10);
      });
    });

    return intensity;
  }, [rawLogs]);

  const weightData = useMemo(() => {
    if (!rawMetrics) return [];
    return rawMetrics
      .filter(m => m.type === 'weight')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-15)
      .map(w => ({
        ...w,
        label: new Date(w.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
      }));
  }, [rawMetrics]);

  const loadData = useMemo(() => {
    if (!rawMetrics) return [];
    return rawMetrics
      .filter(m => m.type === 'maxLoad' && m.exerciseName === selectedEx)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-15)
      .map(l => ({
        ...l,
        label: new Date(l.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
      }));
  }, [rawMetrics, selectedEx]);

  const sessionStats = useMemo(() => {
    if (!rawMetrics) return { totalThisMonth: 0, totalExercises: 0, chartData: [] };
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const sessions = rawMetrics.filter(m => m.type === 'session_completed');
    
    const thisMonthSessions = sessions.filter(s => {
      const d = new Date(s.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalExercises = thisMonthSessions.reduce((acc, curr) => acc + (curr.exerciseCount || 0), 0);

    const chartData = thisMonthSessions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(s => ({
        date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        count: s.exerciseCount || 0
      }));

    return {
      totalThisMonth: thisMonthSessions.length,
      totalExercises,
      chartData
    };
  }, [rawMetrics]);

  const assessment = useMemo(() => {
    const metrics: HealthMetrics = {
      weight: profile?.weight || 70,
      height: profile?.height || 170,
      age: profile?.age || 25,
      gender: (profile?.gender as any) || 'Masculino'
    };
    return getHealthAssessment(metrics);
  }, [profile]);

  const handleAddWeight = () => {
    if (weightInput && db && user && profileRef) {
      const val = parseFloat(weightInput);
      const ref = collection(db, 'users', user.uid, 'metrics');
      
      addDocumentNonBlocking(ref, {
        type: 'weight',
        value: val,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      setDocumentNonBlocking(profileRef, {
        weight: val,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setWeightInput('');
    }
  };

  const handleAddLoad = () => {
    if (loadInput && db && user) {
      const ref = collection(db, 'users', user.uid, 'metrics');
      addDocumentNonBlocking(ref, {
        type: 'maxLoad',
        exerciseName: selectedEx,
        value: parseFloat(loadInput),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      setLoadInput('');
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 pt-20 bg-black">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold text-white uppercase tracking-tighter italic">Evolução Corporal</h1>
            <p className="text-muted-foreground font-medium">Análise de performance via Cloud Firestore Sync.</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
            <Cpu className="text-primary w-5 h-5 animate-pulse" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-white italic tracking-widest">Sistema Biométrico</span>
              <p className="text-sm font-bold text-white uppercase italic">{assessment.bmiClassification}</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-white/5 bg-gradient-to-br from-zinc-900/80 to-black rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-3xl font-headline flex items-center gap-3 text-primary italic uppercase tracking-tighter">
                <Zap className="w-8 h-8" /> Atividade Muscular
              </CardTitle>
              <CardDescription className="text-muted-foreground uppercase text-[10px] font-black tracking-[0.2em]">Mapa de Calor Dinâmico • Sincronizado</CardDescription>
            </CardHeader>
            <CardContent className="p-10 flex items-center justify-center">
              <MuscleMap intensities={muscleIntensities} className="w-full" />
            </CardContent>
          </Card>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-white/5 bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-headline flex items-center gap-2 text-white italic uppercase">
                  <CalendarCheck className="w-6 h-6 text-primary" /> Consistência
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="h-[200px] w-full mb-6">
                  {sessionStats.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sessionStats.chartData}>
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-dashed border-white/10 p-8 text-center">
                      <Activity className="w-8 h-8 mb-2 opacity-20 text-muted-foreground" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase italic">Sem dados mensais.</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4">
                   <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/5">
                      <span className="text-5xl font-black text-white italic leading-none">{sessionStats.totalThisMonth}</span>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-2">Treinos no Mês</p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/5">
                      <span className="text-5xl font-black text-white italic leading-none">{sessionStats.totalExercises}</span>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-2">Missões Concluídas</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-primary italic uppercase">
                <Scale className="w-6 h-6" /> Balanço de Peso
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="h-[250px] w-full">
                {weightData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weightData}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #333', backgroundColor: '#0c0c0c'}} />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center opacity-20"><Scale className="w-12 h-12" /></div>
                )}
              </div>
              <div className="flex gap-3">
                <Input type="number" placeholder="Peso (kg)" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold" />
                <Button onClick={handleAddWeight} className="h-14 px-8 bg-primary text-white font-black rounded-2xl uppercase italic">ATUALIZAR</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-accent italic uppercase">
                <Dumbbell className="w-6 h-6" /> Recordes (PR)
              </CardTitle>
              <Select value={selectedEx} onValueChange={setSelectedEx}>
                <SelectTrigger className="w-[160px] rounded-full bg-white/5 border-white/10 text-white h-10 uppercase font-black text-[10px] italic">
                  <SelectValue placeholder="Exercício" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="Supino Reto">Supino</SelectItem>
                  <SelectItem value="Agachamento Livre">Agachamento</SelectItem>
                  <SelectItem value="Levantamento Terra">Terra</SelectItem>
                  <SelectItem value="Desenvolvimento Militar">Militar</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="h-[250px] w-full">
                {loadData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={loadData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #333', backgroundColor: '#0c0c0c'}} />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={4} dot={{ r: 6, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: '#000' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center opacity-20"><TrendingUp className="w-12 h-12" /></div>
                )}
              </div>
              <div className="flex gap-3">
                <Input type="number" placeholder="Carga (kg)" value={loadInput} onChange={(e) => setLoadInput(e.target.value)} className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold" />
                <Button onClick={handleAddLoad} className="h-14 px-8 bg-accent text-white font-black rounded-2xl uppercase italic">NOVO RECORDE</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

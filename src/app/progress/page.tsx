"use client";

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Area
} from 'recharts';
import { Scale, Dumbbell, TrendingUp, Loader2, Info, Target } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, where, doc } from 'firebase/firestore';

export default function ProgressPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [weightInput, setWeightInput] = useState('');
  const [loadInput, setLoadInput] = useState('');
  const [selectedEx, setSelectedEx] = useState('Supino Reto');

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(profileRef);

  const weightQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'metrics'), 
      where('type', '==', 'weight'), 
      orderBy('date', 'asc'), 
      limit(15)
    );
  }, [db, user]);

  const loadQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'metrics'), 
      where('type', '==', 'maxLoad'), 
      where('exerciseName', '==', selectedEx), 
      orderBy('date', 'asc'), 
      limit(15)
    );
  }, [db, user, selectedEx]);

  const { data: weights, isLoading: loadingWeight } = useCollection(weightQuery);
  const { data: loads, isLoading: loadingLoad } = useCollection(loadQuery);

  const formattedWeights = (weights || []).map(w => ({
    ...w,
    label: new Date(w.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
  }));

  const formattedLoads = (loads || []).map(l => ({
    ...l,
    label: new Date(l.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
  }));

  const performanceInsights = (formattedLoads.length >= 2) 
    ? [(() => {
        const latest = formattedLoads[formattedLoads.length - 1].value;
        const previous = formattedLoads[formattedLoads.length - 2].value;
        const diff = latest - previous;
        if (diff > 0) return `Evolução Detectada: Recorde no ${selectedEx} aumentou ${diff}kg. Excelente progresso!`;
        if (diff < 0) return `Alerta de Performance: Redução de carga detectada. Avalie seu descanso e nutrição.`;
        return `Estabilidade: Carga mantida no ${selectedEx}. Ótimo para consolidação de força.`;
      })()]
    : ["Inicie o registro de cargas para receber insights de performance."];

  const handleAddWeight = () => {
    if (weightInput && db && user && profileRef) {
      const weightValue = parseFloat(weightInput);
      const metricsRef = collection(db, 'users', user.uid, 'metrics');

      addDocumentNonBlocking(metricsRef, {
        type: 'weight',
        value: weightValue,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      // Sincronização Inteligente: Atualiza o peso no perfil global para recalcular todas as metas do app
      setDocumentNonBlocking(profileRef, {
        weight: weightValue,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setWeightInput('');
    }
  };

  const handleAddLoad = () => {
    if (loadInput && db && user) {
      addDocumentNonBlocking(collection(db, 'users', user.uid, 'metrics'), {
        type: 'maxLoad',
        exerciseName: selectedEx,
        value: parseFloat(loadInput),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      setLoadInput('');
    }
  };

  const userWeight = profile?.weight || 0;
  const userHeight = profile?.height || 0;
  const userAge = profile?.age || 0;
  const userGender = profile?.gender || 'Masculino';
  
  const waterGoal = userWeight > 0 ? (userWeight * 0.05) : 4;
  const proteinGoal = userWeight > 0 ? Math.round(userWeight * 2) : 160;

  // Meta Calórica Oficial (Mifflin-St Jeor)
  const calorieGoal = (() => {
    if (userWeight > 0 && userHeight > 0 && userAge > 0) {
      const bmr = userGender === 'Masculino'
        ? (10 * userWeight) + (6.25 * userHeight) - (5 * userAge) + 5
        : (10 * userWeight) + (6.25 * userHeight) - (5 * userAge) - 161;
      return Math.round(bmr * 1.6);
    }
    return 2500;
  })();

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-black">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <header className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-headline font-bold text-white uppercase tracking-tighter italic">Evolução Biométrica</h1>
              <p className="text-muted-foreground font-medium">Dados alocados de forma segura em seu silo pessoal.</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
              <Info className="text-primary w-5 h-5 shrink-0" />
              <p className="text-[10px] font-bold text-white uppercase leading-tight italic">
                O registro de peso aqui atualiza automaticamente seu Perfil e suas metas médicas globais.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-primary uppercase italic">
                <Scale className="w-6 h-6" /> Monitor de Peso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[250px] w-full">
                {loadingWeight ? (
                  <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : formattedWeights.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedWeights}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666', fontWeight: 'bold'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666', fontWeight: 'bold'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #333', backgroundColor: '#0c0c0c', color: 'white'}} />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-dashed border-white/10 text-muted-foreground italic uppercase font-bold text-[10px] p-8 text-center">
                    <TrendingUp className="w-8 h-8 mb-2 opacity-20" />
                    Ainda não há dados de peso disponíveis.<br/>Inicie seu primeiro registro abaixo.
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input type="number" placeholder="Peso Atual (kg)" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} className="rounded-xl h-12 bg-white/5 border-white/10 text-white font-bold" />
                <Button onClick={handleAddWeight} className="h-12 px-8 bg-primary text-white font-black rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.3)] uppercase italic">REGISTRAR</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-accent uppercase italic">
                <Dumbbell className="w-6 h-6" /> Recordes Pessoais
              </CardTitle>
              <Select value={selectedEx} onValueChange={setSelectedEx}>
                <SelectTrigger className="w-[160px] rounded-full bg-white/5 border-white/10 text-white h-10 uppercase font-black text-[10px] italic">
                  <SelectValue placeholder="Exercício" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="Supino Reto">Supino</SelectItem>
                  <SelectItem value="Agachamento Livre">Agachamento</SelectItem>
                  <SelectItem value="Levantamento Terra">Terra</SelectItem>
                  <SelectItem value="Desenvolvimento Militar">Militares</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[250px] w-full">
                {loadingLoad ? (
                  <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>
                ) : formattedLoads.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedLoads}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666', fontWeight: 'bold'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666', fontWeight: 'bold'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #333', backgroundColor: '#0c0c0c', color: 'white'}} />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={4} dot={{ r: 6, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: '#000' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-dashed border-white/10 text-muted-foreground italic uppercase font-bold text-[10px] p-8 text-center">
                    <Dumbbell className="w-8 h-8 mb-2 opacity-20" />
                    Sem recordes registrados para {selectedEx}.<br/>Adicione sua carga máxima abaixo.
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input type="number" placeholder="Carga máx (kg)" value={loadInput} onChange={(e) => setLoadInput(e.target.value)} className="rounded-xl h-12 bg-white/5 border-white/10 text-white font-bold" />
                <Button onClick={handleAddLoad} className="h-12 px-8 bg-accent text-white font-black rounded-xl shadow-[0_0_15_rgba(255,165,0,0.3)] uppercase italic">NOVO PR</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-zinc-900 to-black border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-white italic uppercase tracking-widest">Metas Médicas e Performance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
            <div className="space-y-6">
              <h4 className="text-accent font-black uppercase text-xs italic tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Análise de Performance
              </h4>
              <div className="space-y-4">
                {performanceInsights.map((insight, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 text-sm text-zinc-300 leading-relaxed font-bold italic border-l-4 border-l-accent">
                    "{insight}"
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-primary font-black uppercase text-xs italic tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4" /> Resumo de Metas Atuais
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase italic text-muted-foreground block">Gasto Calórico (TDEE)</span>
                    <span className="text-xs font-bold text-white/40 uppercase">Mifflin-St Jeor</span>
                  </div>
                  <span className="text-lg font-black text-white italic">{calorieGoal} kcal</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase italic text-muted-foreground block">Meta Proteica (2g/kg)</span>
                  </div>
                  <span className="text-lg font-black text-accent italic">{proteinGoal}g</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase italic text-muted-foreground block">Hidratação (50ml/kg)</span>
                  </div>
                  <span className="text-lg font-black text-primary italic">{waterGoal.toFixed(1)}L</span>
                </div>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-xl border border-dashed border-white/10">
                <p className="text-[9px] font-bold uppercase italic text-white/60 text-center">
                  Baseado em: {userWeight}kg | {userHeight}cm | {userAge} anos | {userGender}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
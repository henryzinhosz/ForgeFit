"use client";

import { useState, useEffect } from 'react';
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
  Area
} from 'recharts';
import { Scale, Dumbbell, TrendingUp, Loader2, Target, AlertCircle, Info } from 'lucide-react';
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

  // Referência ao Perfil Global
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(profileRef);

  // Consulta de Peso (Silo do Usuário)
  const weightQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'metrics'), 
      where('type', '==', 'weight'), 
      orderBy('date', 'asc'), 
      limit(15)
    );
  }, [db, user]);

  // Consulta de Recordes (Silo do Usuário)
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

  // Lógica de Insights
  const getInsights = () => {
    if (formattedLoads.length < 2) return ["Aguardando mais registros para gerar análise de performance."];
    const latest = formattedLoads[formattedLoads.length - 1].value;
    const previous = formattedLoads[formattedLoads.length - 2].value;
    const diff = latest - previous;
    if (diff > 0) return [`Evolução de Força: Você aumentou ${diff}kg no ${selectedEx}! Continue assim.`];
    if (diff < 0) return [`Alerta de Carga: Redução detectada. Verifique seu sono e nutrição.`];
    return [`Estabilidade: Carga mantida. Ótimo para consolidação de técnica.`];
  };

  const handleAddWeight = () => {
    if (weightInput && db && user && profileRef) {
      const weightValue = parseFloat(weightInput);
      const metricsRef = collection(db, 'users', user.uid, 'metrics');

      // 1. Salva na subpasta de métricas
      addDocumentNonBlocking(metricsRef, {
        type: 'weight',
        value: weightValue,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      // 2. Sincroniza com Perfil Global para atualizar as metas do App
      setDocumentNonBlocking(profileRef, {
        weight: weightValue,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setWeightInput('');
    }
  };

  const handleAddLoad = () => {
    if (loadInput && db && user) {
      const metricsRef = collection(db, 'users', user.uid, 'metrics');
      addDocumentNonBlocking(metricsRef, {
        type: 'maxLoad',
        exerciseName: selectedEx,
        value: parseFloat(loadInput),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      setLoadInput('');
    }
  };

  // Metas Médicas (Mifflin-St Jeor)
  const userWeight = profile?.weight || 0;
  const userHeight = profile?.height || 0;
  const userAge = profile?.age || 0;
  const userGender = profile?.gender || 'Masculino';

  const calorieGoal = (() => {
    if (userWeight > 0 && userHeight > 0 && userAge > 0) {
      const bmr = userGender === 'Masculino'
        ? (10 * userWeight) + (6.25 * userHeight) - (5 * userAge) + 5
        : (10 * userWeight) + (6.25 * userHeight) - (5 * userAge) - 161;
      return Math.round(bmr * 1.6);
    }
    return 2500;
  })();

  const proteinGoal = userWeight > 0 ? Math.round(userWeight * 2) : 160;

  return (
    <div className="min-h-screen pb-32 pt-20 bg-black">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold text-white uppercase tracking-tighter italic">Evolução Biométrica</h1>
            <p className="text-muted-foreground font-medium">Dados alocados de forma segura no seu silo pessoal.</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
            <Target className="text-primary w-5 h-5" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-white italic">Metas Médicas</span>
              <p className="text-sm font-bold text-white">{calorieGoal} kcal | {proteinGoal}g Prot</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-primary italic uppercase">
                <Scale className="w-6 h-6" /> Histórico de Peso
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
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #333', backgroundColor: '#0c0c0c'}} />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                    <TrendingUp className="w-10 h-10 mb-2 opacity-20 text-muted-foreground" />
                    <p className="text-xs font-bold text-muted-foreground uppercase italic leading-relaxed">Ainda não há dados de peso.<br/>Registre seu peso para iniciar a curva.</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input type="number" placeholder="Peso (kg)" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} className="rounded-xl h-12 bg-white/5 border-white/10 text-white font-bold" />
                <Button onClick={handleAddWeight} className="h-12 px-6 bg-primary text-white font-black rounded-xl uppercase italic">SALVAR</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-accent italic uppercase">
                <Dumbbell className="w-6 h-6" /> Recordes (PR)
              </CardTitle>
              <Select value={selectedEx} onValueChange={setSelectedEx}>
                <SelectTrigger className="w-[140px] rounded-full bg-white/5 border-white/10 text-white h-9 uppercase font-black text-[10px] italic">
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
            <CardContent className="space-y-6">
              <div className="h-[250px] w-full">
                {loadingLoad ? (
                  <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>
                ) : formattedLoads.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedLoads}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #333', backgroundColor: '#0c0c0c'}} />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={4} dot={{ r: 6, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: '#000' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                    <Dumbbell className="w-10 h-10 mb-2 opacity-20 text-muted-foreground" />
                    <p className="text-xs font-bold text-muted-foreground uppercase italic leading-relaxed">Sem recordes para {selectedEx}.<br/>Adicione sua carga máxima.</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input type="number" placeholder="Carga (kg)" value={loadInput} onChange={(e) => setLoadInput(e.target.value)} className="rounded-xl h-12 bg-white/5 border-white/10 text-white font-bold" />
                <Button onClick={handleAddLoad} className="h-12 px-6 bg-accent text-white font-black rounded-xl uppercase italic">NOVO PR</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-zinc-900 to-black border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
            <div className="space-y-6">
              <h4 className="text-accent font-black uppercase text-xs italic tracking-widest flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Relatório de Performance
              </h4>
              <div className="space-y-4">
                {getInsights().map((insight, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/5 border-l-4 border-l-accent text-sm text-zinc-300 leading-relaxed font-bold italic">
                    "{insight}"
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-primary font-black uppercase text-xs italic tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4" /> Resumo Médico Atualizado
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black uppercase italic text-muted-foreground">Metabolismo (Mifflin)</span>
                  <span className="text-lg font-black text-white italic">{calorieGoal} kcal</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black uppercase italic text-muted-foreground">Proteína (2g/kg)</span>
                  <span className="text-lg font-black text-accent italic">{proteinGoal}g</span>
                </div>
              </div>
              <p className="text-[9px] font-bold uppercase italic text-center opacity-40">
                Dados Base: {userWeight}kg | {userHeight}cm | {userAge} anos | {userGender}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
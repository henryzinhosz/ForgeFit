"use client";

import { useState, useMemo } from 'react';
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
import { Scale, Dumbbell, TrendingUp, Loader2, Target, AlertCircle, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { getHealthAssessment, HealthMetrics } from '@/lib/health-utils';

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

  const { data: rawMetrics, isLoading: isMetricsLoading } = useCollection(metricsQuery);

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
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold text-white uppercase tracking-tighter italic">Evolução Biométrica</h1>
            <p className="text-muted-foreground font-medium">Acompanhe seu progresso e metas de saúde.</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
            <Target className="text-primary w-5 h-5" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-white italic">GET (Gasto Total)</span>
              <p className="text-sm font-bold text-white">{assessment.get} kcal/dia</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-primary italic uppercase">
                <Scale className="w-6 h-6" /> Monitor de Peso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[250px] w-full">
                {isMetricsLoading ? (
                  <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : weightData.length > 0 ? (
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
                  <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                    <TrendingUp className="w-10 h-10 mb-2 opacity-20 text-muted-foreground" />
                    <p className="text-xs font-bold text-muted-foreground uppercase italic leading-relaxed">Aguardando primeiro registro...</p>
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
                <Dumbbell className="w-6 h-6" /> Gráfico de PRs
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
                {isMetricsLoading ? (
                  <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>
                ) : loadData.length > 0 ? (
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
                  <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                    <Dumbbell className="w-10 h-10 mb-2 opacity-20 text-muted-foreground" />
                    <p className="text-xs font-bold text-muted-foreground uppercase italic leading-relaxed">Sem recordes para {selectedEx}.</p>
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
                <AlertCircle className="w-4 h-4" /> Análise Médica & Performance
              </h4>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/5 border-l-4 border-l-primary flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase italic text-primary">Classificação Médica (IMC OMS)</p>
                    <p className="text-lg font-black italic text-white">{assessment.bmiClassification || 'Aguardando Perfil'}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase italic">
                      Seu IMC: {assessment.bmi} | Ideal: 18.5 - 24.9
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border-l-4 border-l-accent text-sm text-zinc-300 leading-relaxed font-bold italic">
                  "Sua taxa metabólica basal é de {assessment.tmb} kcal. Com o fator de atividade 1.55, seu gasto diário total é de {assessment.get} kcal."
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-primary font-black uppercase text-xs italic tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4" /> Meta Nutricional Determinada
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black uppercase italic text-muted-foreground">TMB (Harris-Benedict)</span>
                  <span className="text-lg font-black text-white italic">{assessment.tmb} kcal</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black uppercase italic text-muted-foreground">Proteína (1.8g - 2.2g/kg)</span>
                  <span className="text-lg font-black text-accent italic">{assessment.proteinRange.min} - {assessment.proteinRange.max}g</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black uppercase italic text-muted-foreground">Água Diária (50ml/kg)</span>
                  <span className="text-lg font-black text-blue-400 italic">{assessment.waterLiters}L</span>
                </div>
              </div>
              <p className="text-[9px] font-bold uppercase italic text-center opacity-40">
                Lembrando, essas metas são baseadas em cálculo de peso, altura e gênero. Seguindo os parâmetros básicos da OMS, podendo variar de acordo com dietas reguladas
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

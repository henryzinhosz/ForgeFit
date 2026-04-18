
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
  Area
} from 'recharts';
import { Scale, Dumbbell, TrendingUp, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';

export default function ProgressPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [weightInput, setWeightInput] = useState('');
  const [loadInput, setLoadInput] = useState('');
  const [selectedEx, setSelectedEx] = useState('Supino Reto');

  const weightQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'metrics'), where('type', '==', 'weight'), orderBy('date', 'asc'), limit(15));
  }, [db, user]);

  const loadQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'metrics'), where('type', '==', 'maxLoad'), where('exerciseName', '==', selectedEx), orderBy('date', 'asc'), limit(15));
  }, [db, user, selectedEx]);

  const { data: weights = [], loading: loadingWeight } = useCollection(weightQuery);
  const { data: loads = [], loading: loadingLoad } = useCollection(loadQuery);

  const formattedWeights = weights.map(w => ({
    ...w,
    label: new Date(w.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
  }));

  const formattedLoads = loads.map(l => ({
    ...l,
    label: new Date(l.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
  }));

  const performanceInsights = useMemo(() => {
    const insights: string[] = [];
    if (formattedLoads.length >= 2) {
      const latest = formattedLoads[formattedLoads.length - 1].value;
      const previous = formattedLoads[formattedLoads.length - 2].value;
      const diff = latest - previous;
      if (diff > 0) insights.push(`Evolução de Força: Recorde no ${selectedEx} aumentou ${diff}kg. Excelente!`);
      else if (diff < 0) insights.push(`Alerta: Redução de carga no ${selectedEx}. Verifique descanso.`);
    } else {
      insights.push(`Inicie o registro de cargas para ver sua análise.`);
    }
    return insights;
  }, [formattedLoads, selectedEx]);

  const handleAddWeight = () => {
    if (weightInput && db && user) {
      addDoc(collection(db, 'users', user.uid, 'metrics'), {
        type: 'weight',
        value: parseFloat(weightInput),
        date: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setWeightInput('');
    }
  };

  const handleAddLoad = () => {
    if (loadInput && db && user) {
      addDoc(collection(db, 'users', user.uid, 'metrics'), {
        type: 'maxLoad',
        exerciseName: selectedEx,
        value: parseFloat(loadInput),
        date: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setLoadInput('');
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-black">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <header className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-white uppercase tracking-tighter italic">Análise de Performance</h1>
          <p className="text-muted-foreground font-medium">Dados reais sincronizados via Cloud Firestore.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Peso Corporal */}
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline flex items-center gap-2 text-primary uppercase italic">
                  <Scale className="w-6 h-6" /> Peso Corporal
                </CardTitle>
                <CardDescription className="text-muted-foreground">Monitoramento de massa</CardDescription>
              </div>
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
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #333', backgroundColor: '#0c0c0c'}} />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 text-muted-foreground italic">Aguardando dados...</div>
                )}
              </div>
              <div className="flex gap-2">
                <Input type="number" placeholder="Peso atual (kg)" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} className="rounded-xl h-12 bg-white/5 border-white/10 text-white" />
                <Button onClick={handleAddWeight} className="h-12 px-8 bg-primary text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.3)]">REGISTRAR</Button>
              </div>
            </CardContent>
          </Card>

          {/* Cargas Máximas */}
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline flex items-center gap-2 text-accent uppercase italic">
                  <Dumbbell className="w-6 h-6" /> Recordes Pessoais (PR)
                </CardTitle>
              </div>
              <Select value={selectedEx} onValueChange={setSelectedEx}>
                <SelectTrigger className="w-[160px] rounded-full bg-white/5 border-white/10 text-white h-10">
                  <SelectValue placeholder="Exercício" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="Supino Reto">Supino</SelectItem>
                  <SelectItem value="Agachamento Livre">Agachamento</SelectItem>
                  <SelectItem value="Levantamento Terra">Terra</SelectItem>
                  <SelectItem value="Desenvolvimento Militar">Ombros</SelectItem>
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
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #333', backgroundColor: '#0c0c0c'}} />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={4} dot={{ r: 6, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: '#000' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 text-muted-foreground italic">Registre sua carga em {selectedEx}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Input type="number" placeholder="Carga máx (kg)" value={loadInput} onChange={(e) => setLoadInput(e.target.value)} className="rounded-xl h-12 bg-white/5 border-white/10 text-white" />
                <Button onClick={handleAddLoad} className="h-12 px-8 bg-accent text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)]">NOVO PR</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-zinc-900 to-black border-white/10 shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp className="w-48 h-48 text-primary" /></div>
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-white italic uppercase tracking-widest">Relatório Analítico</CardTitle>
            <CardDescription className="text-muted-foreground">Insights reais baseados no seu progresso no banco de dados.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            <div className="space-y-4">
              <h4 className="font-bold text-primary flex items-center gap-2 uppercase tracking-tighter"><CheckCircle2 className="w-5 h-5" /> Tendências Atuais</h4>
              <div className="space-y-3">
                {performanceInsights.map((insight, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm text-zinc-300 leading-relaxed">{insight}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

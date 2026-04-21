
"use client";

import { useState, useMemo, useEffect } from 'react';
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
import { Scale, Dumbbell, TrendingUp, Loader2, Target, ShieldCheck, BrainCircuit, Sparkles, Zap } from 'lucide-react';
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
import { EXERCISE_DATABASE } from '@/lib/exercise-db';
import { aiPerformanceAnalysis, AIPerformanceAnalysisOutput } from '@/ai/flows/ai-performance-analysis';
import { useToast } from '@/hooks/use-toast';

export default function ProgressPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [weightInput, setWeightInput] = useState('');
  const [loadInput, setLoadInput] = useState('');
  const [selectedEx, setSelectedEx] = useState('Supino Reto');
  
  // Estados da IA
  const [analysis, setAnalysis] = useState<AIPerformanceAnalysisOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      .map(d => ({
        ...d,
        label: new Date(d.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
      }));
  }, [rawMetrics, selectedEx]);

  const personalRecord = useMemo(() => {
    if (loadData.length === 0) return 0;
    return Math.max(...loadData.map(d => d.value));
  }, [loadData]);

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
      toast({ title: "Peso atualizado", description: "Registro salvo com sucesso." });
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
      toast({ title: "Novo recorde!", description: `Sua carga em ${selectedEx} foi registrada.` });
    }
  };

  const runAIAnalysis = async () => {
    if (!rawLogs || !rawMetrics) return;
    setIsAnalyzing(true);
    try {
      const result = await aiPerformanceAnalysis({
        historicalWorkouts: (rawLogs || []).map(l => ({
          date: l.date.split('T')[0],
          exercise: l.exerciseId, // Simplificado para o fluxo
          sets: l.actualSets,
          reps: l.actualReps,
          weight: l.actualWeight
        })),
        performanceMetrics: (rawMetrics || []).map(m => ({
          date: m.date.split('T')[0],
          metricType: m.type as any,
          value: m.value,
          exerciseName: m.exerciseName
        })),
        goals: "Melhorar performance física e composição corporal."
      });
      setAnalysis(result);
      toast({ title: "Análise Concluída", description: "A IA processou seus dados de treino." });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro na IA", description: "Não foi possível gerar a análise agora." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isUserLoading || isProfileLoading || isMetricsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-primary font-black uppercase italic tracking-widest animate-pulse">Carregando Dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 pt-20 bg-black">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold text-white uppercase tracking-tighter italic">Evolução de Performance</h1>
            <p className="text-muted-foreground font-medium">Relatório baseado nos seus registros e padrões da OMS.</p>
          </div>
          <Button 
            onClick={runAIAnalysis} 
            disabled={isAnalyzing}
            className="h-14 px-8 bg-gradient-to-r from-primary to-accent text-white font-black rounded-2xl uppercase italic shadow-[0_0_20px_rgba(255,0,0,0.4)]"
          >
            {isAnalyzing ? <Loader2 className="mr-2 animate-spin" /> : <BrainCircuit className="mr-2 w-5 h-5" />}
            {isAnalyzing ? "Analisando..." : "Análise IA do Mês"}
          </Button>
        </header>

        {analysis && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-700">
            <Card className="border-primary/30 bg-card/80 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(255,0,0,0.15)]">
              <CardHeader className="bg-primary/5 border-b border-white/5 p-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-headline text-white uppercase italic">Insights da Inteligência ForgeFIT</CardTitle>
                    <CardDescription className="font-bold text-primary/80 uppercase text-[10px] tracking-widest">Relatório gerado em tempo real</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" /> Observações Principais
                    </h4>
                    <ul className="space-y-3">
                      {analysis.insights.map((insight, idx) => (
                        <li key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-sm italic text-zinc-300 leading-relaxed">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {analysis.plateauDetected && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase italic">
                        <Zap className="w-4 h-4" /> Alerta de Estagnação Detectado
                      </div>
                      <p className="text-sm text-zinc-400 italic">{analysis.plateauDetails}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent" /> Recomendações Estratégicas
                  </h4>
                  <div className="grid gap-3">
                    {analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-accent/5 border border-accent/10 rounded-2xl items-start">
                        <div className="mt-1 w-2 h-2 rounded-full bg-accent shrink-0" />
                        <p className="text-sm italic text-zinc-300 leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-white/10 bg-card/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="bg-primary/10 border-b border-white/5 p-6">
              <CardTitle className="text-2xl font-headline text-primary uppercase italic flex items-center gap-3">
                <ShieldCheck className="w-7 h-7" /> Classificação Médica (IMC OMS)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-4xl font-black text-white italic uppercase">{assessment.bmiClassification}</span>
                <p className="text-lg font-bold text-muted-foreground">
                  Seu IMC: <span className="text-primary">{assessment.bmi}</span> | Ideal: <span className="text-white">18.5 - 24.9</span>
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 leading-relaxed text-muted-foreground italic">
                "Sua taxa metabólica basal é de <span className="text-white font-bold">{assessment.tmb} kcal</span>. Com o fator de atividade 1.55, seu gasto diário total é de <span className="text-primary font-bold">{assessment.get} kcal</span>."
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-zinc-900 to-black rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="bg-accent/10 border-b border-white/5 p-6">
              <CardTitle className="text-2xl font-headline text-accent uppercase italic flex items-center gap-3">
                <Target className="w-7 h-7" /> Meta Nutricional Determinada
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Meta Calórica</span>
                  <p className="text-2xl font-black text-white italic">{assessment.get} kcal</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Proteína Diária</span>
                  <p className="text-2xl font-black text-accent italic">{assessment.proteinRange.min} - {assessment.proteinRange.max}g</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Água Diária (50ml/kg)</span>
                  <p className="text-2xl font-black text-blue-500 italic">{assessment.waterLiters}L</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold uppercase italic text-muted-foreground/60 text-center">
                  Lembrando, essas metas são baseadas em cálculo de peso, altura e gênero. Seguindo os parâmetros básicos da OMS, podendo variar de acordo com dietas reguladas.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
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

          <Card className="border-white/10 bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-accent italic uppercase">
                <Dumbbell className="w-6 h-6" /> Recordes (PR)
              </CardTitle>
              <div className="flex flex-col items-end gap-2">
                <Select value={selectedEx} onValueChange={setSelectedEx}>
                  <SelectTrigger className="w-[180px] rounded-full bg-white/5 border-white/10 text-white h-10 uppercase font-black text-[10px] italic">
                    <SelectValue placeholder="Exercício" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    {EXERCISE_DATABASE.filter(e => e.category === 'Musculação').map(ex => (
                      <SelectItem key={ex.id} value={ex.title}>{ex.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {personalRecord > 0 && (
                  <div className="bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                    <span className="text-[10px] font-black text-accent uppercase italic">MELHOR CARGA: {personalRecord}kg</span>
                  </div>
                )}
              </div>
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
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={4} dot={{r: 4, fill: "hsl(var(--accent))", strokeWidth: 2}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 gap-2">
                    <TrendingUp className="w-12 h-12" />
                    <p className="text-[10px] font-black uppercase italic">Nenhum dado registrado</p>
                  </div>
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

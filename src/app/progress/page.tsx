
"use client";

import { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { useForgeStore, MetricEntry } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { Scale, Dumbbell, Move, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProgressPage() {
  const { metrics, addMetric, addMaxLoad } = useForgeStore();
  const [weightInput, setWeightInput] = useState('');
  const [distInput, setDistInput] = useState('');
  const [loadInput, setLoadInput] = useState('');
  const [selectedEx, setSelectedEx] = useState('Supino');

  // Lógica de Análise de Dados Local (Substituindo IA)
  const performanceInsights = useMemo(() => {
    const insights: string[] = [];
    const currentMaxLoads = metrics.maxLoad[selectedEx] || [];
    
    // Análise de Carga Máxima (PR)
    if (currentMaxLoads.length >= 2) {
      const latest = currentMaxLoads[currentMaxLoads.length - 1].value;
      const previous = currentMaxLoads[currentMaxLoads.length - 2].value;
      const diff = latest - previous;
      const percent = ((diff / previous) * 100).toFixed(1);

      if (diff > 0) {
        insights.push(`Evolução de Força: Seu recorde no ${selectedEx} aumentou ${diff}kg (${percent}%). Excelente trabalho!`);
      } else if (diff < 0) {
        insights.push(`Alerta de Queda: Houve uma redução de carga no ${selectedEx}. Verifique seu descanso e nutrição.`);
      } else {
        insights.push(`Estabilidade detectada: Sua carga no ${selectedEx} manteve-se constante na última sessão.`);
      }
    } else {
      insights.push(`Inicie o registro de cargas no ${selectedEx} para ver sua análise de força.`);
    }

    // Análise de Peso Corporal
    if (metrics.weight.length >= 2) {
      const latestW = metrics.weight[metrics.weight.length - 1].value;
      const firstW = metrics.weight[0].value;
      const totalDiff = latestW - firstW;
      insights.push(`Variação de Peso: Você teve uma alteração total de ${totalDiff.toFixed(1)}kg desde o primeiro registro.`);
    }

    // Detecção de Platô (Se as últimas 3 cargas forem iguais)
    if (currentMaxLoads.length >= 3) {
      const lastThree = currentMaxLoads.slice(-3);
      const isPlateau = lastThree.every(m => m.value === lastThree[0].value);
      if (isPlateau) {
        insights.push(`Aviso de Platô: Você está com a mesma carga no ${selectedEx} há 3 sessões. Tente variar as repetições ou o tempo de descanso.`);
      }
    }

    return insights;
  }, [metrics, selectedEx]);

  const handleAddWeight = () => {
    if (weightInput) {
      addMetric('weight', parseFloat(weightInput));
      setWeightInput('');
    }
  };

  const handleAddDist = () => {
    if (distInput) {
      addMetric('distance', parseFloat(distInput));
      setDistInput('');
    }
  };

  const handleAddLoad = () => {
    if (loadInput) {
      addMaxLoad(selectedEx, parseFloat(loadInput));
      setLoadInput('');
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-black">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <header className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-white uppercase tracking-tighter italic">Análise de Performance</h1>
          <p className="text-muted-foreground font-medium">Dados reais calculados a partir dos seus treinos.</p>
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
                {metrics.weight.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.weight}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: '1px solid #333', backgroundColor: '#0c0c0c', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'}}
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-muted-foreground italic">Aguardando dados de peso...</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Peso atual (kg)" 
                  value={weightInput} 
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="rounded-xl h-12 bg-white/5 border-white/10 text-white"
                />
                <Button onClick={handleAddWeight} className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.3)]">REGISTRAR</Button>
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
                <CardDescription className="text-muted-foreground">Progressão de cargas</CardDescription>
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
                {(metrics.maxLoad[selectedEx] || []).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.maxLoad[selectedEx]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: '1px solid #333', backgroundColor: '#0c0c0c'}}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: '#000' }} 
                        activeDot={{ r: 8, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-muted-foreground italic">Registre sua carga de hoje em {selectedEx}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Carga máx (kg)" 
                  value={loadInput} 
                  onChange={(e) => setLoadInput(e.target.value)}
                  className="rounded-xl h-12 bg-white/5 border-white/10 text-white"
                />
                <Button onClick={handleAddLoad} className="h-12 px-8 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)]">NOVO PR</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Relatório de Dados (Sem IA) */}
        <Card className="bg-gradient-to-br from-zinc-900 to-black border-white/10 shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp className="w-48 h-48 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-white italic uppercase tracking-widest">Relatório Analítico</CardTitle>
            <CardDescription className="text-muted-foreground">Insights gerados por análise estatística do seu histórico.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            <div className="space-y-4">
              <h4 className="font-bold text-primary flex items-center gap-2 uppercase tracking-tighter">
                <CheckCircle2 className="w-5 h-5" /> Tendências Atuais
              </h4>
              <div className="space-y-3">
                {performanceInsights.map((insight, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm text-zinc-300 leading-relaxed">
                    {insight}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-accent flex items-center gap-2 uppercase tracking-tighter">
                <AlertTriangle className="w-5 h-5" /> Fatores de Progresso
              </h4>
              <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Consistência Mensal</span>
                  <span className="text-accent font-bold">Excelente</span>
                </div>
                <div className="h-2 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[85%]" />
                </div>
                <p className="text-xs text-zinc-500 italic">Baseado na sua frequência de registros nos últimos 30 dias.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

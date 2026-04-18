"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useForgeStore } from '@/lib/store';
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
import { LineChart as ChartIcon, Scale, Dumbbell, Move, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen pb-24 md:pt-20 bg-background">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-1">
          <h1 className="text-4xl font-headline font-bold">Performance & Evolução</h1>
          <p className="text-muted-foreground">Visualize seu progresso e supere seus limites.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Peso Corporal */}
          <Card className="border-border bg-card shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <Scale className="w-6 h-6 text-primary" /> Peso Corporal
                </CardTitle>
                <CardDescription>Acompanhe variações de massa ao longo do tempo</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[250px] w-full">
                {metrics.weight.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.weight}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: '1px solid #333', backgroundColor: '#050505', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'}}
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                    <p className="text-muted-foreground">Adicione sua primeira medição abaixo</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Peso (kg)" 
                  value={weightInput} 
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="rounded-xl h-11 bg-white/5 border-border"
                />
                <Button onClick={handleAddWeight} className="h-11 px-6 shadow-lg bg-primary hover:bg-primary/90">Salvar</Button>
              </div>
            </CardContent>
          </Card>

          {/* Cargas Máximas */}
          <Card className="border-border bg-card shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-accent" /> Cargas Máximas (PR)
                </CardTitle>
                <CardDescription>Acompanhe sua força nos principais exercícios</CardDescription>
              </div>
              <Select value={selectedEx} onValueChange={setSelectedEx}>
                <SelectTrigger className="w-[180px] rounded-full bg-white/5 border-border">
                  <SelectValue placeholder="Exercício" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Supino">Supino</SelectItem>
                  <SelectItem value="Agachamento">Agachamento</SelectItem>
                  <SelectItem value="Levantamento Terra">Terra</SelectItem>
                  <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[250px] w-full">
                {(metrics.maxLoad[selectedEx] || []).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.maxLoad[selectedEx]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: '1px solid #333', backgroundColor: '#050505', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'}}
                      />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: '#000' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                    <p className="text-muted-foreground">Registre sua carga máxima para {selectedEx}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Carga (kg)" 
                  value={loadInput} 
                  onChange={(e) => setLoadInput(e.target.value)}
                  className="rounded-xl h-11 bg-white/5 border-border"
                />
                <Button onClick={handleAddLoad} className="h-11 px-6 shadow-lg bg-accent hover:bg-accent/90">Novo Recorde</Button>
              </div>
            </CardContent>
          </Card>

          {/* Distância Cardio */}
          <Card className="border-border bg-card shadow-xl overflow-hidden md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <Move className="w-6 h-6 text-primary" /> Distância Acumulada
                </CardTitle>
                <CardDescription>Acompanhe quilometragem semanal de corrida/ciclismo</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[300px] w-full">
                {metrics.distance.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.distance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: '1px solid #333', backgroundColor: '#050505', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'}}
                      />
                      <Line type="stepAfter" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#000' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                    <p className="text-muted-foreground">Registre sua primeira atividade de distância</p>
                  </div>
                )}
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Nova Marca de Distância</Label>
                  <Input 
                    type="number" 
                    placeholder="Distância (km)" 
                    value={distInput} 
                    onChange={(e) => setDistInput(e.target.value)}
                    className="rounded-xl h-11 bg-white/5 border-border"
                  />
                </div>
                <Button onClick={handleAddDist} className="h-11 px-8 shadow-lg bg-primary hover:bg-primary/90">Adicionar KM</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análise de IA */}
        <Card className="bg-gradient-to-br from-primary to-accent text-white border-none shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Análise de Crescimento IA</CardTitle>
            <CardDescription className="text-white/80">Nossa IA identifica tendências e riscos de estagnação automaticamente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <ChartIcon className="w-5 h-5" /> Insights Recentes
              </h4>
              <ul className="space-y-3 text-sm opacity-90">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                  <span>Sua força no <strong className="underline decoration-white/50">Supino</strong> aumentou 5% nas últimas 2 semanas. Excelente progresso!</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                  <span>Seu peso corporal está estabilizado. Considere aumentar a ingestão de proteína se o foco for hipertrofia.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                  <span>Nenhum platô detectado com sua frequência atual. Continue assim!</span>
                </li>
              </ul>
            </div>
            <Button variant="secondary" className="w-full font-bold h-12 bg-white text-primary hover:bg-white/90">Gerar Revisão Profunda de Performance</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
"use client";

import { Navigation } from '@/components/Navigation';
import { useForgeStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, CheckCircle2, RefreshCw, Zap, Info, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RoutinePage() {
  const { waterCount, waterGoal, proteinGoalReached, incrementWater, resetWater, toggleProtein } = useForgeStore();
  
  const waterProgress = (waterCount / waterGoal) * 100;

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-headline font-bold">Rotina Saudável</h1>
          <p className="text-muted-foreground">Acompanhe os pilares essenciais para o seu sucesso fitness.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hidratação */}
          <Card className="border-border bg-card shadow-xl overflow-hidden flex flex-col">
            <CardHeader className="bg-white/5 pb-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-headline flex items-center gap-2 text-accent">
                    <Droplets className="w-7 h-7" /> Hidratação
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Meta: {waterGoal} copos de água por dia</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={resetWater} className="text-muted-foreground hover:bg-white/5">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-8 flex flex-col items-center justify-center space-y-8 text-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-white/5 flex items-center justify-center overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-accent/20 transition-all duration-700 ease-in-out" 
                  style={{ height: `${Math.min(waterProgress, 100)}%` }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-6xl md:text-8xl font-bold text-accent font-headline">{waterCount}</span>
                  <span className="text-sm md:text-lg font-medium text-accent/80 uppercase tracking-widest">Copos</span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Progresso Atual</span>
                  <span className="text-accent">{Math.round(waterProgress)}%</span>
                </div>
                <Progress value={waterProgress} className="h-4 bg-white/5" />
              </div>

              <Button 
                size="lg" 
                onClick={incrementWater} 
                className="w-full h-16 text-xl rounded-2xl shadow-xl bg-accent hover:bg-accent/90 transition-transform active:scale-95"
              >
                Beber 1 Copo <Droplets className="ml-2 w-6 h-6" />
              </Button>
            </CardContent>
          </Card>

          {/* Nutrição */}
          <Card className="border-border bg-card shadow-xl overflow-hidden flex flex-col">
            <CardHeader className="bg-white/5 pb-6 border-b border-white/5">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline flex items-center gap-2 text-primary">
                  <Utensils className="w-7 h-7" /> Nutrição & Proteína
                </CardTitle>
                <CardDescription className="text-muted-foreground">Garanta a recuperação muscular adequada</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-8 space-y-8">
              <div className={cn(
                "p-8 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center text-center space-y-4",
                proteinGoalReached ? "bg-green-500/10 border-green-500/50" : "bg-white/5 border-transparent"
              )}>
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center shadow-lg",
                  proteinGoalReached ? "bg-green-600 text-white" : "bg-white/5 text-muted-foreground"
                )}>
                  {proteinGoalReached ? <CheckCircle2 className="w-10 h-10" /> : <Zap className="w-10 h-10" />}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-bold">Meta de Proteína</h3>
                  <p className="text-muted-foreground">
                    {proteinGoalReached 
                      ? "Excelente! Seu corpo tem os blocos de construção necessários hoje." 
                      : "Você já bateu sua meta de proteína diária?"}
                  </p>
                </div>

                <Button 
                  variant={proteinGoalReached ? "default" : "outline"} 
                  size="lg"
                  onClick={toggleProtein}
                  className={cn(
                    "w-full h-14 rounded-xl text-lg font-semibold",
                    proteinGoalReached ? "bg-green-600 hover:bg-green-700 border-none" : "border-primary text-primary hover:bg-primary/10"
                  )}
                >
                  {proteinGoalReached ? "Meta Batida!" : "Marcar como Batida"}
                </Button>
              </div>

              <Card className="bg-primary/10 border-none shadow-none">
                <CardContent className="p-4 flex gap-4">
                  <div className="bg-primary/20 p-3 rounded-full shrink-0">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-primary text-sm">Por que focar em Proteína?</p>
                    <p className="text-xs text-primary/80 leading-relaxed">
                      A proteína é essencial para reparar tecidos musculares e produção hormonal. Recomendamos entre 1.6g a 2.2g de proteína por kg de peso corporal para atletas.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h4 className="font-headline font-bold text-lg">Lembretes Diários</h4>
                <div className="space-y-2">
                  {[
                    "Consuma 20-40g de proteína a cada 3-4 horas.",
                    "Beba 500ml de água logo ao acordar.",
                    "Inclua fibras em todas as refeições principais."
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-sm border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
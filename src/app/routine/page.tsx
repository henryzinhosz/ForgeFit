
"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useForgeStore, MealSlot, FoodItem } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, CheckCircle2, RefreshCw, Zap, Info, Utensils, Coffee, Sun, Moon, Clock, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

const MILITARY_FOOD_DB: FoodItem[] = [
  { id: '1', name: 'Arroz Branco', portion: '1 escumadeira (150g)', calories: 190, protein: 4 },
  { id: '2', name: 'Feijão Carioca', portion: '1 concha (100g)', calories: 80, protein: 5 },
  { id: '3', name: 'Macarrão ao Sugo', portion: '1 escumadeira (100g)', calories: 160, protein: 5 },
  { id: '4', name: 'Bife Bovino Grelhado', portion: '1 pedaço médio', calories: 240, protein: 26 },
  { id: '5', name: 'Sobrecoxa de Frango', portion: '1 unidade média', calories: 210, protein: 22 },
  { id: '6', name: 'Ovo Cozido', portion: '1 unidade', calories: 80, protein: 6 },
  { id: '7', name: 'Pão Francês', portion: '1 unidade (50g)', calories: 135, protein: 4 },
  { id: '8', name: 'Manteiga/Margarina', portion: '1 ponta de faca', calories: 45, protein: 0 },
  { id: '9', name: 'Leite Integral', portion: '1 caneca (200ml)', calories: 120, protein: 6 },
  { id: '10', name: 'Café com Açúcar', portion: '1 caneca (100ml)', calories: 40, protein: 0 },
  { id: '11', name: 'Suco do Rancho', portion: '1 caneca (200ml)', calories: 80, protein: 0 },
  { id: '12', name: 'Salada Diversa', portion: 'À vontade', calories: 25, protein: 1 },
  { id: '13', name: 'Queijo Prato/Mussarela', portion: '1 fatia média', calories: 85, protein: 6 },
  { id: '14', name: 'Presunto', portion: '1 fatia média', calories: 35, protein: 4 },
  { id: '15', name: 'Farofa', portion: '1 colher de sopa', calories: 70, protein: 1 },
];

export default function RoutinePage() {
  const { 
    waterCount, 
    waterGoal, 
    proteinGoalReached, 
    incrementWater, 
    resetWater, 
    toggleProtein,
    loggedMeals,
    addFoodToMeal,
    removeFoodFromMeal,
    clearDailyMeals
  } = useForgeStore();
  
  const [activeSlot, setActiveSlot] = useState<MealSlot | null>(null);

  const waterProgress = (waterCount / waterGoal) * 100;

  const totalCalories = Object.values(loggedMeals).flat().reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = Object.values(loggedMeals).flat().reduce((acc, curr) => acc + curr.protein, 0);

  const mealSlots: { key: MealSlot, label: string, time: string, icon: any }[] = [
    { key: 'café', label: 'Café da Manhã', time: '06:30', icon: Coffee },
    { key: 'almoço', label: 'Almoço', time: '12:30', icon: Sun },
    { key: 'janta', label: 'Jantar', time: '18:00', icon: Moon },
    { key: 'ceia', label: 'Ceia', time: '20:00', icon: Clock },
  ];

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-black">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <header className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-headline font-bold text-white uppercase italic tracking-tighter">Rotina do Quartel</h1>
          <p className="text-muted-foreground font-medium">Controle de prontidão: Hidratação e Nutrição do Rancho.</p>
        </header>

        {/* Diário Alimentar do Rancho */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline text-white italic uppercase flex items-center gap-2">
              <Utensils className="text-primary w-6 h-6" /> Diário do Rancho
            </h2>
            <Button variant="outline" size="sm" onClick={clearDailyMeals} className="border-white/10 text-xs text-muted-foreground hover:bg-white/5 h-8">
              <RefreshCw className="mr-2 w-3 h-3" /> Resetar Dia
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mealSlots.map((slot) => {
              const items = loggedMeals[slot.key];
              const slotCalories = items.reduce((acc, curr) => acc + curr.calories, 0);

              return (
                <Card key={slot.key} className="bg-card/50 border-white/10 overflow-hidden group hover:border-primary/30 transition-all">
                  <CardHeader className="p-4 bg-white/5 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-lg text-primary">
                        <slot.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-white uppercase">{slot.label}</CardTitle>
                        <CardDescription className="text-[10px] text-primary/80 font-bold">{slot.time}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2 min-h-[80px]">
                      {items.length > 0 ? (
                        items.map((food) => (
                          <div key={food.id} className="flex items-center justify-between text-[11px] bg-white/5 p-2 rounded-lg border border-white/5">
                            <span className="text-zinc-300 truncate mr-2">{food.name}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-primary font-bold">{food.calories}kcal</span>
                              <button onClick={() => removeFoodFromMeal(slot.key, food.id)} className="text-zinc-500 hover:text-red-500">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-muted-foreground italic text-center py-4">Nenhum alimento registrado.</p>
                      )}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full h-10 bg-secondary hover:bg-white/10 text-white border-white/10 border text-[11px] font-bold uppercase" onClick={() => setActiveSlot(slot.key)}>
                          <PlusCircle className="mr-2 w-4 h-4" /> Adicionar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-headline italic text-primary uppercase">Cardápio do Rancho - {slot.label}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="grid gap-2">
                            {MILITARY_FOOD_DB.map((food) => (
                              <button
                                key={food.id}
                                onClick={() => {
                                  if (activeSlot) addFoodToMeal(activeSlot, food);
                                }}
                                className="flex items-center justify-between p-4 bg-white/5 hover:bg-primary/20 rounded-xl transition-colors text-left group"
                              >
                                <div className="space-y-1">
                                  <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">{food.name}</p>
                                  <p className="text-[10px] text-muted-foreground italic">{food.portion}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black text-primary">{food.calories} KCAL</p>
                                  <p className="text-[10px] text-accent font-bold">{food.protein}g PROT</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Resumo Nutricional do Dia */}
          <Card className="bg-gradient-to-r from-zinc-900 to-black border-primary/20 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Utensils className="w-48 h-48 text-primary" />
            </div>
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline text-white italic uppercase tracking-widest">Resumo do Rancho</h3>
                <p className="text-muted-foreground text-sm font-medium">Soma de ingestão calórica para as missões de hoje.</p>
              </div>
              <div className="flex gap-12">
                <div className="text-center space-y-1">
                  <p className="text-4xl font-black text-primary italic leading-none">{totalCalories}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Kcal Totais</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-4xl font-black text-accent italic leading-none">{totalProtein}g</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Proteína Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hidratação */}
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/5 pb-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-headline flex items-center gap-2 text-accent uppercase italic">
                    <Droplets className="w-7 h-7" /> Hidratação
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Meta Operacional: {waterGoal} Litros</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={resetWater} className="text-muted-foreground hover:bg-white/5">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8 flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full border-8 border-white/5 flex items-center justify-center overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-accent/20 transition-all duration-700 ease-in-out" 
                  style={{ height: `${Math.min(waterProgress, 100)}%` }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-7xl font-black text-accent font-headline italic leading-none">{waterCount}</span>
                  <span className="text-xs font-bold text-accent/80 uppercase tracking-[0.2em]">Litros</span>
                </div>
              </div>
              <Button onClick={incrementWater} className="w-full h-16 text-xl rounded-2xl bg-accent hover:bg-accent/90 shadow-[0_0_20px_rgba(255,165,0,0.3)] font-black italic">
                REGISTRAR +1 LITRO
              </Button>
            </CardContent>
          </Card>

          {/* Proteína Rápida */}
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/5 pb-6 border-b border-white/5">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-primary uppercase italic">
                <Zap className="w-7 h-7" /> Prontidão de Proteína
              </CardTitle>
              <CardDescription className="text-muted-foreground">Check-list rápido de macros</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className={cn(
                "p-8 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center text-center space-y-4",
                proteinGoalReached ? "bg-primary/10 border-primary/50" : "bg-white/5 border-white/5"
              )}>
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center shadow-lg",
                  proteinGoalReached ? "bg-primary text-white" : "bg-white/5 text-muted-foreground"
                )}>
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-headline font-bold uppercase italic">Meta Alcançada?</h3>
                <Button 
                  onClick={toggleProtein}
                  className={cn(
                    "w-full h-14 rounded-xl text-lg font-black uppercase italic",
                    proteinGoalReached ? "bg-primary hover:bg-primary/90" : "bg-zinc-800 text-muted-foreground"
                  )}
                >
                  {proteinGoalReached ? "ESTÁ PAGO!" : "MARCAR COMO PAGO"}
                </Button>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex gap-4">
                <Info className="text-primary w-5 h-5 shrink-0" />
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  <span className="text-primary font-bold">Dica Rancho:</span> No quartel, priorize os pedaços de carne e o feijão para garantir os aminoácidos necessários para a reconstrução muscular pós-TAF.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

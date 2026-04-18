"use client";

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, CheckCircle2, Zap, Utensils, Coffee, Sun, Moon, Clock, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCollection, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';

const MILITARY_FOOD_DB = [
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
  const { user } = useUser();
  const db = useFirestore();
  const todayStr = new Date().toISOString().split('T')[0];
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const mealQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'meals'), where('date', '==', todayStr));
  }, [db, user, todayStr]);

  const waterQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'water'), where('date', '==', todayStr));
  }, [db, user, todayStr]);

  const { data: rawMeals } = useCollection(mealQuery);
  const { data: rawWater } = useCollection(waterQuery);

  const meals = rawMeals || [];
  const waterLogs = rawWater || [];

  const waterCount = waterLogs.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const waterGoal = 4;
  const waterProgress = (waterCount / waterGoal) * 100;

  const totalCalories = meals.reduce((acc, curr) => acc + (curr.calories || 0), 0);
  const totalProtein = meals.reduce((acc, curr) => acc + (curr.protein || 0), 0);

  const mealSlots = [
    { key: 'café', label: 'Café da Manhã', time: '06:30', icon: Coffee },
    { key: 'almoço', label: 'Almoço', time: '12:30', icon: Sun },
    { key: 'janta', label: 'Jantar', time: '18:00', icon: Moon },
    { key: 'ceia', label: 'Ceia', time: '20:00', icon: Clock },
  ];

  const handleAddFood = (slot: string, food: any) => {
    if (!db || !user) return;
    addDocumentNonBlocking(collection(db, 'users', user.uid, 'meals'), {
      ...food,
      slot,
      date: todayStr,
      createdAt: new Date().toISOString()
    });
  };

  const handleRemoveFood = (id: string) => {
    if (!db || !user) return;
    deleteDocumentNonBlocking(doc(db, 'users', user.uid, 'meals', id));
  };

  const handleIncrementWater = () => {
    if (!db || !user) return;
    addDocumentNonBlocking(collection(db, 'users', user.uid, 'water'), {
      date: todayStr,
      amount: 1,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-black">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <header className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-headline font-bold text-white uppercase italic tracking-tighter">Rotina Alimentar</h1>
          <p className="text-muted-foreground font-medium">Anote sua rotina alimentar e tenha uma média aproximada de calorias e proteínas.</p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-headline text-white italic uppercase flex items-center gap-2">
            <Utensils className="text-primary w-6 h-6" /> Alimentação do Dia
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {mealSlots.map((slot) => {
              const items = meals.filter(m => m.slot === slot.key);
              return (
                <Card key={slot.key} className="bg-card/50 border-white/10 overflow-hidden group hover:border-primary/30 transition-all rounded-3xl">
                  <CardHeader className="p-4 bg-white/5 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-lg text-primary"><slot.icon className="w-5 h-5" /></div>
                      <div>
                        <CardTitle className="text-sm font-bold text-white uppercase italic">{slot.label}</CardTitle>
                        <CardDescription className="text-[10px] text-primary/80 font-black italic">{slot.time}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2 min-h-[80px]">
                      {items.map((food) => (
                        <div key={food.id} className="flex items-center justify-between text-[11px] bg-white/5 p-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-zinc-300 truncate mr-2 font-bold uppercase">{food.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-primary font-black italic">{food.calories}kcal</span>
                            <button onClick={() => handleRemoveFood(food.id)} className="text-zinc-500 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full h-10 bg-secondary hover:bg-white/10 text-white border-white/10 border text-[11px] font-black uppercase italic rounded-xl" onClick={() => setActiveSlot(slot.key)}>
                          <PlusCircle className="mr-2 w-4 h-4" /> Adicionar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-md rounded-3xl">
                        <DialogHeader><DialogTitle className="font-headline italic text-primary uppercase text-2xl">Cardápio</DialogTitle></DialogHeader>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="grid gap-2">
                            {MILITARY_FOOD_DB.map((food) => (
                              <button key={food.id} onClick={() => activeSlot && handleAddFood(activeSlot, food)} className="flex items-center justify-between p-4 bg-white/5 hover:bg-primary/20 rounded-2xl transition-all text-left group border border-white/5">
                                <div className="space-y-1">
                                  <p className="font-bold text-sm text-white group-hover:text-primary transition-colors uppercase italic">{food.name}</p>
                                  <p className="text-[10px] text-muted-foreground italic font-medium">{food.portion}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black text-primary italic leading-none">{food.calories} KCAL</p>
                                  <p className="text-[10px] text-accent font-black uppercase mt-1">{food.protein}g PROT</p>
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

          <Card className="bg-gradient-to-r from-zinc-900 to-black border-primary/20 shadow-2xl overflow-hidden relative rounded-3xl">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline text-white italic uppercase tracking-widest">Resumo</h3>
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
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/5 pb-6 border-b border-white/5">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-accent uppercase italic"><Droplets className="w-7 h-7" /> Hidratação</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8 flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full border-8 border-white/5 flex items-center justify-center overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-accent/20 transition-all duration-700 ease-out" style={{ height: `${Math.min(waterProgress, 100)}%` }} />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-7xl font-black text-accent font-headline italic leading-none">{waterCount}</span>
                  <span className="text-xs font-bold text-accent/80 uppercase tracking-[0.2em] mt-1">Litros</span>
                </div>
              </div>
              <Button onClick={handleIncrementWater} className="w-full h-16 text-xl rounded-2xl bg-accent hover:bg-accent/90 shadow-[0_0_20px_rgba(255,165,0,0.3)] font-black italic uppercase">REGISTRAR +1 LITRO</Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/5 pb-6 border-b border-white/5">
              <CardTitle className="text-2xl font-headline flex items-center gap-2 text-primary uppercase italic"><Zap className="w-7 h-7" /> Prontidão</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center text-center space-y-4 group hover:bg-white/10 transition-colors">
                <CheckCircle2 className={cn("w-12 h-12 transition-colors", totalProtein >= 150 ? "text-primary" : "text-muted-foreground")} />
                <h3 className="text-2xl font-headline font-bold uppercase italic">Meta de Proteína</h3>
                <p className="text-sm text-muted-foreground font-bold uppercase italic tracking-tighter">Progresso: {totalProtein}g de 150g (estimado)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

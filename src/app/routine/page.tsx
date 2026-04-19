
"use client";

import { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Utensils, Coffee, Sun, Moon, Clock, Trash2, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { getHealthAssessment, HealthMetrics } from '@/lib/health-utils';

const BRAZILIAN_FOOD_DB = [
  // Arroz e Grãos
  { id: '1', name: 'Arroz Branco Cozido', portion: '1 escumadeira (150g)', calories: 192, protein: 4 },
  { id: '2', name: 'Arroz Integral Cozido', portion: '1 escumadeira (150g)', calories: 186, protein: 4 },
  { id: '3', name: 'Feijão Carioca Cozido', portion: '1 concha (100g)', calories: 76, protein: 5 },
  { id: '4', name: 'Feijão Preto Cozido', portion: '1 concha (100g)', calories: 77, protein: 5 },
  { id: '5', name: 'Macarrão de Sêmola Cozido', portion: '1 escumadeira (100g)', calories: 158, protein: 5 },
  { id: '6', name: 'Macarrão Integral Cozido', portion: '1 escumadeira (100g)', calories: 124, protein: 5 },
  { id: '7', name: 'Quinoa Cozida', portion: '100g', calories: 120, protein: 4 },
  { id: '8', name: 'Cuscuz Nordestino', portion: '1 pedaço (100g)', calories: 112, protein: 3 },
  
  // Proteínas Animais
  { id: '10', name: 'Bife de Patinho Grelhado', portion: '100g', calories: 219, protein: 35 },
  { id: '11', name: 'Bife de Alcatra Grelhado', portion: '100g', calories: 241, protein: 32 },
  { id: '12', name: 'Picanha Grelhada (sem gordura)', portion: '100g', calories: 238, protein: 30 },
  { id: '13', name: 'Frango Filé Grelhado', portion: '100g', calories: 165, protein: 31 },
  { id: '14', name: 'Sobrecoxa de Frango Assada', portion: '1 unidade (100g)', calories: 215, protein: 24 },
  { id: '15', name: 'Ovo de Galinha Cozido', portion: '1 unidade', calories: 78, protein: 6 },
  { id: '16', name: 'Ovo de Galinha Frito', portion: '1 unidade', calories: 120, protein: 6 },
  { id: '17', name: 'Tilápia Grelhada', portion: '100g', calories: 128, protein: 26 },
  { id: '18', name: 'Salmão Grelhado', portion: '100g', calories: 208, protein: 22 },
  { id: '19', name: 'Atum em Lata (em água)', portion: '1 lata (120g)', calories: 116, protein: 26 },
  { id: '20', name: 'Carne Moída (Acém)', portion: '100g', calories: 212, protein: 26 },

  // Pães e Cafés
  { id: '30', name: 'Pão Francês', portion: '1 unidade (50g)', calories: 135, protein: 4 },
  { id: '31', name: 'Pão de Forma Integral', portion: '2 fatias (50g)', calories: 122, protein: 5 },
  { id: '32', name: 'Pão de Queijo', portion: '1 unidade média (30g)', calories: 105, protein: 2 },
  { id: '33', name: 'Tapioca Simples', portion: '1 unidade (50g goma)', calories: 130, protein: 0 },
  { id: '34', name: 'Tapioca com Ovo', portion: '1 unidade', calories: 210, protein: 7 },
  { id: '35', name: 'Queijo Minas Frescal', portion: '1 fatia (30g)', calories: 73, protein: 5 },
  { id: '36', name: 'Queijo Mussarela', portion: '1 fatia (20g)', calories: 60, protein: 5 },
  { id: '37', name: 'Leite Integral', portion: '1 copo (200ml)', calories: 120, protein: 6 },
  { id: '38', name: 'Leite Desnatado', portion: '1 copo (200ml)', calories: 70, protein: 6 },
  { id: '39', name: 'Iogurte Natural', portion: '100g', calories: 63, protein: 3 },
  { id: '40', name: 'Café sem Açúcar', portion: '50ml', calories: 2, protein: 0 },

  // Tubérculos e Vegetais
  { id: '50', name: 'Batata Doce Cozida', portion: '100g', calories: 86, protein: 1 },
  { id: '51', name: 'Batata Inglesa Cozida', portion: '100g', calories: 77, protein: 2 },
  { id: '52', name: 'Mandioca Cozida', portion: '100g', calories: 160, protein: 1 },
  { id: '53', name: 'Inhame Cozido', portion: '100g', calories: 118, protein: 1 },
  { id: '54', name: 'Brócolis Cozido', portion: '100g', calories: 35, protein: 3 },
  { id: '55', name: 'Alface', portion: '3 folhas', calories: 5, protein: 0 },
  { id: '56', name: 'Tomate', portion: '1 unidade média', calories: 22, protein: 1 },
  { id: '57', name: 'Cenoura Crua', portion: '100g', calories: 41, protein: 1 },
  { id: '58', name: 'Abóbora Cozida', portion: '100g', calories: 26, protein: 1 },
  { id: '59', name: 'Espinafre Cozido', portion: '100g', calories: 23, protein: 3 },

  // Frutas
  { id: '70', name: 'Banana Prata', portion: '1 unidade média', calories: 89, protein: 1 },
  { id: '71', name: 'Banana Nanica', portion: '1 unidade média', calories: 92, protein: 1 },
  { id: '72', name: 'Maçã Fuji', portion: '1 unidade média', calories: 72, protein: 0 },
  { id: '73', name: 'Mamão Papaia', portion: '1/2 unidade', calories: 60, protein: 0 },
  { id: '74', name: 'Melancia', portion: '1 fatia média', calories: 30, protein: 0 },
  { id: '75', name: 'Laranja Lima', portion: '1 unidade', calories: 45, protein: 1 },
  { id: '76', name: 'Abacate', portion: '100g', calories: 160, protein: 2 },
  { id: '77', name: 'Manga Palmer', portion: '100g', calories: 60, protein: 0 },
  { id: '78', name: 'Uva (Itália)', portion: '100g', calories: 67, protein: 1 },
  { id: '79', name: 'Abacaxi', portion: '1 fatia média', calories: 50, protein: 0 },

  // Suplementos e Diversos
  { id: '90', name: 'Whey Protein', portion: '1 dose (30g)', calories: 110, protein: 24 },
  { id: '91', name: 'Pasta de Amendoim', portion: '1 colher (15g)', calories: 90, protein: 4 },
  { id: '92', name: 'Aveia em Flocos', portion: '2 colheres (30g)', calories: 110, protein: 4 },
  { id: '93', name: 'Azeite de Oliva', portion: '1 colher de sopa', calories: 119, protein: 0 },
  { id: '94', name: 'Castanha do Pará', portion: '1 unidade', calories: 27, protein: 0 },
  { id: '95', name: 'Mel de Abelha', portion: '1 colher de sopa', calories: 64, protein: 0 },
];

export default function RoutinePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const todayStr = new Date().toISOString().split('T')[0];
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const mealQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'meals'), where('date', '==', todayStr));
  }, [db, user, todayStr]);

  const { data: meals } = useCollection(mealQuery);

  const assessment = useMemo(() => {
    const metrics: HealthMetrics = {
      weight: profile?.weight || 70,
      height: profile?.height || 170,
      age: profile?.age || 25,
      gender: (profile?.gender as any) || 'Masculino'
    };
    return getHealthAssessment(metrics);
  }, [profile]);
  
  const totalCalories = (meals || []).reduce((acc, curr) => acc + (curr.calories || 0), 0);
  const totalProtein = (meals || []).reduce((acc, curr) => acc + (curr.protein || 0), 0);

  const mealSlots = [
    { key: 'café', label: 'Café da Manhã', icon: Coffee },
    { key: 'almoço', label: 'Almoço', icon: Sun },
    { key: 'janta', label: 'Jantar', icon: Moon },
    { key: 'lanches', label: 'Lanches / Outros', icon: Clock },
  ];

  const handleAddFood = (slot: string, food: any) => {
    if (!db || !user) return;
    addDocumentNonBlocking(collection(db, 'users', user.uid, 'meals'), {
      name: food.name,
      portion: food.portion,
      calories: food.calories,
      protein: food.protein,
      slot,
      date: todayStr,
      createdAt: new Date().toISOString()
    });
  };

  const handleRemoveFood = (id: string) => {
    if (!db || !user) return;
    deleteDocumentNonBlocking(doc(db, 'users', user.uid, 'meals', id));
  };

  const filteredFoods = useMemo(() => {
    return BRAZILIAN_FOOD_DB.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-black">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-4 space-y-3">
        <header className="space-y-1 text-center">
          <h1 className="text-4xl font-headline font-bold text-white uppercase italic tracking-tighter">Rotina Alimentar</h1>
          <p className="text-muted-foreground font-medium text-sm">Acompanhe seu balanço nutricional diário.</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-headline text-white italic uppercase flex items-center gap-2">
            <Utensils className="text-primary w-6 h-6" /> Alimentação Do Dia
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mealSlots.map((slot) => {
              const items = (meals || []).filter(m => m.slot === slot.key);
              return (
                <Card key={slot.key} className="bg-card/50 border-white/10 rounded-3xl overflow-hidden shadow-xl min-h-[300px] flex flex-col">
                  <CardHeader className="p-6 bg-white/5 flex flex-row items-center justify-between space-y-0 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/20 p-3 rounded-xl text-primary"><slot.icon className="w-6 h-6" /></div>
                      <CardTitle className="text-xl font-bold text-white uppercase italic">{slot.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      {items.length > 0 ? items.map((food) => (
                        <div key={food.id} className="flex items-center justify-between text-xs bg-white/5 p-4 rounded-xl border border-white/5">
                          <div className="flex flex-col">
                            <span className="text-zinc-200 font-bold uppercase tracking-tight">{food.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{food.portion}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="block text-primary font-black italic">{food.calories}kcal</span>
                              <span className="block text-[10px] text-accent font-bold uppercase">{food.protein}g P</span>
                            </div>
                            <button onClick={() => handleRemoveFood(food.id)} className="text-zinc-500 hover:text-red-500 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )) : (
                        <div className="h-24 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                          <p className="text-[10px] font-bold uppercase italic text-muted-foreground">Nenhum registro para esta refeição.</p>
                        </div>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full h-14 bg-secondary hover:bg-white/10 text-white border-white/10 border text-xs font-black uppercase italic rounded-2xl" 
                          onClick={() => {
                            setActiveSlot(slot.key);
                            setSearchTerm('');
                          }}
                        >
                          Adicionar Alimento
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-md rounded-3xl p-0 overflow-hidden">
                        <DialogHeader className="p-6 pb-2">
                          <DialogTitle className="font-headline italic text-primary uppercase text-2xl">Cardápio ForgeFIT</DialogTitle>
                          <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              placeholder="Buscar alimento..." 
                              className="bg-white/5 border-white/10 pl-10 rounded-xl h-12"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] px-6 pb-6">
                          <div className="grid gap-2">
                            {filteredFoods.length > 0 ? filteredFoods.map((food) => (
                              <button 
                                key={food.id} 
                                onClick={() => activeSlot && handleAddFood(activeSlot, food)} 
                                className="flex items-center justify-between p-4 bg-white/5 hover:bg-primary/20 rounded-2xl transition-all text-left border border-white/5"
                              >
                                <div className="space-y-1">
                                  <p className="font-bold text-sm text-white uppercase italic">{food.name}</p>
                                  <p className="text-[10px] text-muted-foreground italic">{food.portion}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black text-primary italic">{food.calories} KCAL</p>
                                  <p className="text-[10px] text-accent font-black uppercase">{food.protein}g PROT</p>
                                </div>
                              </button>
                            )) : (
                              <p className="text-center py-10 text-muted-foreground text-xs uppercase font-bold">Nenhum alimento encontrado.</p>
                            )}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-r from-zinc-900 to-black border-primary/20 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-3xl font-headline text-white italic uppercase tracking-widest">Meta Nutricional Determinada</h3>
                <div className="space-y-1">
                   <p className="text-[10px] text-muted-foreground font-bold uppercase italic">Cálculos Baseados na OMS:</p>
                   <div className="flex flex-col gap-1">
                     <p className="text-sm text-primary font-black uppercase italic">Meta Calórica: {assessment.get} kcal</p>
                     <p className="text-sm text-accent font-black uppercase italic">Meta Proteica (1.8-2.2g/kg): {assessment.proteinRange.min} - {assessment.proteinRange.max}g</p>
                   </div>
                </div>
              </div>
              <div className="flex gap-12">
                <div className="text-center space-y-1">
                  <p className="text-4xl font-black text-primary italic leading-none">{totalCalories}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Kcal Consumidas</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-4xl font-black text-accent italic leading-none">{totalProtein}g</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Proteína Consumida</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <p className="text-[9px] font-bold uppercase italic text-center opacity-40">
          Lembrando, essas metas são baseadas em calculo de peso, altura e genero. Seguindo os parametros basicos da OMS, podendo variar de acordo com dietas reguladas
        </p>
      </main>
    </div>
  );
}

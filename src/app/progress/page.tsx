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
import { Plus, LineChart as ChartIcon, Scale, Dumbbell, Move, TrendingUp } from 'lucide-react';
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
  const [selectedEx, setSelectedEx] = useState('Bench Press');

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
    <div className="min-h-screen pb-24 md:pt-20">
      <Navigation />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-1">
          <h1 className="text-4xl font-headline font-bold">Performance & Evolution</h1>
          <p className="text-muted-foreground">Visualize your progress and crush your plateaus.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weight Tracking */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <Scale className="w-6 h-6 text-primary" /> Body Weight
                </CardTitle>
                <CardDescription>Monitor your body mass changes over time</CardDescription>
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
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-secondary/20 rounded-xl">
                    <p className="text-muted-foreground">Add your first measurement below</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Weight (kg)" 
                  value={weightInput} 
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="rounded-xl h-11"
                />
                <Button onClick={handleAddWeight} className="h-11 px-6 shadow-md">Add</Button>
              </div>
            </CardContent>
          </Card>

          {/* Strength Progression */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-accent" /> Max Loads
                </CardTitle>
                <CardDescription>Track PRs and strength milestones</CardDescription>
              </div>
              <Select value={selectedEx} onValueChange={setSelectedEx}>
                <SelectTrigger className="w-[180px] rounded-full bg-secondary/50 border-none">
                  <SelectValue placeholder="Exercise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bench Press">Bench Press</SelectItem>
                  <SelectItem value="Squat">Squat</SelectItem>
                  <SelectItem value="Deadlift">Deadlift</SelectItem>
                  <SelectItem value="Overhead Press">Overhead Press</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[250px] w-full">
                {(metrics.maxLoad[selectedEx] || []).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.maxLoad[selectedEx]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                      <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                      />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-secondary/20 rounded-xl">
                    <p className="text-muted-foreground">Log your max load for {selectedEx}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Load (kg)" 
                  value={loadInput} 
                  onChange={(e) => setLoadInput(e.target.value)}
                  className="rounded-xl h-11"
                />
                <Button onClick={handleAddLoad} className="h-11 px-6 shadow-md bg-accent hover:bg-accent/90">Log PR</Button>
              </div>
            </CardContent>
          </Card>

          {/* Cardio / Distance */}
          <Card className="border-none shadow-sm bg-white overflow-hidden md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <Move className="w-6 h-6 text-primary" /> Distance Accumulated
                </CardTitle>
                <CardDescription>Track total weekly or session running/cycling distances</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[300px] w-full">
                {metrics.distance.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.distance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                      />
                      <Line type="stepAfter" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-secondary/20 rounded-xl">
                    <p className="text-muted-foreground">Log your first distance entry</p>
                  </div>
                )}
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>New Distance Record</Label>
                  <Input 
                    type="number" 
                    placeholder="Distance (km)" 
                    value={distInput} 
                    onChange={(e) => setDistInput(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <Button onClick={handleAddDist} className="h-11 px-8 shadow-md">Add Distance</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Performance Analysis Section */}
        <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground border-none shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">AI Growth Analysis</CardTitle>
            <CardDescription className="text-primary-foreground/80">Our AI identifies your training trends and plateau risks automatically.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <ChartIcon className="w-5 h-5" /> Recent Insights
              </h4>
              <ul className="space-y-3 text-sm opacity-90">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                  <span>Your strength in <strong className="underline decoration-white/50">Bench Press</strong> has increased by 5% in the last 2 weeks. Great job!</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                  <span>Your body weight is stabilizing. Consider increasing protein intake if hypertrophy is the goal.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                  <span>No plateaus detected in your current logging frequency. Keep it up!</span>
                </li>
              </ul>
            </div>
            <Button variant="secondary" className="w-full font-bold h-12">Generate Deep Performance Review</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

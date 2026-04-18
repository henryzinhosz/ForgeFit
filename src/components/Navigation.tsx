"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Database, LineChart, Apple, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/planner', icon: Calendar, label: 'Planejador' },
  { href: '/database', icon: Database, label: 'Exercícios' },
  { href: '/progress', icon: LineChart, label: 'Evolução' },
  { href: '/routine', icon: Apple, label: 'Rotina' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border px-4 py-2 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between md:justify-center md:gap-12">
        <div className="hidden md:flex items-center gap-2 mr-auto">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold font-headline">F</span>
          </div>
          <span className="font-headline font-bold text-xl text-primary">ForgeFit</span>
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all rounded-xl",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-white/5"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
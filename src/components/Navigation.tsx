
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Database, LineChart, Apple, Home, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useUser, signInWithGoogle, logout } from '@/firebase';
import { Button } from './ui/button';

const navItems = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/planner', icon: Calendar, label: 'Agenda' },
  { href: '/database', icon: Database, label: 'Exercícios' },
  { href: '/progress', icon: LineChart, label: 'Evolução' },
  { href: '/routine', icon: Apple, label: 'Rotina' },
];

export function Navigation() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-white/5 px-2 py-3 z-50 safe-area-bottom md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-around md:justify-between">
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold font-headline">F</span>
          </div>
          <span className="font-headline font-bold text-xl text-primary">ForgeFit</span>
        </div>
        
        <div className="flex items-center justify-around flex-1 md:flex-initial md:gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 transition-all duration-300 rounded-2xl min-w-[64px]",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-orange-400 hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-6 h-6 transition-transform", isActive && "scale-110")} />
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-tighter",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white/60 truncate max-w-[100px]">{user.displayName}</span>
              <Button variant="ghost" size="icon" onClick={() => logout(auth)} className="text-muted-foreground hover:text-primary">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button onClick={() => signInWithGoogle(auth)} className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6 rounded-full">
              <LogIn className="w-4 h-4 mr-2" /> Entrar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

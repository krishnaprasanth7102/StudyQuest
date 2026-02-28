"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timer, Play, Pause, RotateCcw, Coffee, BookOpen, Music } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toast({
        title: mode === 'study' ? "Session Finished!" : "Break Over!",
        description: mode === 'study' ? "Great job! Take a short break." : "Ready to dive back in?",
      });
      toggleMode();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const toggleMode = () => {
    const newMode = mode === 'study' ? 'break' : 'study';
    setMode(newMode);
    setTimeLeft(newMode === 'study' ? 25 * 60 : 5 * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col justify-center space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
            <Button 
              variant={mode === 'study' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-full px-6 h-10"
              onClick={() => mode !== 'study' && toggleMode()}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Focus Time
            </Button>
            <Button 
              variant={mode === 'break' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-full px-6 h-10"
              onClick={() => mode !== 'break' && toggleMode()}
            >
              <Coffee className="mr-2 h-4 w-4" />
              Short Break
            </Button>
          </div>
          <h1 className="text-2xl font-headline font-semibold text-muted-foreground">
            {mode === 'study' ? 'Deep Work Session' : 'Relaxing Break'}
          </h1>
        </div>

        <div className="relative flex items-center justify-center">
          <div className={`absolute h-[420px] w-[420px] rounded-full blur-[80px] opacity-20 transition-all duration-1000 ${
            isActive ? 'animate-pulse scale-110' : 'scale-100'
          } ${mode === 'study' ? 'bg-primary' : 'bg-success'}`} />
          
          <div className="relative z-10 text-[12rem] md:text-[16rem] font-headline font-bold tracking-tighter tabular-nums drop-shadow-2xl">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-16 w-16 rounded-full border-2 hover:bg-slate-100"
            onClick={resetTimer}
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
          
          <Button 
            className={`h-24 w-24 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${
              isActive ? 'bg-slate-900 text-white' : 'gradient-button'
            }`}
            onClick={toggleTimer}
          >
            {isActive ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
          </Button>

          <Button 
            variant="outline" 
            size="icon" 
            className="h-16 w-16 rounded-full border-2 hover:bg-slate-100"
          >
            <Music className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex justify-center gap-12 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-bold">4</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sessions</p>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800 h-10 mt-2" />
          <div className="space-y-1">
            <p className="text-3xl font-bold">120</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Minutes</p>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800 h-10 mt-2" />
          <div className="space-y-1">
            <p className="text-3xl font-bold">850</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Focus Score</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

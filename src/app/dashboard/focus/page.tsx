"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw, Coffee, BookOpen, Music, Settings2, Plus, Minus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRESETS = [15, 25, 45, 60];

export default function FocusPage() {
  const [studyDuration, setStudyDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const { toast } = useToast();

  const totalSeconds = useMemo(() => 
    (mode === 'study' ? studyDuration : breakDuration) * 60, 
    [mode, studyDuration, breakDuration]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(() => {});
      
      toast({
        title: mode === 'study' ? "Session Finished!" : "Break Over!",
        description: mode === 'study' ? "Great job! Take a short break." : "Ready to dive back in?",
      });
      
      const nextMode = mode === 'study' ? 'break' : 'study';
      setMode(nextMode);
      setTimeLeft((nextMode === 'study' ? studyDuration : breakDuration) * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, studyDuration, breakDuration, toast]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalSeconds);
  };

  const adjustTime = (minutes: number) => {
    const newSeconds = Math.max(60, timeLeft + minutes * 60);
    setTimeLeft(newSeconds);
    if (mode === 'study') {
      setStudyDuration(Math.ceil(newSeconds / 60));
    } else {
      setBreakDuration(Math.ceil(newSeconds / 60));
    }
  };

  const setTimerSettings = (study: number, breakMin: number) => {
    setStudyDuration(study);
    setBreakDuration(breakMin);
    if (!isActive) {
      setTimeLeft((mode === 'study' ? study : breakMin) * 60);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'study' ? 'break' : 'study';
    setMode(newMode);
    setTimeLeft((newMode === 'study' ? studyDuration : breakDuration) * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-full flex flex-col justify-center space-y-8 py-4">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="inline-flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
              <Button 
                variant={mode === 'study' ? 'default' : 'ghost'} 
                size="sm" 
                className="rounded-full px-6 h-10 transition-all"
                onClick={() => mode !== 'study' && toggleMode()}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Focus Time
              </Button>
              <Button 
                variant={mode === 'break' ? 'default' : 'ghost'} 
                size="sm" 
                className="rounded-full px-6 h-10 transition-all"
                onClick={() => mode !== 'break' && toggleMode()}
              >
                <Coffee className="mr-2 h-4 w-4" />
                Short Break
              </Button>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="study" className="text-right">Study (min)</Label>
                    <Input
                      id="study"
                      type="number"
                      value={studyDuration}
                      onChange={(e) => setTimerSettings(parseInt(e.target.value) || 1, breakDuration)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="break" className="text-right">Break (min)</Label>
                    <Input
                      id="break"
                      type="number"
                      value={breakDuration}
                      onChange={(e) => setTimerSettings(studyDuration, parseInt(e.target.value) || 1)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={resetTimer}>Apply & Reset</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <h1 className="text-2xl font-headline font-semibold text-muted-foreground animate-in fade-in slide-in-from-top-2">
            {mode === 'study' ? 'Deep Work Session' : 'Relaxing Break'}
          </h1>
        </div>

        <div className="relative flex items-center justify-center">
          {/* Progress Ring */}
          <svg className="absolute w-[340px] h-[340px] md:w-[460px] md:h-[460px] -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r={typeof window !== 'undefined' && window.innerWidth < 768 ? "160" : "220"}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-slate-200 dark:text-slate-800"
            />
            <circle
              cx="50%"
              cy="50%"
              r={typeof window !== 'undefined' && window.innerWidth < 768 ? "160" : "220"}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={typeof window !== 'undefined' && window.innerWidth < 768 ? "1005" : "1382"}
              strokeDashoffset={(typeof window !== 'undefined' && window.innerWidth < 768 ? 1005 : 1382) * (1 - progress / 100)}
              strokeLinecap="round"
              className={cn(
                "transition-all duration-1000 ease-linear",
                mode === 'study' ? "text-primary" : "text-success"
              )}
            />
          </svg>

          <div className={cn(
            "absolute h-[320px] w-[320px] md:h-[420px] md:w-[420px] rounded-full blur-[80px] opacity-10 transition-all duration-1000",
            isActive ? 'animate-pulse scale-110' : 'scale-100',
            mode === 'study' ? 'bg-primary' : 'bg-success'
          )} />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-[7rem] md:text-[14rem] font-headline font-bold tracking-tighter tabular-nums drop-shadow-2xl leading-none">
              {formatTime(timeLeft)}
            </div>
            
            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={() => adjustTime(-1)} className="rounded-full h-8 w-8 p-0">
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => adjustTime(1)} className="rounded-full h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center justify-center gap-6">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-16 w-16 rounded-full border-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
              onClick={resetTimer}
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
            
            <Button 
              className={cn(
                "h-24 w-24 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95",
                isActive ? 'bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900' : 'gradient-button'
              )}
              onClick={toggleTimer}
            >
              {isActive ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-16 w-16 rounded-full border-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              <Music className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex gap-3">
            {PRESETS.map((p) => (
              <Button
                key={p}
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-full px-4 h-9 font-bold transition-all",
                  (mode === 'study' ? studyDuration : breakDuration) === p && "border-primary text-primary bg-primary/5"
                )}
                onClick={() => {
                  if (mode === 'study') setStudyDuration(p);
                  else setBreakDuration(p);
                  setTimeLeft(p * 60);
                  setIsActive(false);
                }}
              >
                {p}m
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-8 md:gap-12 text-center pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-bold">4</p>
            <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Sessions</p>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800 h-10 mt-2" />
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-bold">120</p>
            <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Minutes</p>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800 h-10 mt-2" />
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-bold">850</p>
            <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Focus Score</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

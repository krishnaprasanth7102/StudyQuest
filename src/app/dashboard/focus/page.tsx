"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw, Coffee, BookOpen, Music, Settings2, Plus, Minus, Flame, Target } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

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
        title: mode === 'study' ? "Deep Work Session Complete!" : "Break Finished!",
        description: mode === 'study' ? "Amazing focus! Time to recharge." : "Ready to start your next quest?",
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
      <div className="max-w-5xl mx-auto space-y-8 py-2 relative">
        <div className={cn(
          "absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 blur-[120px] opacity-20 transition-colors duration-1000 rounded-full",
          mode === 'study' ? 'bg-primary' : 'bg-success'
        )} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-3xl font-headline font-bold">Focus Hub</h1>
            <p className="text-muted-foreground text-sm">Master your time, one session at a time.</p>
          </div>

          <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-full border shadow-sm">
            <Button 
              variant={mode === 'study' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-full px-4 md:px-6 transition-all h-9"
              onClick={() => mode !== 'study' && toggleMode()}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Focus
            </Button>
            <Button 
              variant={mode === 'break' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-full px-4 md:px-6 transition-all h-9"
              onClick={() => mode !== 'break' && toggleMode()}
            >
              <Coffee className="mr-2 h-4 w-4" />
              Break
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-8 py-6">
            <div className="relative flex items-center justify-center group">
              <svg className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] -rotate-90 pointer-events-none drop-shadow-xl">
                <circle
                  cx="50%"
                  cy="50%"
                  r="140"
                  className="md:hidden text-slate-100 dark:text-slate-800"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="180"
                  className="hidden md:block text-slate-100 dark:text-slate-800"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="140"
                  className={cn(
                    "md:hidden transition-all duration-1000 ease-linear",
                    mode === 'study' ? "text-primary" : "text-success"
                  )}
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="880"
                  strokeDashoffset={880 * (1 - progress / 100)}
                  strokeLinecap="round"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="180"
                  className={cn(
                    "hidden md:block transition-all duration-1000 ease-linear",
                    mode === 'study' ? "text-primary" : "text-success"
                  )}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="1130"
                  strokeDashoffset={1130 * (1 - progress / 100)}
                  strokeLinecap="round"
                />
              </svg>

              <div className={cn(
                "absolute inset-0 rounded-full blur-[60px] opacity-10 transition-all duration-1000",
                isActive ? 'scale-110 opacity-20' : 'scale-100',
                mode === 'study' ? 'bg-primary' : 'bg-success'
              )} />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-6xl md:text-8xl font-headline font-bold tracking-tight tabular-nums leading-none drop-shadow-sm select-none">
                  {formatTime(timeLeft)}
                </div>
                
                <div className="flex gap-4 mt-8">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => adjustTime(-1)} 
                    className="rounded-full h-9 w-9 border hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => adjustTime(1)} 
                    className="rounded-full h-9 w-9 border hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full border-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                onClick={resetTimer}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              
              <Button 
                className={cn(
                  "h-20 w-20 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-4 border-white dark:border-slate-900",
                  isActive ? 'bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900' : 'gradient-button'
                )}
                onClick={toggleTimer}
              >
                {isActive ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current ml-1" />}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm">
                    <Settings2 className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl max-w-[90vw] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Timer Settings</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-3">
                      <Label>Focus Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={studyDuration}
                        onChange={(e) => setTimerSettings(parseInt(e.target.value) || 1, breakDuration)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Break Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={breakDuration}
                        onChange={(e) => setTimerSettings(studyDuration, parseInt(e.target.value) || 1)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={resetTimer} className="rounded-xl w-full">Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 md:p-8 rounded-[2rem] border-none shadow-xl space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Target className="h-3 w-3" />
                  Quick Presets
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {PRESETS.map((p) => (
                    <Button
                      key={p}
                      variant="outline"
                      className={cn(
                        "rounded-2xl h-12 font-bold transition-all border-2",
                        (mode === 'study' ? studyDuration : breakDuration) === p 
                          ? "border-primary text-primary bg-primary/5" 
                          : "hover:border-primary/40"
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

              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Flame className="h-3 w-3" />
                  Daily Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold">120 <span className="text-xs font-medium text-muted-foreground">min</span></span>
                    <span className="text-xs text-success font-bold">+15% vs avg</span>
                  </div>
                  <Progress value={75} className="h-1.5 rounded-full" />
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                    <span>Goal: 160m</span>
                    <span>4 / 6 Sessions</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                      <Music className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold">Zen Soundtrack</p>
                      <p className="text-[9px] text-muted-foreground">Rainy Cafe</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold">Change</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl border shadow-sm">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Focus Score</p>
                <p className="text-2xl font-bold">850</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl border shadow-sm">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Streak</p>
                <p className="text-2xl font-bold">12 <span className="text-xs">days</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

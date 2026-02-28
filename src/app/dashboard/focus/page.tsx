"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  BookOpen, 
  Settings2, 
  Plus, 
  Minus, 
  Flame, 
  Target, 
  Trophy,
  BellRing
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      
      // Attempt to play a sound
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play().catch(() => {});
      } catch (e) {
        console.warn("Audio playback failed", e);
      }
      
      toast({
        title: mode === 'study' ? "Session Complete! 🎉" : "Break Over! ☕",
        description: mode === 'study' ? "Great job focusing. Time for a well-deserved break." : "Time to get back to your study quest.",
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

  const handleModeChange = (newMode: 'study' | 'break') => {
    if (newMode === mode) return;
    setMode(newMode);
    setTimeLeft((newMode === 'study' ? studyDuration : breakDuration) * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressValue = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-headline font-bold">Focus Hub</h1>
            <p className="text-muted-foreground mt-1 text-sm">Classic Pomodoro technique for deep work.</p>
          </div>
          
          <Tabs value={mode} onValueChange={(v) => handleModeChange(v as 'study' | 'break')} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <TabsTrigger value="study" className="rounded-lg gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 shadow-sm">
                <BookOpen className="h-4 w-4" />
                Focus
              </TabsTrigger>
              <TabsTrigger value="break" className="rounded-lg gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 shadow-sm">
                <Coffee className="h-4 w-4" />
                Break
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Classic Timer */}
          <Card className="lg:col-span-8 border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-20">
              {/* Simple Linear Progress */}
              <div className="w-full max-w-md mb-12 space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>{mode === 'study' ? 'Focus Session' : 'Short Break'}</span>
                  <span>{Math.round(progressValue)}%</span>
                </div>
                <Progress value={progressValue} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
              </div>

              {/* Digital Time Readout */}
              <div className="text-center mb-10">
                <div className="text-8xl md:text-9xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-white">
                  {formatTime(timeLeft)}
                </div>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => adjustTime(-1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Adjust Seconds</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => adjustTime(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Classic Controls */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14 rounded-2xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                  onClick={resetTimer}
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
                
                <Button 
                  size="lg"
                  className={cn(
                    "h-16 px-12 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-95",
                    isActive 
                      ? "bg-slate-900 text-white hover:opacity-90 dark:bg-slate-50 dark:text-slate-900" 
                      : "gradient-button"
                  )}
                  onClick={toggleTimer}
                >
                  {isActive ? (
                    <><Pause className="mr-2 h-5 w-5 fill-current" /> Pause</>
                  ) : (
                    <><Play className="mr-2 h-5 w-5 fill-current" /> Start</>
                  )}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                      <Settings2 className="h-6 w-6" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[2rem] sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-headline font-bold">Timer Configuration</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          Focus Duration (min)
                        </Label>
                        <Input
                          type="number"
                          value={studyDuration}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setStudyDuration(val);
                            if (!isActive && mode === 'study') setTimeLeft(val * 60);
                          }}
                          className="h-12 rounded-xl text-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Coffee className="h-4 w-4 text-secondary" />
                          Break Duration (min)
                        </Label>
                        <Input
                          type="number"
                          value={breakDuration}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setBreakDuration(val);
                            if (!isActive && mode === 'break') setTimeLeft(val * 60);
                          }}
                          className="h-12 rounded-xl text-lg"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={resetTimer} className="w-full h-12 rounded-xl font-bold gradient-button">Apply Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Presets & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl bg-white dark:bg-slate-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Quick Set
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => (
                  <Button
                    key={p}
                    variant="ghost"
                    className={cn(
                      "rounded-xl h-12 font-bold text-sm border transition-all",
                      (mode === 'study' ? studyDuration : breakDuration) === p 
                        ? "border-primary text-primary bg-primary/5" 
                        : "border-slate-100 dark:border-slate-800 hover:border-primary/50"
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
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-white dark:bg-slate-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Today's Quest
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-2xl font-bold">120<span className="text-xs text-muted-foreground ml-1">min</span></p>
                    <p className="text-[10px] text-success font-bold flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      Daily streak: 5 days
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-orange-50 dark:bg-orange-950/30 rounded-full flex items-center justify-center">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                </div>
                <Progress value={75} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                <p className="text-xs text-muted-foreground text-center">75% of daily goal reached</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center">
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Status</p>
                  <p className="text-sm font-bold">{isActive ? 'Focus Mode Active' : 'Waiting to Start'}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

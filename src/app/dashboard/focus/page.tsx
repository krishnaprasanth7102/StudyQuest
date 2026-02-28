"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw, Coffee, BookOpen, Music, Settings2, Plus, Minus, Flame, Target, Trophy } from "lucide-react";
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
      
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(() => {});
      
      toast({
        title: mode === 'study' ? "Session Complete" : "Break Over",
        description: mode === 'study' ? "You've completed your focus session." : "Time to get back to work.",
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

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Focus Timer</h1>
            <p className="text-muted-foreground">Classic pomodoro technique for maximum productivity.</p>
          </div>
          
          <Tabs value={mode} onValueChange={(v) => handleModeChange(v as 'study' | 'break')} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted rounded-xl">
              <TabsTrigger value="study" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <BookOpen className="mr-2 h-4 w-4" />
                Focus
              </TabsTrigger>
              <TabsTrigger value="break" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <Coffee className="mr-2 h-4 w-4" />
                Break
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Timer Display */}
          <Card className="lg:col-span-8 flex flex-col items-center justify-center py-16 px-4 border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2.5rem]">
            <div className="relative flex items-center justify-center mb-12">
              {/* Minimalist Progress Circle */}
              <svg className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="150"
                  className="md:hidden text-muted/20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="190"
                  className="hidden md:block text-muted/20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="150"
                  className={cn(
                    "md:hidden transition-all duration-300 ease-linear",
                    mode === 'study' ? "text-primary" : "text-success"
                  )}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="942"
                  strokeDashoffset={942 * (1 - progress / 100)}
                  strokeLinecap="round"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="190"
                  className={cn(
                    "hidden md:block transition-all duration-300 ease-linear",
                    mode === 'study' ? "text-primary" : "text-success"
                  )}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="1194"
                  strokeDashoffset={1194 * (1 - progress / 100)}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="relative z-10 text-center">
                <div className="text-7xl md:text-9xl font-bold tracking-tighter tabular-nums text-slate-900 dark:text-white mb-2">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {mode === 'study' ? 'Deep Work Session' : 'Recharge Break'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-full border-2 hover:bg-accent transition-all active:scale-95"
                onClick={resetTimer}
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              
              <Button 
                size="lg"
                className={cn(
                  "h-20 w-48 rounded-full text-xl font-bold shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95",
                  isActive 
                    ? 'bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 hover:opacity-90' 
                    : 'bg-primary text-white hover:bg-primary/90'
                )}
                onClick={toggleTimer}
              >
                {isActive ? (
                  <><Pause className="mr-3 h-7 w-7 fill-current" /> Pause</>
                ) : (
                  <><Play className="mr-3 h-7 w-7 fill-current" /> Start</>
                )}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-2 hover:bg-accent transition-all active:scale-95">
                    <Settings2 className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Focus Preferences</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Focus Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={studyDuration}
                        onChange={(e) => setTimerSettings(parseInt(e.target.value) || 1, breakDuration)}
                        className="h-12 rounded-xl text-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Break Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={breakDuration}
                        onChange={(e) => setTimerSettings(studyDuration, parseInt(e.target.value) || 1)}
                        className="h-12 rounded-xl text-lg"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={resetTimer} className="w-full h-12 rounded-xl font-bold">Apply & Reset</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>

          {/* Sidebar Stats & Presets */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Quick Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3">
                  {PRESETS.map((p) => (
                    <Button
                      key={p}
                      variant="outline"
                      className={cn(
                        "rounded-2xl h-14 font-bold text-lg border-2 transition-all",
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
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  Daily Quest Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-3xl font-bold">120 <span className="text-sm font-medium text-muted-foreground">min</span></p>
                    <p className="text-xs text-success font-bold flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      +15% from yesterday
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Goal: 160m</p>
                    <p className="text-xs text-muted-foreground">4 of 6 sessions</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2 rounded-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center">
                    <Music className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">Ambience</p>
                    <p className="font-bold">Lo-fi Study Beats</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto text-xs font-bold hover:bg-white/10">Change</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

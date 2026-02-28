"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BrainCircuit, Calendar, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';

const studyData = [
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 5.8 },
  { day: 'Thu', hours: 2.1 },
  { day: 'Fri', hours: 6.4 },
  { day: 'Sat', hours: 4.0 },
  { day: 'Sun', hours: 1.5 },
];

const readinessData = [
  { date: 'Oct 1', score: 65 },
  { date: 'Oct 5', score: 68 },
  { date: 'Oct 10', score: 72 },
  { date: 'Oct 15', score: 75 },
  { date: 'Oct 20', score: 82 },
  { date: 'Oct 25', score: 88 },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-2">Welcome back, John! 👋</h1>
          <p className="text-muted-foreground">You have 3 exams approaching. Ready for today's study quest?</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock className="h-12 w-12 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="font-medium">Study Hours (Week)</CardDescription>
              <CardTitle className="text-3xl font-headline font-bold">27.5h</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-semibold text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last week
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="h-12 w-12 text-secondary" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="font-medium">Readiness Score</CardDescription>
              <CardTitle className="text-3xl font-headline font-bold">88%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-semibold text-primary flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Excellent progress
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BookOpen className="h-12 w-12 text-orange-500" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="font-medium">Quizzes Completed</CardDescription>
              <CardTitle className="text-3xl font-headline font-bold">14</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-semibold text-slate-500">2 pending for tomorrow</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar className="h-12 w-12 text-indigo-500" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="font-medium">Upcoming Exams</CardDescription>
              <CardTitle className="text-3xl font-headline font-bold">3</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-semibold text-error">Next in 4 days (Calculus)</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-bold">Study Activity</CardTitle>
              <CardDescription>Daily hours spent in deep work mode</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-bold">Exam Readiness Trend</CardTitle>
              <CardDescription>Progression based on quiz accuracy and study sessions</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={readinessData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

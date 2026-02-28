"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { BookOpen, AlertCircle, CheckCircle2, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const initialSubjects = [
  { name: "Calculus III", attended: 22, total: 25, color: "bg-blue-500" },
  { name: "Algorithms", attended: 18, total: 20, color: "bg-purple-500" },
  { name: "Data Structures", attended: 15, total: 24, color: "bg-orange-500" },
  { name: "Database Systems", attended: 28, total: 30, color: "bg-green-500" },
];

export default function AttendancePage() {
  const [target, setTarget] = useState([75]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold mb-2">Attendance Tracker</h1>
            <p className="text-muted-foreground">Keep track of your classes and calculate your safety margin.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm flex items-center gap-6">
            <div className="relative h-20 w-20">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle className="text-slate-100 dark:text-slate-800 stroke-current" strokeWidth="12" fill="transparent" r="40" cx="50" cy="50" />
                <circle 
                  className="text-primary stroke-current" 
                  strokeWidth="12" 
                  strokeLinecap="round" 
                  fill="transparent" 
                  r="40" cx="50" cy="50" 
                  strokeDasharray={`${83 * 2.51} 251.2`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold">83%</div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Overall</p>
              <p className="text-lg font-bold">Safety Status: High</p>
            </div>
          </div>
        </div>

        <Card className="rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-8 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-md">
                <CardTitle className="text-xl font-headline font-bold">Bunk Safety Calculator</CardTitle>
                <p className="text-sm text-muted-foreground">Adjust your target attendance to see how many classes you can safely skip.</p>
              </div>
              <div className="flex-1 max-w-sm space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span>Target Attendance</span>
                  <span className="text-primary">{target}%</span>
                </div>
                <Slider 
                  defaultValue={[75]} 
                  max={100} 
                  step={1} 
                  onValueChange={setTarget}
                  className="py-2"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {initialSubjects.map((sub, i) => {
            const percentage = Math.round((sub.attended / sub.total) * 100);
            const canBunk = Math.floor((sub.attended - (target[0] / 100) * sub.total) / (target[0] / 100));
            
            return (
              <Card key={i} className="rounded-2xl border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${sub.color} text-white`}>
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-lg truncate">{sub.name}</h3>
                    <p className="text-sm text-muted-foreground">Classroom 402B</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{percentage}%</span>
                      <span className="text-muted-foreground">{sub.attended}/{sub.total} Classes</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${percentage >= target[0] ? 'bg-success' : 'bg-error'} transition-all duration-500`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    percentage >= target[0] ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}>
                    {percentage >= target[0] ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <p className="text-xs font-bold uppercase tracking-wider">
                      {percentage >= target[0] 
                        ? `You can skip ${Math.max(0, canBunk)} more` 
                        : `Attend ${Math.abs(Math.ceil((target[0]/100 * sub.total - sub.attended) / (1 - target[0]/100)))} more`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

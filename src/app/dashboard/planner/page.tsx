"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin } from "lucide-react";
import { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

const schedule = [
  { day: "Mon", start: 9, end: 11, subject: "Calculus III", color: "bg-blue-500" },
  { day: "Mon", start: 14, end: 15, subject: "Algorithms", color: "bg-purple-500" },
  { day: "Tue", start: 10, end: 12, subject: "Data Structures", color: "bg-orange-500" },
  { day: "Wed", start: 9, end: 11, subject: "Calculus III", color: "bg-blue-500" },
  { day: "Thu", start: 13, end: 15, subject: "Database Systems", color: "bg-green-500" },
  { day: "Fri", start: 10, end: 12, subject: "Algorithms", color: "bg-purple-500" },
];

export default function PlannerPage() {
  const [viewDate, setViewDate] = useState(new Date());

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-headline font-bold mb-2">Study Planner</h1>
            <p className="text-muted-foreground">Weekly study quest schedule</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border shadow-sm">
            <Button variant="ghost" size="icon" className="rounded-xl"><ChevronLeft className="h-5 w-5" /></Button>
            <div className="flex items-center gap-2 px-4">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-bold">Oct 23 - Oct 29, 2024</span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl"><ChevronRight className="h-5 w-5" /></Button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
            <Button className="gradient-button rounded-xl h-10 px-6">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        <Card className="rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b">
                <div className="h-16 flex items-center justify-center border-r bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-xs font-bold text-muted-foreground">GMT+2</span>
                </div>
                {days.map(day => (
                  <div key={day} className="h-16 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{day}</span>
                    <span className="text-lg font-bold">23</span>
                  </div>
                ))}
              </div>
              
              <div className="relative grid grid-cols-[80px_repeat(7,1fr)]">
                {/* Time labels column */}
                <div className="flex flex-col bg-slate-50 dark:bg-slate-800/50 border-r">
                  {hours.map(hour => (
                    <div key={hour} className="h-20 flex items-start justify-center pt-2 text-xs font-medium text-slate-400">
                      {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                    </div>
                  ))}
                </div>

                {/* Day columns with grid lines */}
                {days.map(day => (
                  <div key={day} className="relative border-r last:border-r-0">
                    {hours.map(hour => (
                      <div key={hour} className="h-20 border-b last:border-b-0 border-slate-50 dark:border-slate-800" />
                    ))}
                    
                    {/* Events for this day */}
                    {schedule.filter(s => s.day === day).map((item, idx) => {
                      const top = (item.start - 8) * 80;
                      const height = (item.end - item.start) * 80;
                      return (
                        <div 
                          key={idx}
                          className={`absolute left-1 right-1 rounded-xl p-3 text-white shadow-md z-10 hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden ${item.color}`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <p className="text-xs font-bold leading-tight line-clamp-2">{item.subject}</p>
                          <div className="flex items-center mt-2 opacity-80 gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-[10px] font-medium">{item.start}:00 - {item.end}:00</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

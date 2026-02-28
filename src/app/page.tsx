import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { GraduationCap, BrainCircuit, Calendar, Clock, BarChart3, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <Link className="flex items-center justify-center space-x-2" href="/">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight text-primary">StudyQuest</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/auth/login">
            Login
          </Link>
          <Button asChild className="gradient-button h-9 px-4 rounded-full">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your Personalized <span className="text-primary">AI Study Quest</span> Begins Here
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Turn your syllabus into interactive quizzes, plan your week with AI, and master any subject with science-backed study techniques.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="gradient-button rounded-full px-8 shadow-lg shadow-primary/25">
                  <Link href="/auth/signup">Start Free Quest</Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24 md:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                  <BrainCircuit className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-headline font-bold">AI Quiz Generation</h3>
                <p className="text-muted-foreground">Upload your notes or syllabus and let our AI create custom quizzes to test your mastery instantly.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                  <Calendar className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-headline font-bold">Smart Planner</h3>
                <p className="text-muted-foreground">Automatic weekly schedules designed around your exam dates and difficulty levels of each subject.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                  <Clock className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-headline font-bold">Focus Mode</h3>
                <p className="text-muted-foreground">Deep work sessions with built-in timers, ambient sounds, and distraction blocking to keep you in the zone.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 StudyQuest Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

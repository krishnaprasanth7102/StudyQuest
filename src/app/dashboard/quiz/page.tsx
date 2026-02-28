"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BrainCircuit, CheckCircle2, XCircle, RefreshCcw, BookOpen } from "lucide-react";
import { useState } from "react";
import { generateQuizFromStudyMaterial, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-from-study-material";
import { receiveAIQuizExplanations } from "@/ai/flows/receive-ai-quiz-explanations";
import { useToast } from "@/hooks/use-toast";

// Mock initial data if no material is uploaded
const mockQuiz: GenerateQuizOutput = {
  quizTitle: "Basic Computer Science Concepts",
  questions: [
    {
      questionText: "Which of the following is an example of an operating system?",
      options: ["Google Chrome", "Linux", "Microsoft Word", "Photoshop"],
      correctAnswer: "Linux",
      explanation: "Linux is a family of open-source Unix-like operating systems based on the Linux kernel."
    },
    {
      questionText: "What does CPU stand for?",
      options: ["Computer Processing Unit", "Central Peripheral Unit", "Central Processing Unit", "Control Process Unit"],
      correctAnswer: "Central Processing Unit",
      explanation: "The CPU is the primary component of a computer that acts as its 'brain', performing calculations and instructions."
    },
    {
      questionText: "What is the primary function of RAM?",
      options: ["Long-term storage", "Temporary storage for running apps", "Graphic rendering", "Network connectivity"],
      correctAnswer: "Temporary storage for running apps",
      explanation: "Random Access Memory (RAM) is a computer's short-term memory, where data that the processor is currently using is stored."
    }
  ]
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(mockQuiz);
  const { toast } = useToast();

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const isCorrect = option === quiz?.questions[currentQuestion].correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, option]);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  if (showResult) {
    const percentage = Math.round((score / quiz!.questions.length) * 100);
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-4">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-headline font-bold">Quest Complete!</h1>
            <p className="text-xl text-muted-foreground">You scored {score} out of {quiz!.questions.length}</p>
          </div>

          <Card className="rounded-[2.5rem] p-12 text-center border-none shadow-xl bg-white dark:bg-slate-900">
            <div className="space-y-6">
              <div className="relative h-48 w-48 mx-auto">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle className="text-slate-100 dark:text-slate-800 stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                  <circle 
                    className="text-primary stroke-current" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    fill="transparent" 
                    r="40" cx="50" cy="50" 
                    strokeDasharray={`${percentage * 2.51} 251.2`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-headline font-bold">{percentage}%</span>
                  <span className="text-xs text-muted-foreground font-semibold">SUCCESS RATE</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Correct</p>
                  <p className="text-2xl font-bold text-success">{score}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Wrong</p>
                  <p className="text-2xl font-bold text-error">{quiz!.questions.length - score}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="font-headline font-bold text-xl">Review Session</h3>
            {quiz!.questions.map((q, i) => (
              <Card key={i} className="rounded-2xl border-none shadow-sm p-6 space-y-3">
                <div className="flex items-start gap-4">
                  {answers[i] === q.correctAnswer ? (
                    <CheckCircle2 className="h-6 w-6 text-success shrink-0 mt-1" />
                  ) : (
                    <XCircle className="h-6 w-6 text-error shrink-0 mt-1" />
                  )}
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">{q.questionText}</p>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2"><span className="font-bold text-slate-900 dark:text-white">Your answer:</span> {answers[i]}</p>
                      <p className="mb-4"><span className="font-bold text-success">Correct answer:</span> {q.correctAnswer}</p>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <BrainCircuit className="h-4 w-4 text-primary" />
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">AI Explanation</span>
                        </div>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={resetQuiz} variant="outline" className="flex-1 rounded-full h-12">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
            <Button asChild className="flex-1 gradient-button rounded-full h-12">
              <a href="/dashboard">Return to Hub</a>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-headline font-bold">{quiz!.quizTitle}</h1>
            <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {quiz!.questions.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium">Quest in Progress</span>
          </div>
        </div>

        <Progress value={(currentQuestion / quiz!.questions.length) * 100} className="h-2 rounded-full bg-slate-200" />

        <div className="space-y-6">
          <Card className="rounded-[2rem] border-none shadow-sm p-8 bg-white dark:bg-slate-900">
            <h2 className="text-2xl font-headline font-bold mb-8 leading-tight">
              {quiz!.questions[currentQuestion].questionText}
            </h2>
            <div className="grid gap-4">
              {quiz!.questions[currentQuestion].options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={cn(
                    "w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between",
                    selectedOption === option 
                      ? option === quiz!.questions[currentQuestion].correctAnswer
                        ? "border-success bg-success/5 text-success"
                        : "border-error bg-error/5 text-error"
                      : selectedOption !== null && option === quiz!.questions[currentQuestion].correctAnswer
                        ? "border-success bg-success/5 text-success"
                        : "border-slate-100 dark:border-slate-800 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold text-sm",
                      selectedOption === option ? "border-transparent bg-white/20" : "border-slate-200 dark:border-slate-700"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-medium text-lg">{option}</span>
                  </div>
                  {selectedOption === option && (
                    option === quiz!.questions[currentQuestion].correctAnswer 
                      ? <CheckCircle2 className="h-6 w-6" />
                      : <XCircle className="h-6 w-6" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={nextQuestion} 
              disabled={selectedOption === null}
              className="gradient-button rounded-full px-8 h-12 text-lg shadow-lg shadow-primary/20"
            >
              {currentQuestion === quiz!.questions.length - 1 ? "Finish Quiz" : "Next Question"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

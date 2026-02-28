"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, X, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string, status: 'ready' | 'processing' | 'done'}[]>([]);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    const newFiles = files.map(f => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + " MB",
      status: 'ready' as const
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const startAnalysis = () => {
    setIsUploading(true);
    setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));
    
    // Simulate processing
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'done' })));
      toast({
        title: "Analysis Complete",
        description: "Your study material has been parsed. You can now generate quizzes.",
      });
    }, 3000);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-headline font-bold">Upload Study Material</h1>
          <p className="text-muted-foreground">Upload your PDF notes or syllabus to let StudyQuest AI generate your quest.</p>
        </div>

        <Card 
          className={`border-2 border-dashed transition-all duration-300 rounded-[2rem] bg-white dark:bg-slate-900 ${
            isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-slate-200 dark:border-slate-800'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Upload className="h-10 w-10" />
            </div>
            <div className="text-center">
              <p className="text-xl font-headline font-semibold">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse from your device</p>
              <p className="text-xs text-muted-foreground mt-4">Support PDF, DOCX, TXT up to 20MB</p>
            </div>
            <Input 
              type="file" 
              multiple 
              className="hidden" 
              id="file-upload" 
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
            />
            <Button asChild variant="outline" className="rounded-full px-8 h-12 border-slate-200 hover:border-primary hover:text-primary">
              <label htmlFor="file-upload" className="cursor-pointer">Select Files</label>
            </Button>
          </CardContent>
        </Card>

        {uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg">Files to Process ({uploadedFiles.length})</h3>
              <Button 
                onClick={startAnalysis} 
                className="gradient-button rounded-full px-6"
                disabled={isUploading}
              >
                {isUploading ? "Analysing..." : "Start AI Analysis"}
              </Button>
            </div>
            <div className="grid gap-3">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {file.status === 'processing' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                    {file.status === 'done' && <CheckCircle className="h-5 w-5 text-success" />}
                    <Button variant="ghost" size="icon" onClick={() => removeFile(i)} className="rounded-full hover:bg-slate-100 h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

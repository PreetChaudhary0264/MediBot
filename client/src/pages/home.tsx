import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, MessageSquare, Sparkles, Clock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Report } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const { data: recentReports } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Upload successful",
        description: "Analyzing your medical report...",
      });
      setLocation(`/report/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      setUploading(false);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload a file smaller than 10MB",
            variant: "destructive",
          });
          return;
        }
        setUploading(true);
        uploadMutation.mutate(file);
      }
    },
    [uploadMutation, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">MediClarify</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {!recentReports || recentReports.length === 0 ? (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                Understand Your Medical Reports
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your medical reports and get simplified explanations powered by AI.
                Ask questions and understand your health information in simple terms.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Upload Medical Report</CardTitle>
                <CardDescription>
                  Supports PDF files and images (PNG, JPG). Maximum file size: 10MB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`
                    min-h-64 border-2 border-dashed rounded-lg p-8
                    flex flex-col items-center justify-center gap-4
                    transition-colors cursor-pointer
                    ${isDragActive ? "border-primary bg-primary/5" : "border-border hover-elevate"}
                    ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  data-testid="dropzone-upload"
                >
                  <input {...getInputProps()} data-testid="input-file" />
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    {uploading ? (
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-medium">
                      {uploading
                        ? "Uploading..."
                        : isDragActive
                        ? "Drop your report here"
                        : "Drop your medical report here"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse files
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <div className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                      PDF
                    </div>
                    <div className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                      JPG
                    </div>
                    <div className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                      PNG
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Upload Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload your medical report in PDF or image format. Our AI will extract and analyze the content.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Get Explanation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Receive a simplified explanation of your medical report in easy-to-understand language.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Ask Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Chat with our AI to clarify any part of the explanation or ask follow-up questions.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="max-w-4xl mx-auto border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Important Disclaimer</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      This is an AI-generated explanation for educational purposes only. 
                      It is not a substitute for professional medical advice, diagnosis, or treatment. 
                      Always consult with a qualified healthcare professional for medical decisions.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Your Reports</h2>
                <p className="text-muted-foreground mt-1">
                  View and manage your analyzed medical reports
                </p>
              </div>
              <Button
                onClick={() => document.querySelector<HTMLInputElement>('[data-testid="input-file"]')?.click()}
                size="lg"
                data-testid="button-new-analysis"
              >
                <Upload className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </div>

            <div className="hidden">
              <div {...getRootProps()}>
                <input {...getInputProps()} data-testid="input-file" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReports.map((report) => (
                <Card
                  key={report.id}
                  className="hover-elevate active-elevate-2 cursor-pointer transition-all"
                  onClick={() => setLocation(`/report/${report.id}`)}
                  data-testid={`card-report-${report.id}`}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      {report.explanation && (
                        <div className="px-2 py-1 rounded-md bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium">
                          Analyzed
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base line-clamp-2">
                        {report.filename}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(report.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" data-testid={`button-view-${report.id}`}>
                      View Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Your privacy matters. Reports are analyzed securely and not stored permanently.
          </p>
        </div>
      </footer>
    </div>
  );
}

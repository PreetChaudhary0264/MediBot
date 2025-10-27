import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, FileText, Sparkles, Send, Loader2, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Report, Message } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ReportViewer() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [question, setQuestion] = useState("");
  const [activeTab, setActiveTab] = useState("explanation");

  const { data: report, isLoading: reportLoading, error: reportError } = useQuery<Report>({
    queryKey: ["/api/reports", id],
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data && !data.explanation && !data.analysisError ? 3000 : false;
    },
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages", id],
    enabled: !!id && !!report,
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", `/api/chat/${id}`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", id] });
      setQuestion("");
    },
  });

  const handleSendMessage = () => {
    if (question.trim() && !chatMutation.isPending) {
      chatMutation.mutate(question.trim());
    }
  };

  if (reportLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (reportError || !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <CardTitle>Report Not Found</CardTitle>
                <CardDescription>The requested report could not be loaded</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAnalyzing = !report.explanation;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold truncate">{report.filename}</h1>
              <p className="text-xs text-muted-foreground">
                {new Date(report.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 border-b lg:border-b-0 lg:border-r">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2 mb-6">
                <TabsTrigger value="original" data-testid="tab-original">
                  <FileText className="w-4 h-4 mr-2" />
                  Original Text
                </TabsTrigger>
                <TabsTrigger value="explanation" data-testid="tab-explanation">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Explanation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="original" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Original Report Text</CardTitle>
                    <CardDescription>
                      Extracted text from your medical report
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] w-full rounded-md border p-6">
                      <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                        {report.originalText}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="explanation" className="space-y-4">
                {report.analysisError ? (
                  <Card className="border-l-4 border-l-destructive">
                    <CardContent className="pt-12 pb-12">
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-destructive/10">
                          <AlertCircle className="w-8 h-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium">Analysis Failed</p>
                          <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            {report.analysisError}
                          </p>
                        </div>
                        <Button
                          onClick={() => setLocation("/")}
                          variant="outline"
                          data-testid="button-back-home"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Home
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : isAnalyzing ? (
                  <Card>
                    <CardContent className="pt-12 pb-12">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <div className="space-y-2">
                          <p className="text-lg font-medium">Analyzing Your Report</p>
                          <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Our AI is reading your medical report and preparing a simplified explanation. 
                            This may take a minute...
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Simplified Explanation</CardTitle>
                      <CardDescription>
                        Your medical report explained in simple terms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[600px] w-full rounded-md border p-6">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {report.explanation || ""}
                          </ReactMarkdown>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 text-sm">
                      <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground leading-relaxed">
                        This is an AI-generated explanation for educational purposes only. 
                        Always consult with a qualified healthcare professional for medical advice.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="w-full lg:w-96 flex flex-col bg-card">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Chat About Report</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Ask questions about your medical report
            </p>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4" data-testid="chat-messages">
              {messages.length === 0 && !isAnalyzing && (
                <div className="text-center py-8 space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-muted">
                    <Sparkles className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Start a Conversation</p>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Ask questions about your report to get more clarity on specific terms or findings
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${message.role}-${message.id}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs opacity-70 mt-2">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-3 bg-muted">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a question about your report..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="resize-none min-h-12 max-h-32"
                disabled={isAnalyzing || chatMutation.isPending}
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!question.trim() || isAnalyzing || chatMutation.isPending}
                size="icon"
                className="flex-shrink-0"
                data-testid="button-send-message"
              >
                {chatMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

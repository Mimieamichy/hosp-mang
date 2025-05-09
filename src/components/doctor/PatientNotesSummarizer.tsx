"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { handleSummarizeNotes } from '@/lib/actions'; // Server Action
import { Loader2, Wand2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface PatientNotesSummarizerProps {
  patientNotes: string;
}

export function PatientNotesSummarizer({ patientNotes }: PatientNotesSummarizerProps) {
  const [notesToSummarize, setNotesToSummarize] = useState(patientNotes);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (!notesToSummarize.trim()) {
      setError("Patient notes cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary(null);

    const result = await handleSummarizeNotes({ patientNotes: notesToSummarize });

    setIsLoading(false);
    if (result.success && result.summary) {
      setSummary(result.summary);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wand2 className="mr-2 h-4 w-4" /> Summarize Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Patient Notes Summarizer</DialogTitle>
          <CardDescription>
            Review and summarize patient notes using AI. The original notes are pre-filled.
          </CardDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-h-[70vh]">
            <div className="flex flex-col space-y-2">
                <h3 className="font-semibold">Original Notes:</h3>
                <ScrollArea className="h-[300px] md:h-[400px] w-full rounded-md border p-3 bg-muted/30">
                    <Textarea
                    value={notesToSummarize}
                    onChange={(e) => setNotesToSummarize(e.target.value)}
                    placeholder="Enter patient notes here..."
                    className="h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    />
                </ScrollArea>
            </div>
            <div className="flex flex-col space-y-2">
                <h3 className="font-semibold">AI Summary:</h3>
                <ScrollArea className="h-[300px] md:h-[400px] w-full rounded-md border p-3">
                {isLoading && (
                    <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2">Generating summary...</p>
                    </div>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
                {summary && <pre className="whitespace-pre-wrap text-sm font-sans">{summary}</pre>}
                {!isLoading && !summary && !error && <p className="text-sm text-muted-foreground">Click "Generate Summary" to see the AI-powered summary here.</p>}
                </ScrollArea>
            </div>
        </div>
        <div className="flex justify-end pt-4">
            <Button onClick={handleSubmit} disabled={isLoading || !notesToSummarize.trim()}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Summary
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

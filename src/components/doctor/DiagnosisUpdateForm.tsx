"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface DiagnosisUpdateFormProps {
  currentDiagnosis: string;
  onSubmit: (newDiagnosis: string) => Promise<boolean>; // Returns true on success to close modal
}

export function DiagnosisUpdateForm({ currentDiagnosis, onSubmit }: DiagnosisUpdateFormProps) {
  const [diagnosis, setDiagnosis] = useState(currentDiagnosis);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setError("Diagnosis cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    
    const success = await onSubmit(diagnosis);
    
    setIsLoading(false);
    if (!success) {
      setError("Failed to update diagnosis. Please try again.");
    }
    // If successful, parent component handles dialog close
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div>
        <Label htmlFor="diagnosis" className="mb-1 block text-sm font-medium">
          New Diagnosis or Update
        </Label>
        <Textarea
          id="diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Enter the diagnosis details..."
          rows={5}
          className="w-full resize-none"
          disabled={isLoading}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || !diagnosis.trim()}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isLoading ? 'Saving...' : 'Save Diagnosis'}
        </Button>
      </div>
    </form>
  );
}

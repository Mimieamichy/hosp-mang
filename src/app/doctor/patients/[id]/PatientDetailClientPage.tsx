"use client";

import { useState } from "react";
import type { Patient, Appointment } from "@/lib/types";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, BedDouble, CalendarClock, FileText, Gage, HeartPulse, Info, User, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { PatientNotesSummarizer } from "@/components/doctor/PatientNotesSummarizer";
import { DiagnosisUpdateForm } from "@/components/doctor/DiagnosisUpdateForm";
import { updatePatient as updatePatientAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface PatientDetailClientPageProps {
  patient: Patient;
}

export default function PatientDetailClientPage({ patient: initialPatient }: PatientDetailClientPageProps) {
  const [patient, setPatient] = useState<Patient>(initialPatient);
  const { toast } = useToast();

  const handleDiagnosisUpdate = async (newDiagnosis: string) => {
    const updatedPatient = { ...patient, diagnosis: newDiagnosis };
    const result = await updatePatientAction(updatedPatient);
    if (result) {
      setPatient(result);
      toast({ title: "Success", description: "Diagnosis updated successfully." });
      return true; // Indicate success to close modal
    } else {
      toast({ title: "Error", description: "Failed to update diagnosis.", variant: "destructive" });
      return false;
    }
  };
  
  const handleNotesUpdate = async (newNotes: string) => {
    const updatedPatient = { ...patient, notes: newNotes };
    const result = await updatePatientAction(updatedPatient);
    if (result) {
      setPatient(result);
      toast({ title: "Success", description: "Patient notes updated successfully." });
      return true;
    } else {
      toast({ title: "Error", description: "Failed to update notes.", variant: "destructive" });
      return false;
    }
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Info Card */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader className="flex flex-col items-center text-center">
            <Image
              src={patient.avatarUrl || `https://picsum.photos/seed/${patient.id}/120/120`}
              alt={patient.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-primary/50 shadow-md"
              data-ai-hint="person portrait"
            />
            <CardTitle className="mt-4 text-2xl">{patient.name}</CardTitle>
            <CardDescription>Patient ID: {patient.id}</CardDescription>
            {patient.isFlagged && (
              <Badge variant="destructive" className="mt-2 gap-1">
                <AlertTriangle className="h-3 w-3" /> Flagged for Follow-up
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoItem icon={<User className="h-4 w-4 text-primary" />} label="Date of Birth" value={format(parseISO(patient.dateOfBirth), "PP")} />
            <InfoItem icon={<CalendarClock className="h-4 w-4 text-primary" />} label="Admission Date" value={format(parseISO(patient.admissionDate), "PP")} />
            <InfoItem icon={<BedDouble className="h-4 w-4 text-primary" />} label="Room" value={patient.roomNumber || "N/A"} />
            <InfoItem icon={<Gage className="h-4 w-4 text-primary" />} label="Urgency" value={<Badge variant={patient.urgency === 'High' ? 'destructive' : patient.urgency === 'Medium' ? 'secondary' : 'outline'}>{patient.urgency}</Badge>} />
          </CardContent>
        </Card>

        {/* Diagnosis and Actions Card */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HeartPulse className="h-6 w-6 text-primary" /> Current Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{patient.diagnosis || "No diagnosis recorded."}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">Update Diagnosis</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Diagnosis for {patient.name}</DialogTitle>
                </DialogHeader>
                <DiagnosisUpdateForm currentDiagnosis={patient.diagnosis || ""} onSubmit={handleDiagnosisUpdate} />
              </DialogContent>
            </Dialog>
          </CardContent>
           <CardHeader className="border-t pt-4">
            <CardTitle className="flex items-center gap-2"><FileText className="h-6 w-6 text-primary" /> Patient Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-40 overflow-y-auto rounded-md border bg-muted/30 p-3 text-sm">
              <pre className="whitespace-pre-wrap font-sans">{patient.notes || "No notes available."}</pre>
            </div>
             <div className="mt-4 flex gap-2">
              <PatientNotesSummarizer patientNotes={patient.notes || ""} />
               {/* Basic Edit Notes - Could be a modal form */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Notes</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Edit Notes for {patient.name}</DialogTitle></DialogHeader>
                  <NotesEditForm currentNotes={patient.notes || ""} onSubmit={handleNotesUpdate} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Appointments, History, etc. */}
      <Tabs defaultValue="appointments" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medical_history">Medical History (Mock)</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Appointment History & Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.appointments && patient.appointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.appointments
                      .sort((a,b) => parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime())
                      .map((appt) => (
                      <TableRow key={appt.id}>
                        <TableCell>{format(parseISO(appt.dateTime), "PP p")}</TableCell>
                        <TableCell>{appt.doctorName}</TableCell>
                        <TableCell>{appt.type}</TableCell>
                        <TableCell><Badge variant={appt.status === "Completed" ? "default" : appt.status === "Cancelled" ? "destructive" : "secondary"}>{appt.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No appointments found for this patient.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medical_history">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Medical History Summary</CardTitle>
              <CardDescription>Key past conditions and treatments (mock data).</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Allergies</AccordionTrigger>
                  <AccordionContent>Penicillin (Anaphylaxis), Peanuts (Mild rash)</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Past Surgeries</AccordionTrigger>
                  <AccordionContent>Tonsillectomy (2005), Wisdom Tooth Extraction (2015)</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Chronic Conditions</AccordionTrigger>
                  <AccordionContent>Mild Asthma (Managed with inhaler as needed)</AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center">
      <span className="mr-3 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

// Simple notes edit form
function NotesEditForm({currentNotes, onSubmit}: {currentNotes: string; onSubmit: (notes: string) => Promise<boolean>}) {
  const [notes, setNotes] = useState(currentNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {toast} = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onSubmit(notes);
    setIsSubmitting(false);
    if (success) {
        // Parent dialog should close if onSubmit returns true
    } else {
        toast({title: "Error", description: "Failed to save notes.", variant: "destructive"})
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea 
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full min-h-[200px] p-2 border rounded-md bg-background"
        placeholder="Enter patient notes..."
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Notes"}
        </Button>
      </div>
    </form>
  )
}


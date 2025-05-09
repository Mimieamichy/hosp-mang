"use client";

import { useState } from "react";
import type { Patient } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, UserPlus, Flag, FlagOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PatientAdminForm } from "@/components/admin/PatientAdminForm"; // To be created
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { deletePatient as deletePatientAction, updatePatient as updatePatientAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface PatientAdminClientPageProps {
  initialPatients: Patient[];
}

export default function PatientAdminClientPage({ initialPatients }: PatientAdminClientPageProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const { toast } = useToast();

  const handleAddNewPatient = () => {
    setSelectedPatient(null);
    setIsFormOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeletePatient = async () => {
    if (patientToDelete) {
      const success = await deletePatientAction(patientToDelete.id);
      if (success) {
        setPatients(patients.filter(p => p.id !== patientToDelete.id));
        toast({ title: "Success", description: "Patient deleted successfully." });
      } else {
        toast({ title: "Error", description: "Failed to delete patient.", variant: "destructive" });
      }
      setPatientToDelete(null);
      setIsConfirmDeleteDialogOpen(false);
    }
  };

  const handleFormSubmit = (patientData: Patient) => {
    if (selectedPatient) { // Editing
      setPatients(patients.map(p => p.id === patientData.id ? patientData : p));
      toast({ title: "Success", description: "Patient updated successfully." });
    } else { // Adding
      setPatients([...patients, patientData]);
      toast({ title: "Success", description: "Patient registered successfully." });
    }
    setIsFormOpen(false);
    setSelectedPatient(null);
  };

  const toggleFlag = async (patient: Patient) => {
    const updatedPatient = { ...patient, isFlagged: !patient.isFlagged };
    const result = await updatePatientAction(updatedPatient);
    if (result) {
      setPatients(patients.map(p => p.id === result.id ? result : p));
      toast({ title: "Success", description: `Patient ${result.isFlagged ? 'flagged' : 'unflagged'}.` });
    } else {
      toast({ title: "Error", description: "Failed to update flag status.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Room</TableHead>
              <TableHead className="w-[50px] text-center">Flagged</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length > 0 ? patients.map((patient) => (
              <TableRow key={patient.id} className={patient.isFlagged ? "bg-destructive/5 hover:bg-destructive/10" : ""}>
                <TableCell>
                  <Image
                    src={patient.avatarUrl || `https://picsum.photos/seed/${patient.id}/80/80`}
                    alt={patient.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                    data-ai-hint="person portrait"
                  />
                </TableCell>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{format(new Date(patient.dateOfBirth), "PP")}</TableCell>
                <TableCell>{format(new Date(patient.admissionDate), "PP")}</TableCell>
                <TableCell>
                  <Badge variant={patient.urgency === 'High' ? 'destructive' : patient.urgency === 'Medium' ? 'secondary' : 'outline'}>
                    {patient.urgency}
                  </Badge>
                </TableCell>
                <TableCell>{patient.roomNumber || 'N/A'}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" onClick={() => toggleFlag(patient)} title={patient.isFlagged ? "Unflag Record" : "Flag Record"}>
                    {patient.isFlagged ? <Flag className="h-5 w-5 text-destructive" /> : <FlagOff className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPatient(patient)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeletePatient(patient)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
               <TableRow>
                <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPatient ? "Edit Patient Record" : "Register New Patient"}</DialogTitle>
            <DialogDescription>
              {selectedPatient ? "Update the patient's details below." : "Fill in the form to register a new patient."}
            </DialogDescription>
          </DialogHeader>
          <PatientAdminForm
            patient={selectedPatient}
            onSubmitSuccess={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the record for {patientToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeletePatient}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// Dummy Card component if not using shadcn Card for the main container of the table
const Card = ({className, children}: {className?:string, children: React.ReactNode}) => <div className={className}>{children}</div>;


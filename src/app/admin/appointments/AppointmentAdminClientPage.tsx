"use client";

import { useState } from "react";
import type { Appointment, Doctor, Patient } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, CalendarPlus, CheckCircle, XCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/admin/AppointmentForm"; // To be created
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { deleteAppointment as deleteAppointmentAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface AppointmentAdminClientPageProps {
  initialAppointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
}

export default function AppointmentAdminClientPage({ initialAppointments, doctors, patients }: AppointmentAdminClientPageProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const { toast } = useToast();

  const handleAddNewAppointment = () => {
    setSelectedAppointment(null);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteAppointment = async () => {
    if (appointmentToDelete) {
      const success = await deleteAppointmentAction(appointmentToDelete.id);
      if (success) {
        setAppointments(appointments.filter(a => a.id !== appointmentToDelete.id));
        toast({ title: "Success", description: "Appointment deleted successfully." });
      } else {
        toast({ title: "Error", description: "Failed to delete appointment.", variant: "destructive" });
      }
      setAppointmentToDelete(null);
      setIsConfirmDeleteDialogOpen(false);
    }
  };

  const handleFormSubmit = (appointmentData: Appointment) => {
    if (selectedAppointment) { // Editing
      setAppointments(appointments.map(a => a.id === appointmentData.id ? appointmentData : a));
      toast({ title: "Success", description: "Appointment updated successfully." });
    } else { // Adding
      setAppointments([...appointments, appointmentData]);
      toast({ title: "Success", description: "Appointment scheduled successfully." });
    }
    setIsFormOpen(false);
    setSelectedAppointment(null);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Scheduled':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><Clock className="mr-1 h-3 w-3" />Scheduled</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };


  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length > 0 ? appointments.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()).map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <div>{format(new Date(appointment.dateTime), "PP")}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(appointment.dateTime), "p")}</div>
                </TableCell>
                <TableCell className="font-medium">{appointment.patientName}</TableCell>
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditAppointment(appointment)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteAppointment(appointment)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedAppointment ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
            <DialogDescription>
              {selectedAppointment ? "Update the appointment details below." : "Fill in the form to schedule a new appointment."}
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            appointment={selectedAppointment}
            doctors={doctors}
            patients={patients}
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
              Are you sure you want to delete this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteAppointment}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// Dummy Card component if not using shadcn Card for the main container of the table
const Card = ({className, children}: {className?:string, children: React.ReactNode}) => <div className={className}>{children}</div>;

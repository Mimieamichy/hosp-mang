"use client";

import { useState } from "react";
import type { Doctor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DoctorForm } from "@/components/admin/DoctorForm"; // To be created
import Image from "next/image";
import { deleteDoctor as deleteDoctorAction } from "@/lib/actions"; // Server action
import { useToast } from "@/hooks/use-toast";

interface DoctorAdminClientPageProps {
  initialDoctors: Doctor[];
}

export default function DoctorAdminClientPage({ initialDoctors }: DoctorAdminClientPageProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const { toast } = useToast();

  const handleAddNewDoctor = () => {
    setSelectedDoctor(null);
    setIsFormOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleDeleteDoctor = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteDoctor = async () => {
    if (doctorToDelete) {
      const success = await deleteDoctorAction(doctorToDelete.id);
      if (success) {
        setDoctors(doctors.filter(d => d.id !== doctorToDelete.id));
        toast({ title: "Success", description: "Doctor deleted successfully." });
      } else {
        toast({ title: "Error", description: "Failed to delete doctor.", variant: "destructive" });
      }
      setDoctorToDelete(null);
      setIsConfirmDeleteDialogOpen(false);
    }
  };

  const handleFormSubmit = (doctorData: Doctor) => {
    if (selectedDoctor) { // Editing
      setDoctors(doctors.map(d => d.id === doctorData.id ? doctorData : d));
      toast({ title: "Success", description: "Doctor updated successfully." });
    } else { // Adding
      setDoctors([...doctors, doctorData]);
      toast({ title: "Success", description: "Doctor added successfully." });
    }
    setIsFormOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="space-y-6">
       {/* This button is now in page.tsx, kept here for reference if layout changes */}
       {/* <div className="flex justify-end">
        <Button onClick={handleAddNewDoctor}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New Doctor
        </Button>
      </div> */}
      <Card className="overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length > 0 ? doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <Image
                    src={doctor.avatarUrl || `https://picsum.photos/seed/${doctor.id}/80/80`}
                    alt={doctor.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                    data-ai-hint="doctor professional"
                  />
                </TableCell>
                <TableCell className="font-medium">{doctor.name}</TableCell>
                <TableCell>{doctor.specialty}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{doctor.id}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditDoctor(doctor)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteDoctor(doctor)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No doctors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedDoctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
            <DialogDescription>
              {selectedDoctor ? "Update the doctor's details below." : "Fill in the form to add a new doctor."}
            </DialogDescription>
          </DialogHeader>
          <DoctorForm
            doctor={selectedDoctor}
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
              Are you sure you want to delete Dr. {doctorToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteDoctor}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Dummy Card component if not using shadcn Card for the main container of the table
const Card = ({className, children}: {className?:string, children: React.ReactNode}) => <div className={className}>{children}</div>;

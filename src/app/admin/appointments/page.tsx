import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { mockAppointments, mockDoctors, mockPatients } from "@/lib/data";
import AppointmentAdminClientPage from "./AppointmentAdminClientPage";

export default function ManageAppointmentsPage() {
  const appointments = mockAppointments;
  const doctors = mockDoctors;
  const patients = mockPatients;

  return (
    <div>
      <PageHeader
        title="Manage Appointments"
        description="Schedule, view, edit, or cancel appointments."
      >
        <Button asChild>
          <Link href="/admin/appointments/new"> {/* Conceptual link, form needs to be created */}
            <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Appointment
          </Link>
        </Button>
      </PageHeader>
      <AppointmentAdminClientPage 
        initialAppointments={appointments} 
        doctors={doctors}
        patients={patients}
      />
    </div>
  );
}

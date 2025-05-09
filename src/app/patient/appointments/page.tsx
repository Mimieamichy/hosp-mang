import { PageHeader } from "@/components/PageHeader";
import { mockAppointments, mockPatients }_ from "@/lib/data"; // Assuming mockPatients has the current patient
import PatientAppointmentsClientPage from "./PatientAppointmentsClientPage";

export default function PatientAppointmentsPage() {
  // For demo, assume patient P001 is logged in
  const currentPatientId = "P001";
  const appointments = mockAppointments.filter(appt => appt.patientId === currentPatientId);
  const patient = mockPatients.find(p => p.id === currentPatientId);

  return (
    <div>
      <PageHeader
        title="My Appointments"
        description={`View your appointment history and upcoming bookings, ${patient?.name || 'Valued Patient'}.`}
      />
      <PatientAppointmentsClientPage initialAppointments={appointments} />
    </div>
  );
}

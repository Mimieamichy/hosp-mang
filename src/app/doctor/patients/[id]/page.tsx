import { PageHeader } from "@/components/PageHeader";
import { mockPatients, mockAppointments } from "@/lib/data"; // Using mock data
import { notFound } from "next/navigation";
import PatientDetailClientPage from "./PatientDetailClientPage";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = mockPatients.find(p => p.id === params.id);
  
  if (!patient) {
    notFound();
  }

  // For demonstration, let's assume patient.appointments is already populated or we filter mockAppointments
  const patientAppointments = mockAppointments.filter(appt => appt.patientId === patient.id);
  const enrichedPatient = {...patient, appointments: patientAppointments};


  return (
    <div>
      <PageHeader
        title={patient.name}
        description={`Patient ID: ${patient.id} | DOB: ${new Date(patient.dateOfBirth).toLocaleDateString()}`}
      />
      <PatientDetailClientPage patient={enrichedPatient} />
    </div>
  );
}

// Optional: Generate static paths if you have a known set of patients
// export async function generateStaticParams() {
//   return mockPatients.map(patient => ({
//     id: patient.id,
//   }));
// }

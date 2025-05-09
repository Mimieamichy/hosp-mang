import { PageHeader } from "@/components/PageHeader";
import { mockAppointments, mockDoctors } from "@/lib/data";
import DoctorScheduleClientPage from "./DoctorScheduleClientPage";

export default function DoctorSchedulePage() {
  // Assuming a logged-in doctor or selecting a default for demo
  const currentDoctor = mockDoctors[0] || { id: "D000", name: "Current Doctor", specialty: "N/A", schedule: [] };
  const appointments = mockAppointments.filter(appt => appt.doctorId === currentDoctor.id);

  return (
    <div>
      <PageHeader
        title="My Schedule"
        description={`Upcoming and past appointments for ${currentDoctor.name}.`}
      />
      <DoctorScheduleClientPage 
        initialAppointments={appointments} 
        currentDoctorName={currentDoctor.name} 
      />
    </div>
  );
}

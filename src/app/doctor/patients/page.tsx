import { PageHeader } from "@/components/PageHeader";
import { mockPatients } from "@/lib/data";
import PatientDirectoryClientPage from "./PatientDirectoryClientPage";

export default function PatientDirectoryPage() {
  const patients = mockPatients; // Fetch or pass data as needed

  return (
    <div>
      <PageHeader
        title="Patient Directory"
        description="Browse and manage patient records. Sort by name, admission date, or urgency."
      />
      <PatientDirectoryClientPage initialPatients={patients} />
    </div>
  );
}

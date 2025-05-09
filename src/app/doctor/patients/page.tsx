
import { PageHeader } from "@/components/PageHeader";
import { mockPatients } from "@/lib/data";
import PatientDirectoryClientPage from "./PatientDirectoryClientPage";
import { Suspense } from 'react';

export default function PatientDirectoryPage() {
  const patients = mockPatients; // Fetch or pass data as needed

  return (
    <div>
      <PageHeader
        title="Patient Directory"
        description="Browse and manage patient records. Sort by name, admission date, or urgency."
      />
      <Suspense fallback={<p className="p-4 text-center text-muted-foreground">Loading patient directory...</p>}>
        <PatientDirectoryClientPage initialPatients={patients} />
      </Suspense>
    </div>
  );
}

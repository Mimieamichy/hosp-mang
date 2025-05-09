import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { mockPatients } from "@/lib/data";
import PatientAdminClientPage from "./PatientAdminClientPage";

export default function ManagePatientsPage() {
  const patients = mockPatients;

  return (
    <div>
      <PageHeader
        title="Manage Patients"
        description="View, add, edit, or remove patient records from the system."
      >
        <Button asChild>
          <Link href="/admin/patients/new"> {/* Conceptual link, form needs to be created */}
            <PlusCircle className="mr-2 h-4 w-4" /> Register New Patient
          </Link>
        </Button>
      </PageHeader>
      <PatientAdminClientPage initialPatients={patients} />
    </div>
  );
}

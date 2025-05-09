import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { mockDoctors } from "@/lib/data";
import DoctorAdminClientPage from "./DoctorAdminClientPage";

export default function ManageDoctorsPage() {
  // In a real app, data would be fetched here or in the client component
  const doctors = mockDoctors;

  return (
    <div>
      <PageHeader
        title="Manage Doctors"
        description="Add, edit, or remove doctor profiles from the system."
      >
        <Button asChild>
          <Link href="/admin/doctors/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Doctor
          </Link>
        </Button>
      </PageHeader>
      <DoctorAdminClientPage initialDoctors={doctors} />
    </div>
  );
}

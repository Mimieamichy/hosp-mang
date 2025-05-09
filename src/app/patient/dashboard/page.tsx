import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarCheck2, Bell, FileText, MessageSquare } from "lucide-react";
import { mockAppointments, mockPatients } from "@/lib/data"; // Using mock data
import { format, parseISO, isFuture, startOfDay } from "date-fns";

export default function PatientDashboardPage() {
  // Mock data for a specific patient (e.g., P001 Alice Wonderland)
  const currentPatient = mockPatients.find(p => p.id === 'P001') || mockPatients[0];
  const patientName = currentPatient.name;

  const upcomingAppointments = mockAppointments.filter(
    (appt) => appt.patientId === currentPatient.id && 
              (isFuture(parseISO(appt.dateTime)) || isSameDay(parseISO(appt.dateTime), startOfDay(new Date()))) &&
              appt.status === "Scheduled"
  );

  const nextAppointment = upcomingAppointments.length > 0 
    ? upcomingAppointments.sort((a,b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime())[0] 
    : null;

  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title={`Welcome, ${patientName}`}
        description="Manage your appointments and view your medical information."
      />
      
      {nextAppointment && (
        <Card className="mb-6 bg-primary/10 border-primary/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary flex items-center"><CalendarCheck2 className="mr-2 h-6 w-6" /> Your Next Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {nextAppointment.type} with {nextAppointment.doctorName}
            </p>
            <p className="text-muted-foreground">
              {format(parseISO(nextAppointment.dateTime), "eeee, MMMM do, yyyy 'at' p")}
            </p>
            {nextAppointment.notes && <p className="mt-2 text-sm italic">Notes: {nextAppointment.notes}</p>}
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/patient/appointments">View All Appointments</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardActionCard
          title="View Appointments"
          description="Check your upcoming and past appointments."
          href="/patient/appointments"
          icon={<CalendarCheck2 className="h-8 w-8 text-primary" />}
        />
        <DashboardActionCard
          title="Medical Records"
          description="Access your test results and summaries (mock)."
          href="#" // To be implemented
          icon={<FileText className="h-8 w-8 text-primary" />}
        />
         <DashboardActionCard
          title="Notifications"
          description="Check for new messages or updates (mock)."
          href="#" // To be implemented
          icon={<Bell className="h-8 w-8 text-primary" />}
        />
      </div>

      {/* Placeholder for recent activity or messages */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>Latest information regarding your health (mock data).</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 && !nextAppointment && (
             <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
          )}
          {upcomingAppointments.length > 0 && (
            <ul className="space-y-2 text-sm">
              <li>Your appointment for <span className="font-medium">{upcomingAppointments[0].type}</span> is confirmed for <span className="font-medium">{format(parseISO(upcomingAppointments[0].dateTime), 'MMM dd, yyyy')}</span>.</li>
              {currentPatient.diagnosis && <li>Your latest diagnosis update: <span className="font-medium">{currentPatient.diagnosis}</span>.</li>}
              <li>Remember to arrive 15 minutes early for your appointments.</li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function DashboardActionCard({ title, description, href, icon }: DashboardActionCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        {icon}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>Go to {title}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// Helper for dashboard, not in use for current mock data structure
function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

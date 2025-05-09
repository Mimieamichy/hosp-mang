"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck2, Bell, FileText } from "lucide-react";
import { mockAppointments, mockPatients } from "@/lib/data";
import type { Appointment } from "@/lib/types";
import { format, parseISO, isFuture, startOfDay, isSameDay as dateFnsIsSameDay } from "date-fns";

export default function PatientDashboardPage() {
  const [mounted, setMounted] = useState(false);
  // For demo, assume patient P001 is logged in. In a real app, this would come from auth.
  const currentPatient = mockPatients.find(p => p.id === 'P001') || mockPatients[0];
  const patientName = currentPatient.name;

  const [upcomingAppointmentsList, setUpcomingAppointmentsList] = useState<Appointment[]>([]);
  const [nextAppt, setNextAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    // This effect runs only on the client after hydration
    const now = new Date(); // Current time on the client
    const today = startOfDay(now);

    const filteredUpcoming = mockAppointments.filter(
      (appt) => appt.patientId === currentPatient.id &&
                (isFuture(parseISO(appt.dateTime)) || dateFnsIsSameDay(parseISO(appt.dateTime), today)) &&
                appt.status === "Scheduled"
    );

    const sortedUpcoming = [...filteredUpcoming].sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime());
    
    setUpcomingAppointmentsList(sortedUpcoming);
    setNextAppt(sortedUpcoming.length > 0 ? sortedUpcoming[0] : null);
    setMounted(true); // Indicate client-side logic has run
  }, [currentPatient.id]); // Dependency: currentPatient.id

  if (!mounted) {
    // Render a loading state or minimal content to avoid hydration mismatch
    return (
      <div className="container mx-auto py-2">
        <PageHeader
          title={`Welcome, ${patientName}`}
          description="Manage your appointments and view your medical information."
        />
        <div className="space-y-6">
          <Card className="mb-6 bg-primary/10 border-primary/30 shadow-lg animate-pulse">
            <CardHeader>
              <CardTitle className="text-primary flex items-center"><CalendarCheck2 className="mr-2 h-6 w-6" /> Your Next Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
            <CardFooter>
              <Button disabled>View All Appointments</Button>
            </CardFooter>
          </Card>
          <p className="text-center text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title={`Welcome, ${patientName}`}
        description="Manage your appointments and view your medical information."
      />
      
      {nextAppt && (
        <Card className="mb-6 bg-primary/10 border-primary/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary flex items-center"><CalendarCheck2 className="mr-2 h-6 w-6" /> Your Next Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {nextAppt.type} with Dr. {nextAppt.doctorName}
            </p>
            <p className="text-muted-foreground">
              {format(parseISO(nextAppt.dateTime), "eeee, MMMM do, yyyy 'at' p")}
            </p>
            {nextAppt.notes && <p className="mt-2 text-sm italic">Notes: {nextAppt.notes}</p>}
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
          href="#" 
          icon={<FileText className="h-8 w-8 text-primary" />}
        />
         <DashboardActionCard
          title="Notifications"
          description="Check for new messages or updates (mock)."
          href="#" 
          icon={<Bell className="h-8 w-8 text-primary" />}
        />
      </div>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>Latest information regarding your health (mock data).</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointmentsList.length === 0 && !nextAppt && (
             <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
          )}
          {upcomingAppointmentsList.length > 0 && (
            <ul className="space-y-2 text-sm">
              <li>Your appointment for <span className="font-medium">{upcomingAppointmentsList[0].type}</span> is confirmed for <span className="font-medium">{format(parseISO(upcomingAppointmentsList[0].dateTime), 'MMM dd, yyyy')}</span>.</li>
              {currentPatient.diagnosis && <li>Your latest diagnosis update: <span className="font-medium">{currentPatient.diagnosis}</span>.</li>}
              <li>Remember to arrive 15 minutes early for your appointments.</li>
            </ul>
          )}
           {!currentPatient.diagnosis && upcomingAppointmentsList.length === 0 && <p className="text-muted-foreground">No recent updates.</p>}
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

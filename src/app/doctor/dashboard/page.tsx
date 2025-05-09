import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, Users, DoorOpen, AlertTriangle, ListChecks } from "lucide-react";
import { mockAppointments, mockPatients } from "@/lib/data"; // Using mock data for simplicity

export default function DoctorDashboardPage() {
  // Mock data, replace with actual data fetching
  const upcomingAppointments = mockAppointments.filter(
    (appt) => new Date(appt.dateTime) > new Date() && appt.status === "Scheduled"
  ).length;
  const flaggedPatients = mockPatients.filter(p => p.isFlagged).length;
  const doctorName = "Dr. Emily Carter"; // Placeholder doctor name

  const summaryStats = [
    { title: "Upcoming Appointments", value: upcomingAppointments.toString(), icon: <CalendarDays className="h-6 w-6 text-primary" />, href: "/doctor/schedule" },
    { title: "Flagged Patients", value: flaggedPatients.toString(), icon: <AlertTriangle className="h-6 w-6 text-destructive" />, href: "/doctor/patients?filter=flagged" },
    { title: "Total Assigned Patients", value: "27", icon: <Users className="h-6 w-6 text-primary" />, href: "/doctor/patients" }, // Placeholder
    { title: "Available Rooms", value: "3", icon: <DoorOpen className="h-6 w-6 text-green-500" />, href: "/doctor/rooms" }, // Placeholder
  ];

  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title={`Welcome, ${doctorName}`}
        description="Your central hub for patient care and schedule management."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
               <Button variant="link" asChild className="px-0 pt-2 text-xs text-muted-foreground">
                <Link href={stat.href}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/doctor/schedule"><CalendarDays className="mr-2 h-4 w-4" /> View My Schedule</Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link href="/doctor/patients"><Users className="mr-2 h-4 w-4" /> Access Patient Directory</Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link href="/doctor/rooms"><DoorOpen className="mr-2 h-4 w-4" /> Check Room Availability</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle> {/* Placeholder */}
            <CardDescription>Updates on your recent patient interactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <ListChecks className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                <div>
                  <span className="font-medium">Diagnosis updated</span> for Alice Wonderland.
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ListChecks className="h-5 w-5 flex-shrink-0 text-blue-500 mt-0.5" />
                <div>
                  <span className="font-medium">Notes summarized</span> for Bob The Builder.
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </li>
               <li className="flex items-start gap-3">
                <ListChecks className="h-5 w-5 flex-shrink-0 text-yellow-500 mt-0.5" />
                <div>
                  <span className="font-medium">New patient assigned:</span> Edward Scissorhands.
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </li>
            </ul>
             <Button variant="link" asChild className="px-0 pt-4 text-sm">
                <Link href="#">View All Activity</Link>
              </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

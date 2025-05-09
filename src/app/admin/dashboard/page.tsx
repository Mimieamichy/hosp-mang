import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserCog, Users, CalendarPlus, BarChart3 } from "lucide-react";

export default function AdminDashboardPage() {
  const summaryStats = [
    { title: "Total Doctors", value: "12", icon: <UserCog className="h-6 w-6 text-primary" />, href: "/admin/doctors" },
    { title: "Registered Patients", value: "150", icon: <Users className="h-6 w-6 text-primary" />, href: "/admin/patients" },
    { title: "Upcoming Appointments", value: "35", icon: <CalendarPlus className="h-6 w-6 text-primary" />, href: "/admin/appointments" },
    { title: "System Health", value: "Optimal", icon: <BarChart3 className="h-6 w-6 text-green-500" />, href: "#" },
  ];

  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of MediTrack Lite system management."
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
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/doctors/new"><UserCog className="mr-2 h-4 w-4" /> Add New Doctor</Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link href="/admin/patients/new"><Users className="mr-2 h-4 w-4" /> Register New Patient</Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link href="/admin/appointments/new"><CalendarPlus className="mr-2 h-4 w-4" /> Schedule Appointment</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>System Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Database backup successful at 2:00 AM.</li>
              <li>New security patch available. Consider updating.</li>
              <li>User activity logs show normal patterns.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

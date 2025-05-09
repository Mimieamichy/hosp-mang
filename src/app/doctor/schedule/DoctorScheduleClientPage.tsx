"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Appointment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, UserCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { format, parseISO, isSameDay, isPast, isFuture, startOfDay } from 'date-fns';

interface DoctorScheduleClientPageProps {
  initialAppointments: Appointment[];
  currentDoctorName: string;
}

export default function DoctorScheduleClientPage({ initialAppointments, currentDoctorName }: DoctorScheduleClientPageProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const appointmentsBySelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return appointments
      .filter(appt => isSameDay(parseISO(appt.dateTime), selectedDate))
      .sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime());
  }, [appointments, selectedDate]);

  const upcomingAppointments = useMemo(() => {
    const today = startOfDay(new Date());
    return appointments
      .filter(appt => isFuture(parseISO(appt.dateTime)) || isSameDay(parseISO(appt.dateTime), today))
      .filter(appt => appt.status === 'Scheduled')
      .sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime());
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    return appointments
      .filter(appt => isPast(parseISO(appt.dateTime)) || appt.status !== 'Scheduled')
      .sort((a, b) => parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime());
  }, [appointments]);

  const getStatusIcon = (status: Appointment['status']) => {
    if (status === 'Completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'Cancelled') return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  const AppointmentItem = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{appointment.type}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <UserCircle className="h-4 w-4" /> {appointment.patientName}
          </CardDescription>
        </div>
        <Badge variant={appointment.status === "Completed" ? "default" : appointment.status === "Cancelled" ? "destructive" : "secondary"} className="whitespace-nowrap">
          {getStatusIcon(appointment.status)} <span className="ml-1">{appointment.status}</span>
        </Badge>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground">Time: {format(parseISO(appointment.dateTime), "p")}</p>
        {appointment.notes && <p className="mt-1 text-xs text-muted-foreground border-l-2 pl-2 italic">Notes: {appointment.notes}</p>}
      </CardContent>
      <CardFooter className="flex justify-end pb-3 pr-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/doctor/patients/${appointment.patientId}`}>
            View Patient <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Tabs defaultValue="selectedDate">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="selectedDate">
              {selectedDate ? format(selectedDate, "MMM d") : "Selected Date"} ({appointmentsBySelectedDate.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="selectedDate" className="mt-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Appointments for {selectedDate ? format(selectedDate, "PP") : "selected date"}</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto">
                {appointmentsBySelectedDate.length > 0 ? (
                  appointmentsBySelectedDate.map(appt => <AppointmentItem key={appt.id} appointment={appt} />)
                ) : (
                  <p className="py-8 text-center text-muted-foreground">No appointments for this date.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4">
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Upcoming Appointments</CardTitle></CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map(appt => <AppointmentItem key={appt.id} appointment={appt} />)
                ) : (
                  <p className="py-8 text-center text-muted-foreground">No upcoming appointments.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past" className="mt-4">
             <Card className="shadow-lg">
              <CardHeader><CardTitle>Past Appointments</CardTitle></CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto">
                {pastAppointments.length > 0 ? (
                  pastAppointments.map(appt => <AppointmentItem key={appt.id} appointment={appt} />)
                ) : (
                  <p className="py-8 text-center text-muted-foreground">No past appointments found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

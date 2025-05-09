"use client";

import { useState, useMemo } from "react";
import type { Appointment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, CheckCircle, Clock, FileText, Stethoscope, XCircle } from "lucide-react";
import { format, parseISO, isPast, isFuture, startOfDay, isSameDay } from 'date-fns';

interface PatientAppointmentsClientPageProps {
  initialAppointments: Appointment[];
}

export default function PatientAppointmentsClientPage({ initialAppointments }: PatientAppointmentsClientPageProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const upcomingAppointments = useMemo(() => {
    const today = startOfDay(new Date());
    return appointments
      .filter(appt => isFuture(parseISO(appt.dateTime)) || isSameDay(parseISO(appt.dateTime), today))
      .filter(appt => appt.status === 'Scheduled') // Only show scheduled upcoming
      .sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime());
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    return appointments
      .filter(appt => isPast(parseISO(appt.dateTime)) || appt.status !== 'Scheduled') // Show past or non-scheduled (completed/cancelled)
      .sort((a, b) => parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime());
  }, [appointments]);

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Scheduled':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300"><Clock className="mr-1 h-3 w-3" />Scheduled</Badge>;
      case 'Completed':
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-300"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{appointment.type}</CardTitle>
            {getStatusBadge(appointment.status)}
        </div>
        <CardDescription className="flex items-center gap-2 pt-1">
            <Stethoscope className="h-4 w-4" /> Dr. {appointment.doctorName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> {format(parseISO(appointment.dateTime), "eeee, MMMM do, yyyy 'at' p")}
        </div>
        {appointment.notes && (
          <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground border-t pt-2">
            <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <p className="italic">Notes: {appointment.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
        <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="mt-4">
        {upcomingAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingAppointments.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <CalendarDays className="mx-auto mb-2 h-12 w-12" />
            <p>No upcoming appointments scheduled.</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="past" className="mt-4">
        {pastAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {pastAppointments.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <CalendarDays className="mx-auto mb-2 h-12 w-12" />
            <p>No past appointment records found.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

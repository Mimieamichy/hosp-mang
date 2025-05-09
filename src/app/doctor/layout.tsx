"use client";
import type { ReactNode } from 'react';
import { SidebarLayout, type NavItem } from '@/components/shared/SidebarLayout';
import { LayoutDashboard, Users, CalendarDays, DoorOpen, NotebookText } from 'lucide-react';

const doctorNavItems: NavItem[] = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/patients", label: "Patient Directory", icon: Users, matchStartsWith: true },
  { href: "/doctor/schedule", label: "My Schedule", icon: CalendarDays, matchStartsWith: true },
  { href: "/doctor/rooms", label: "Room Availability", icon: DoorOpen, matchStartsWith: true },
  // Note: Patient Notes Summarizer is part of Patient Details page
];

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarLayout navItems={doctorNavItems} roleName="Doctor">
      {children}
    </SidebarLayout>
  );
}

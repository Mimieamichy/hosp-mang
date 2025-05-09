"use client";
import type { ReactNode } from 'react';
import { SidebarLayout, type NavItem } from '@/components/shared/SidebarLayout';
import { LayoutDashboard, CalendarCheck2, UserCircle } from 'lucide-react';

const patientNavItems: NavItem[] = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/appointments", label: "My Appointments", icon: CalendarCheck2, matchStartsWith: true },
  // { href: "/patient/profile", label: "My Profile", icon: UserCircle, matchStartsWith: true }, // Example additional item
];

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarLayout navItems={patientNavItems} roleName="Patient">
      {children}
    </SidebarLayout>
  );
}

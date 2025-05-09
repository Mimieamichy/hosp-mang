"use client";
import type { ReactNode } from 'react';
import { SidebarLayout, type NavItem } from '@/components/shared/SidebarLayout';
import { LayoutDashboard, UserCog, Users, CalendarPlus, Hospital } from 'lucide-react';

const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "Manage Doctors", icon: UserCog, matchStartsWith: true },
  { href: "/admin/patients", label: "Manage Patients", icon: Users, matchStartsWith: true },
  { href: "/admin/appointments", label: "Manage Appointments", icon: CalendarPlus, matchStartsWith: true },
  // Example: Manage Rooms could be an admin task too
  // { href: "/admin/rooms", label: "Manage Rooms", icon: Hospital, matchStartsWith: true },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarLayout navItems={adminNavItems} roleName="Administrator">
      {children}
    </SidebarLayout>
  );
}

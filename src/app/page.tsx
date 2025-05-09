import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, UserCog, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 selection:bg-primary/20">
      <div className="mb-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" className="mx-auto mb-4 h-16 w-auto">
          <rect width="200" height="60" fill="transparent" />
          {/* A simple 'M' shape stylized as a heartbeat pulse */}
          <path d="M20 35 Q25 15 30 35 T40 35 Q45 15 50 35 T60 35 Q65 15 70 35" stroke="hsl(var(--primary))" strokeWidth="4" fill="none" />
          <text x="80" y="38" style={{ fontFamily: 'var(--font-geist-sans, sans-serif)', fontSize: '26px', fontWeight: 'bold' }} fill="hsl(var(--primary))">
            MediTrack
          </text>
          <text x="115" y="50" style={{ fontFamily: 'var(--font-geist-sans, sans-serif)', fontSize: '12px', fontWeight: '600' }} fill="hsl(var(--accent))">
            Lite
          </text>
        </svg>
        <p className="text-lg text-muted-foreground">
          Your lightweight solution for hospital management.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <RoleCard
          title="Admin Portal"
          description="Manage doctors, patients, and appointments."
          href="/admin/dashboard"
          icon={<UserCog className="h-8 w-8 text-primary" />}
        />
        <RoleCard
          title="Doctor Portal"
          description="Access schedules, patient details, and tools."
          href="/doctor/dashboard"
          icon={<Stethoscope className="h-8 w-8 text-primary" />}
        />
        <RoleCard
          title="Patient Portal"
          description="View your appointments and medical information."
          href="/patient/dashboard"
          icon={<Users className="h-8 w-8 text-primary" />}
        />
      </div>
       <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MediTrack Lite. All rights reserved.</p>
      </footer>
    </div>
  );
}

interface RoleCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function RoleCard({ title, description, href, icon }: RoleCardProps) {
  return (
    <Card className="w-full max-w-xs transform rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
      <CardHeader className="items-center pt-8 text-center">
        {icon}
        <CardTitle className="mt-4 text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-8 text-center">
        <p className="mb-6 min-h-[3em] px-2 text-sm text-muted-foreground">{description}</p>
        <Button asChild className="w-3/4 rounded-lg">
          <Link href={href}>Access Portal</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

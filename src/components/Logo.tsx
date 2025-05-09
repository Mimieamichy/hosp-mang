import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 60" // Adjusted viewBox for potentially taller logo due to "Lite"
      width="120" // Default width
      height="36"  // Default height (scaled from 200:60)
      aria-label="MediTrack Lite Logo"
      className={cn("text-primary", className)}
      {...props}
    >
      <rect width="200" height="60" fill="transparent" />
      {/* A simple 'M' shape stylized as a heartbeat pulse */}
      <path d="M20 35 Q25 15 30 35 T40 35 Q45 15 50 35 T60 35 Q65 15 70 35" stroke="currentColor" strokeWidth="4" fill="none" />
      <text x="80" y="38" style={{ fontFamily: 'var(--font-geist-sans, sans-serif)', fontSize: '26px', fontWeight: 'bold' }} fill="currentColor">
        MediTrack
      </text>
      <text x="115" y="50" style={{ fontFamily: 'var(--font-geist-sans, sans-serif)', fontSize: '12px', fontWeight: '600' }} fill="hsl(var(--accent))">
        Lite
      </text>
    </svg>
  );
}

'use client';
import { LayoutDashboard, UtensilsCrossed, Camera, Megaphone } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarNav() {
  const pathname = usePathname();
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '#', label: 'Meal Forecaster', icon: UtensilsCrossed },
    { href: '#', label: 'Hygiene Report', icon: Camera },
    { href: '#', label: 'Feedback', icon: Megaphone },
  ];

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} passHref>
            <SidebarMenuButton asChild isActive={pathname === item.href && item.href !== '#'} tooltip={item.label}>
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

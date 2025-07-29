'use client';
import { LayoutDashboard, UtensilsCrossed, Camera, Megaphone, HelpingHand, Receipt, CookingPot } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarNav() {
  const pathname = usePathname();
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/meal-forecaster', label: 'Meal Forecaster', icon: UtensilsCrossed },
    { href: '/dashboard/meal-planner', label: 'Meal Planner', icon: CookingPot },
    { href: '/dashboard/hygiene-report', label: 'Hygiene Report', icon: Camera },
    { href: '/dashboard/feedback', label: 'Feedback', icon: Megaphone },
    { href: '/dashboard/wastage-manager', label: 'Donation Manager', icon: HelpingHand },
    { href: '/dashboard/expense-tracker', label: 'Expense Tracker', icon: Receipt },
  ];

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} passHref>
            <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
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

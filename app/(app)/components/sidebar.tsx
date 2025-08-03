"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BarChart3, Sparkles, Target, BadgePercent, Code, Bot, Server } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, text: "Dashboard", href: "/dashboard" },
  { icon: BarChart3, text: "Cost Analytics", href: "/cost-analytics" },
  { icon: Server, text: "Capacity Management", href: "/capacity" },
  { icon: Sparkles, text: "Optimization", href: "/optimization" },
  { icon: Target, text: "Cost Allocation", href: "/allocation" },
  { icon: BadgePercent, text: "Discounts", href: "/discounts" },
  { icon: Code, text: "SQL Lab", href: "/sql-lab" },
  { icon: Bot, text: "AI Insights", href: "/ai-insights" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-card text-card-foreground md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-lg font-bold">FinOps</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start gap-1 px-4 text-sm font-medium">
            {menuItems.map((item) => (
              <Link
                key={item.text}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname.startsWith(item.href) && "bg-muted text-primary",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.text}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

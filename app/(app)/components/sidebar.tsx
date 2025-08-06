"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BarChart3, Sparkles, Target, BadgePercent, Code, Bot, Server, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="relative">
      <div className={cn(
        "hidden border-r bg-card text-card-foreground md:block transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-3">
            <Link href="/dashboard" className={cn(
              "flex items-center gap-2 font-semibold transition-opacity",
              isCollapsed && "opacity-0 pointer-events-none"
            )}>
              <LayoutDashboard className="h-6 w-6" />
              <span className="text-lg font-bold">FinOps</span>
            </Link>
          </div>
        
          <div className="flex-1 overflow-y-auto">
            <nav className={cn(
              "grid items-start gap-1 text-sm font-medium transition-all",
              isCollapsed ? "px-2" : "px-4"
            )}>
              {menuItems.map((item) => (
                <Link
                  key={item.text}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary relative group",
                    pathname.startsWith(item.href) && "bg-muted text-primary",
                    isCollapsed ? "px-2 justify-center" : "px-3"
                  )}
                  title={isCollapsed ? item.text : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity",
                    isCollapsed && "opacity-0 pointer-events-none absolute"
                  )}>
                    {item.text}
                  </span>
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.text}
                    </div>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Toggle Button - Positioned on the right edge */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle || (() => {})}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-background border shadow-md hover:bg-muted z-10 transition-all duration-300",
          isCollapsed ? "-right-4" : "-right-4"
        )}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
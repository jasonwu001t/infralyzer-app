"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, UserCircle, Crown, BarChart3, Eye, Building, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/hooks/use-auth"

const roleIcons = {
  admin: Crown,
  analyst: BarChart3,
  viewer: Eye
}

const roleColors = {
  admin: "bg-purple-100 text-purple-800 border-purple-200",
  analyst: "bg-blue-100 text-blue-800 border-blue-200", 
  viewer: "bg-green-100 text-green-800 border-green-200"
}

export default function Header() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  const handleSwitchUser = () => {
    logout()
    router.push("/login")
  }

  if (!user) return null

  const RoleIcon = roleIcons[user.role]

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>Data updated 2 mins ago</span>
        </div>
        {/* User context info */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>{user.organization}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {/* Show notification badge for admin users */}
          {user.role === 'admin' && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <UserCircle className="h-8 w-8" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">{user.email}</p>
                  </div>
                  <Badge variant="outline" className={roleColors[user.role]}>
                    <RoleIcon className="mr-1 h-3 w-3" />
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building className="h-3 w-3" />
                  <span>{user.organization}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleSwitchUser} className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Switch User
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

import Link from "next/link"
import { BarChart3, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header/Navbar - Same as main page */}
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg font-bold">Infralyzer</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/instance-rate-card" className="text-sm font-medium hover:underline">
            Instance Rate Card
          </Link>
          <Link href="/#setup" className="text-sm font-medium hover:underline">
            Setup Guide
          </Link>
          <Link href="/#features" className="text-sm font-medium hover:underline">
            Features
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Infralyzer</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Create Your Account</h1>
              <p className="text-muted-foreground">
                Start your 30-day free trial and take control of your cloud costs
              </p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Sign Up
              </CardTitle>
              <CardDescription>
                Enter your details to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Your Company" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a strong password" />
              </div>
              <Button className="w-full" size="lg">
                Start Free Trial
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy. 
                No credit card required for the 30-day trial.
              </p>
            </CardContent>
          </Card>
          
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer - Same as main page */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span className="font-bold">Infralyzer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enterprise cloud cost management platform that helps you optimize AWS spending with AI-powered insights.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Product</h4>
              <div className="space-y-2 text-sm">
                <Link href="/#features" className="text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="/instance-rate-card" className="text-muted-foreground hover:text-foreground">
                  Instance Rate Card
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Resources</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  API Reference
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Support
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Infralyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
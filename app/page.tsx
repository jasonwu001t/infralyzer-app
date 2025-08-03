import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  BarChart3, 
  Bot, 
  Sparkles, 
  TrendingDown, 
  DollarSign,
  Cloud,
  Shield,
  Zap,
  Target,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Lightbulb,
  Brain,
  Database,
  Settings,
  Globe
} from "lucide-react"

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg font-bold">Infralyzer</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium hover:underline">
            Features
          </Link>
          <Link href="#ai-insights" className="text-sm font-medium hover:underline">
            AI Insights
          </Link>
          <Link href="/instance-rate-card" className="text-sm font-medium hover:underline">
            Instance Rate Card
          </Link>
          <Link href="#cost-tips" className="text-sm font-medium hover:underline">
            Cost Tips
          </Link>
          <Link href="#multicloud" className="text-sm font-medium hover:underline">
            Multi-Cloud
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:px-6 lg:py-24">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                Cloud Cost Intelligence
                <span className="text-primary"> for Modern Teams</span>
            </h1>
              <p className="mx-auto max-w-[600px] text-muted-foreground text-lg md:text-xl">
                Optimize AWS spending with AI-powered insights, advanced analytics, and intelligent recommendations. 
                Take control of your cloud costs today.
            </p>
          </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button size="lg" asChild>
                <Link href="/get-started">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/instance-rate-card">
                  Try Instance Rate Card
            </Link>
          </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free 30-day trial</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>5-minute setup</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Display */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Real-Time Cost Intelligence
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Get instant visibility into your AWS spending with live dashboards and intelligent insights
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <DollarSign className="h-8 w-8 mx-auto text-green-600" />
                  <CardTitle className="text-2xl">$1.2M+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Average Annual Savings</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <TrendingDown className="h-8 w-8 mx-auto text-blue-600" />
                  <CardTitle className="text-2xl">23%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Average Cost Reduction</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Zap className="h-8 w-8 mx-auto text-yellow-600" />
                  <CardTitle className="text-2xl">5 min</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Setup Time</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Users className="h-8 w-8 mx-auto text-purple-600" />
                  <CardTitle className="text-2xl">500+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Companies Trust Us</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section id="features" className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Everything You Need for Cloud Cost Management
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Comprehensive tools to understand, optimize, and control your cloud spending
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <CardTitle>Advanced Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Deep dive into your spending patterns with interactive dashboards, trend analysis, and custom reports.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/get-started">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Bot className="h-8 w-8 text-green-600" />
                  <CardTitle>AI-Powered Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get intelligent recommendations for cost optimization, anomaly detection, and resource right-sizing.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="#ai-insights">Explore AI</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Database className="h-8 w-8 text-purple-600" />
                  <CardTitle>SQL Lab</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Query your cost data directly with our AI-assisted SQL editor and pre-built templates.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/get-started">Try SQL Lab</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-red-600" />
                  <CardTitle>Cost Governance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Enforce budgets, track untagged resources, and ensure cost allocation policies are followed.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/get-started">View Governance</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-orange-600" />
                  <CardTitle>Optimization Engine</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automated recommendations for Reserved Instances, Spot usage, and resource rightsizing.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/get-started">See Recommendations</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                  <CardTitle>Instance Rate Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Compare AWS instance pricing across regions, purchase options, and get real-time rate information.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/instance-rate-card">View Rate Card</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Industry News & Insights */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Industry News & Insights
              </h2>
              <p className="text-muted-foreground text-lg">
                Stay updated with the latest cloud cost optimization trends and AWS pricing changes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">This Week</span>
                  </div>
                  <CardTitle className="text-lg">AWS Announces New Reserved Instance Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    New 1-year and 3-year commitment options for EC2 instances could save up to 45% on compute costs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Last Month</span>
                  </div>
                  <CardTitle className="text-lg">FinOps Foundation Release New Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Updated cloud financial management best practices emphasizing automation and AI-driven optimization.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Trending</span>
                  </div>
                  <CardTitle className="text-lg">S3 Storage Classes Optimization Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    How intelligent tiering and lifecycle policies can reduce storage costs by up to 60%.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI-Powered Features */}
        <section id="ai-insights" className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                AI-Powered Cost Optimization
              </h2>
              <p className="text-muted-foreground text-lg">
                Let artificial intelligence identify savings opportunities you might miss
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-l-4 border-l-blue-400">
                <CardHeader>
                  <Brain className="h-8 w-8 text-blue-600" />
                  <CardTitle>Intelligent Anomaly Detection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    AI monitors your spending patterns and alerts you to unusual cost spikes before they impact your budget.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Real-time anomaly detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Customizable alert thresholds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Root cause analysis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-400">
                <CardHeader>
                  <Target className="h-8 w-8 text-green-600" />
                  <CardTitle>Smart Rightsizing Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Machine learning analyzes your resource utilization to suggest optimal instance sizes and types.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Usage pattern analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Performance impact assessment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Automated implementation options</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-400">
                <CardHeader>
                  <Sparkles className="h-8 w-8 text-purple-600" />
                  <CardTitle>Predictive Cost Forecasting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    AI-driven forecasting helps you plan budgets and predict future costs based on usage trends.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>12-month cost projections</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Seasonal trend analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Confidence interval modeling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-400">
                <CardHeader>
                  <Bot className="h-8 w-8 text-orange-600" />
                  <CardTitle>AI Query Assistant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Natural language interface to query your cost data. Ask questions in plain English, get SQL results.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Natural language processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Automated SQL generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Interactive visualizations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Cost Saving Tips */}
        <section id="cost-tips" className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Proven Cost Saving Strategies
              </h2>
              <p className="text-muted-foreground text-lg">
                Learn from the best practices of companies who have reduced their cloud costs by millions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  <CardTitle className="text-lg">Reserved Instance Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Strategic RI purchases can save 30-60% on EC2 costs. Learn how to analyze your usage patterns and optimize RI coverage.
                  </p>
                  <Badge variant="secondary" className="text-xs">Save up to 60%</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  <CardTitle className="text-lg">Spot Instance Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use Spot instances for fault-tolerant workloads. Best practices for maintaining availability while maximizing savings.
                  </p>
                  <Badge variant="secondary" className="text-xs">Save up to 90%</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  <CardTitle className="text-lg">Storage Lifecycle Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Implement intelligent tiering and lifecycle policies to automatically move data to cost-effective storage classes.
                  </p>
                  <Badge variant="secondary" className="text-xs">Save up to 70%</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  <CardTitle className="text-lg">Resource Tagging Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Implement comprehensive tagging for cost allocation, automated governance, and detailed spend tracking by team/project.
                  </p>
                  <Badge variant="secondary" className="text-xs">Essential for visibility</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  <CardTitle className="text-lg">Auto-Scaling Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure auto-scaling policies to match capacity with demand, eliminating over-provisioning and idle resources.
                  </p>
                  <Badge variant="secondary" className="text-xs">Dynamic optimization</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  <CardTitle className="text-lg">Data Transfer Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Minimize inter-region and internet data transfer costs through strategic architecture and CDN usage.
                  </p>
                  <Badge variant="secondary" className="text-xs">Network efficiency</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Multi-Cloud Management */}
        <section id="multicloud" className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Multi-Cloud Resource Management
              </h2>
              <p className="text-muted-foreground text-lg">
                Unified cost management across AWS, Azure, and Google Cloud Platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-l-4 border-l-blue-400">
                <CardHeader>
                  <Cloud className="h-8 w-8 text-blue-600" />
                  <CardTitle>Unified Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Single pane of glass for all your cloud costs. Compare spending across providers, identify optimization opportunities, and track savings initiatives.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">AWS</Badge>
                    <Badge variant="outline">Azure</Badge>
                    <Badge variant="outline">GCP</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-400">
                <CardHeader>
                  <Globe className="h-8 w-8 text-green-600" />
                  <CardTitle>Cross-Cloud Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    AI-powered recommendations for workload placement, resource migration, and cost arbitrage opportunities across cloud providers.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Workload cost comparison</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Migration recommendations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sample Charts and Data */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Interactive Cost Analytics
              </h2>
              <p className="text-muted-foreground text-lg">
                Powerful visualizations and drill-down capabilities to understand your spending
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Monthly Spend Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                    <div className="text-center space-y-2">
                      <BarChart3 className="h-12 w-12 mx-auto text-blue-600" />
                      <p className="text-sm text-blue-800">Interactive cost trend visualization</p>
                      <p className="text-xs text-blue-600">Drill down by service, region, or tag</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Optimization Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
                    <div className="text-center space-y-2">
                      <Target className="h-12 w-12 mx-auto text-green-600" />
                      <p className="text-sm text-green-800">AI-generated savings recommendations</p>
                      <p className="text-xs text-green-600">Prioritized by impact and effort</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="max-w-4xl mx-auto text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter">
                    Ready to Optimize Your Cloud Costs?
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Join hundreds of companies who have reduced their AWS spending by an average of 23% 
                    using our platform. Start your free trial today.
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
                  <Button size="lg" asChild>
                    <Link href="/get-started">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/instance-rate-card">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Try Instance Rate Card
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>30-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
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
                <Link href="#features" className="text-muted-foreground hover:text-foreground">
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
                <Link href="/get-started" className="text-muted-foreground hover:text-foreground">
                  Setup Guide
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
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  BarChart3, 
  Database,
  Settings,
  Globe,
  Play,
  Clock,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Info,
  Terminal,
  Cloud,
  Key,
  FileText,
  Zap,
  Users,
  Monitor,
  Download,
  Copy,
  ExternalLink,
  BookOpen,
  Wrench,
  Target,
  HelpCircle,
  Server,
  Code,
  FolderOpen,
  Package,
  Cpu,
  HardDrive,
  GitBranch
} from "lucide-react"

export default function GetStartedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header/Navbar */}
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg font-bold">Infralyzer</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/instance-rate-card" className="text-sm font-medium hover:underline">
            Instance Rate Card
          </Link>
          <Link href="#architecture" className="text-sm font-medium hover:underline">
            Architecture
          </Link>
          <Link href="#installation" className="text-sm font-medium hover:underline">
            Installation
          </Link>
          <Link href="#deployment" className="text-sm font-medium hover:underline">
            Deployment
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Infralyzer Setup Guide</h1>
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                Deploy the Infralyzer FinOps platform in your environment. This Python-based platform provides 
                SQL analytics for AWS Cost and Usage Reports with local data caching and FastAPI REST endpoints.
              </p>
              
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> Infralyzer is built on the <code>de-polars</code> library and uses DuckDB for high-performance 
                  SQL analytics with local data caching to reduce S3 query costs by 90%+.
                </AlertDescription>
              </Alert>

              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Setup Time: 15-20 minutes
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Cpu className="h-4 w-4 mr-2" />
                  Python 3.8+ Required
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Server className="h-4 w-4 mr-2" />
                  FastAPI Backend
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Local Data Caching
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 md:px-6 max-w-6xl">
          {/* Table of Contents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Setup Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <Link href="#architecture" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowRight className="h-3 w-3" />
                    System Architecture
                  </Link>
                  <Link href="#prerequisites" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowRight className="h-3 w-3" />
                    Prerequisites & Environment
                  </Link>
                  <Link href="#installation" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowRight className="h-3 w-3" />
                    Backend Installation
                  </Link>
                  <Link href="#configuration" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowRight className="h-3 w-3" />
                    Configuration Setup
                  </Link>
                </div>
                <div className="space-y-2">
                  <Link href="#data-setup" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowRight className="h-3 w-3" />
                    Data Source Configuration
                  </Link>
                  <Link href="#deployment" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowRight className="h-3 w-3" />
                    Start the Platform
                  </Link>
                  <Link href="#frontend" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowRight className="h-3 w-3" />
                    Frontend Integration
                  </Link>
                  <Link href="#verification" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowRight className="h-3 w-3" />
                    Verification & Testing
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Architecture */}
          <section id="architecture" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Database className="h-7 w-7" />
              System Architecture
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Infralyzer is a modular FinOps platform built on Python with <strong>FastAPI backend</strong> and 
              <strong>DuckDB SQL engine</strong>. The architecture emphasizes local data caching to dramatically 
              reduce S3 query costs while providing high-performance analytics.
            </p>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Core Architecture Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-6 rounded-lg text-center mb-4">
                  <div className="text-sm text-muted-foreground mb-2">Infralyzer Platform Architecture</div>
                  <div className="bg-blue-100 border-2 border-dashed border-blue-300 p-8 rounded">
                    <div className="space-y-6">
                      {/* Frontend Layer */}
                      <div className="bg-green-100 p-4 rounded border">
                        <div className="font-medium text-green-800 mb-2">Frontend Layer</div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-white p-2 rounded">Next.js Dashboard</div>
                          <div className="bg-white p-2 rounded">SQL Lab</div>
                          <div className="bg-white p-2 rounded">Cost Analytics</div>
                        </div>
                      </div>
                      
                      {/* API Layer */}
                      <div className="bg-blue-100 p-4 rounded border">
                        <div className="font-medium text-blue-800 mb-2">FastAPI Backend</div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="bg-white p-2 rounded">KPI Endpoints</div>
                          <div className="bg-white p-2 rounded">Spend Analytics</div>
                          <div className="bg-white p-2 rounded">Optimization</div>
                          <div className="bg-white p-2 rounded">SQL Interface</div>
                        </div>
                      </div>
                      
                      {/* Engine Layer */}
                      <div className="bg-purple-100 p-4 rounded border">
                        <div className="font-medium text-purple-800 mb-2">Analytics Engine</div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-white p-2 rounded">DuckDB SQL Engine</div>
                          <div className="bg-white p-2 rounded">Local Data Cache</div>
                          <div className="bg-white p-2 rounded">S3 Data Manager</div>
                        </div>
                      </div>
                      
                      {/* Data Sources */}
                      <div className="bg-yellow-100 p-4 rounded border">
                        <div className="font-medium text-yellow-800 mb-2">Data Sources</div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-white p-2 rounded">AWS CUR 2.0</div>
                          <div className="bg-white p-2 rounded">FOCUS 1.0</div>
                          <div className="bg-white p-2 rounded">Pricing API</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Benefits:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded border-l-4 border-l-green-400">
                      <div className="font-medium text-green-800">Cost Optimization</div>
                      <div className="text-sm text-green-700">Local caching reduces S3 query costs by 90%+</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded border-l-4 border-l-blue-400">
                      <div className="font-medium text-blue-800">High Performance</div>
                      <div className="text-sm text-blue-700">DuckDB engine for fast SQL analytics</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded border-l-4 border-l-purple-400">
                      <div className="font-medium text-purple-800">Modular Design</div>
                      <div className="text-sm text-purple-700">Independent analytics modules with REST API</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Prerequisites */}
          <section id="prerequisites" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Settings className="h-7 w-7" />
              Prerequisites & Environment
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    System Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Backend Environment</h4>
                      <div className="text-sm space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Python 3.8+ installed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>pip package manager</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>4GB+ RAM (8GB recommended)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>10GB+ free disk space for data caching</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">AWS Requirements</h4>
                      <div className="text-sm space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                          <span>AWS credentials configured</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                          <span>S3 bucket with CUR data exports</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                          <span>Read access to S3 bucket</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                          <span>CUR 2.0 or FOCUS 1.0 data format</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    AWS Credentials Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Configure AWS credentials using one of these methods:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded">
                      <h4 className="font-semibold mb-2">Method 1: AWS CLI</h4>
                      <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
aws configure<br/>
# Enter your AWS Access Key ID<br/>
# Enter your AWS Secret Access Key<br/>
# Enter your default region
                      </pre>
                    </div>
                    
                    <div className="bg-muted p-4 rounded">
                      <h4 className="font-semibold mb-2">Method 2: Environment Variables</h4>
                      <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
export AWS_ACCESS_KEY_ID=your_key<br/>
export AWS_SECRET_ACCESS_KEY=your_secret<br/>
export AWS_DEFAULT_REGION=us-east-1
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Installation */}
          <section id="installation" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 px-3 py-1">1</Badge>
              Backend Installation
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clone and Install Infralyzer</CardTitle>
                  <CardDescription>
                    Get the de-polars package and install dependencies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">1.1</Badge>
                      <div className="space-y-2">
                        <p className="font-medium">Clone the Repository</p>
                        <div className="bg-muted p-3 rounded">
                          <pre className="text-sm">
<span className="text-muted-foreground"># Clone the repository</span><br/>
git clone &lt;repository-url&gt; infralyzer<br/>
cd infralyzer/de-polars
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">1.2</Badge>
                      <div className="space-y-2">
                        <p className="font-medium">Install Dependencies</p>
                        <div className="bg-muted p-3 rounded">
                          <pre className="text-sm">
<span className="text-muted-foreground"># Install Python dependencies</span><br/>
pip install -r requirements.txt<br/><br/>
<span className="text-muted-foreground"># Install the package in development mode</span><br/>
pip install -e .
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">1.3</Badge>
                      <div className="space-y-2">
                        <p className="font-medium">Verify Installation</p>
                        <div className="bg-muted p-3 rounded">
                          <pre className="text-sm">
<span className="text-muted-foreground"># Test the installation</span><br/>
python -c "from de_polars import FinOpsEngine; print('✅ Installation successful')"
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Package className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Dependencies include:</strong> FastAPI, DuckDB, Polars, boto3, uvicorn for the web server.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Configuration */}
          <section id="configuration" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">2</Badge>
              Configuration Setup
            </h2>

            <Card>
              <CardHeader>
                <CardTitle>Environment Variables Configuration</CardTitle>
                <CardDescription>
                  Configure Infralyzer to connect to your AWS cost data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">2.1</Badge>
                    <div className="space-y-2">
                      <p className="font-medium">Create Environment Configuration</p>
                      <p className="text-sm text-muted-foreground">
                        Create a <code>.env</code> file or set environment variables for your cost data source.
                      </p>
                      <div className="bg-muted p-4 rounded">
                        <pre className="text-sm">
<span className="text-muted-foreground"># Required: S3 bucket with your cost data</span><br/>
export FINOPS_S3_BUCKET=my-cost-data-bucket<br/><br/>
<span className="text-muted-foreground"># Required: S3 prefix where CUR data is stored</span><br/>
export FINOPS_S3_PREFIX=cur2/cur2/data<br/><br/>
<span className="text-muted-foreground"># Data format (CUR2.0, FOCUS1.0, etc.)</span><br/>
export FINOPS_DATA_TYPE=CUR2.0<br/><br/>
<span className="text-muted-foreground"># Local data cache directory (for cost optimization)</span><br/>
export FINOPS_LOCAL_PATH=./local_data<br/><br/>
<span className="text-muted-foreground"># Table name for SQL queries</span><br/>
export FINOPS_TABLE_NAME=CUR
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">2.2</Badge>
                    <div className="space-y-2">
                      <p className="font-medium">Optional: Advanced Configuration</p>
                      <div className="bg-muted p-4 rounded">
                        <pre className="text-sm">
<span className="text-muted-foreground"># Enable AWS Pricing API for real-time rates</span><br/>
export FINOPS_ENABLE_PRICING_API=true<br/><br/>
<span className="text-muted-foreground"># Enable Savings Plans API</span><br/>
export FINOPS_ENABLE_SAVINGS_API=true<br/><br/>
<span className="text-muted-foreground"># Prefer local data over S3 (cost optimization)</span><br/>
export FINOPS_PREFER_LOCAL=true
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <HardDrive className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Cost Optimization:</strong> Setting up local data caching can reduce S3 query costs by 90%+. 
                    The initial download takes time but provides significant cost savings for repeated queries.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* Data Setup */}
          <section id="data-setup" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Badge className="bg-purple-100 text-purple-800 px-3 py-1">3</Badge>
              Data Source Configuration
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Set Up Local Data Caching (Recommended)</CardTitle>
                  <CardDescription>
                    Download your cost data locally to dramatically reduce S3 query costs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">3.1</Badge>
                      <div className="space-y-2">
                        <p className="font-medium">One-Time Data Download</p>
                        <p className="text-sm text-muted-foreground">
                          This downloads your S3 cost data locally. Recommended for production use.
                        </p>
                        <div className="bg-muted p-4 rounded">
                          <pre className="text-sm">
<span className="text-muted-foreground"># Python script to download data locally</span><br/>
python -c "<br/>
from de_polars import FinOpsEngine, DataConfig, DataExportType<br/>
<br/>
# Create configuration<br/>
config = DataConfig(<br/>
    s3_bucket='my-cost-data-bucket',<br/>
    s3_data_prefix='cur2/cur2/data',<br/>
    data_export_type=DataExportType.CUR_2_0,<br/>
    local_data_path='./local_data',<br/>
    prefer_local_data=True<br/>
)<br/>
<br/>
# Initialize and download<br/>
engine = FinOpsEngine(config)<br/>
engine.download_data_locally()<br/>
print('✅ Data download complete!')<br/>
"
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">3.2</Badge>
                      <div className="space-y-2">
                        <p className="font-medium">Quick Start Script</p>
                        <p className="text-sm text-muted-foreground">
                          Use the provided quick start script for guided setup.
                        </p>
                        <div className="bg-muted p-4 rounded">
                          <pre className="text-sm">
<span className="text-muted-foreground"># Run the guided setup script</span><br/>
python start_api.py
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Performance Note:</strong> Initial data download may take 10-30 minutes depending on your data size, 
                      but subsequent queries will be extremely fast and cost-effective.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Deployment */}
          <section id="deployment" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Badge className="bg-orange-100 text-orange-800 px-3 py-1">4</Badge>
              Start the Platform
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Launch FastAPI Backend</CardTitle>
                  <CardDescription>
                    Start the Infralyzer API server with REST endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Development Mode
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        For development with auto-reload on file changes.
                      </p>
                      <div className="bg-muted p-3 rounded">
                        <pre className="text-sm">
<span className="text-muted-foreground"># Start development server</span><br/>
uvicorn main:app --reload --host 0.0.0.0 --port 8000
                        </pre>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        Production Mode
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        For production deployment with multiple workers.
                      </p>
                      <div className="bg-muted p-3 rounded">
                        <pre className="text-sm">
<span className="text-muted-foreground"># Start production server</span><br/>
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
                        </pre>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>API Documentation:</strong> Once started, visit <code>http://localhost:8000/docs</code> for 
                      interactive API documentation and <code>http://localhost:8000/health</code> for health checks.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available API Endpoints</CardTitle>
                  <CardDescription>
                    Your Infralyzer platform provides these REST API endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Core Analytics</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <code>/api/v1/finops/kpi/summary</code> - KPI dashboard
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <code>/api/v1/finops/spend/trends</code> - Spend analytics
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <code>/api/v1/finops/optimization/idle</code> - Optimization
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Advanced Features</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                          <code>/api/v1/finops/sql/query</code> - Custom SQL queries
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                          <code>/api/v1/finops/ai/recommendations</code> - AI insights
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                          <code>/api/v1/finops/allocation/cost-centers</code> - Cost allocation
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Frontend Integration */}
          <section id="frontend" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1">5</Badge>
              Frontend Integration
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connect Frontend to Backend</CardTitle>
                  <CardDescription>
                    Configure the Next.js frontend to use your Infralyzer backend API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">5.1</Badge>
                      <div className="space-y-2">
                        <p className="font-medium">Frontend Environment Configuration</p>
                        <p className="text-sm text-muted-foreground">
                          Update your Next.js frontend to point to the Infralyzer backend.
                        </p>
                        <div className="bg-muted p-4 rounded">
                          <pre className="text-sm">
<span className="text-muted-foreground"># In your .env.local file for the Next.js app</span><br/>
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000<br/>
NEXT_PUBLIC_BACKEND_TYPE=infralyzer
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">5.2</Badge>
                      <div className="space-y-2">
                        <p className="font-medium">Start Frontend Development Server</p>
                        <div className="bg-muted p-4 rounded">
                          <pre className="text-sm">
<span className="text-muted-foreground"># Navigate to frontend directory</span><br/>
cd ../infralyzer_app<br/><br/>
<span className="text-muted-foreground"># Install dependencies</span><br/>
npm install<br/><br/>
<span className="text-muted-foreground"># Start development server</span><br/>
npm run dev
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">5.3</Badge>
                      <div className="space-y-2">
                        <p className="font-medium">Access Your Platform</p>
                        <div className="space-y-2">
                          <div className="bg-green-50 p-3 rounded border-l-4 border-l-green-400">
                            <div className="font-medium text-green-800">Frontend Dashboard</div>
                            <div className="text-sm text-green-700">http://localhost:3000</div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded border-l-4 border-l-blue-400">
                            <div className="font-medium text-blue-800">Backend API Docs</div>
                            <div className="text-sm text-blue-700">http://localhost:8000/docs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Verification */}
          <section id="verification" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle className="h-7 w-7" />
              Verification & Testing
            </h2>

            <Card>
              <CardHeader>
                <CardTitle>Verify Your Deployment</CardTitle>
                <CardDescription>
                  Test that all components are working correctly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">✅ Backend Health Checks</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>API server responding at :8000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Health endpoint returns 200 OK</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Database connection established</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Local data cache accessible</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">✅ Frontend Integration</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Dashboard loading cost data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>SQL Lab executing queries</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Analytics pages functional</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>API endpoints responding</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quick Test:</strong> Try running a simple query in SQL Lab: 
                    <code>SELECT COUNT(*) FROM CUR</code> to verify data connectivity.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* Next Steps */}
          <section id="next-steps" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <ArrowRight className="h-7 w-7" />
              Next Steps
            </h2>

            <Card>
              <CardHeader>
                <CardTitle>Start Using Infralyzer</CardTitle>
                <CardDescription>
                  Explore the platform features and begin optimizing your cloud costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Immediate Actions</h4>
                    <div className="space-y-3">
                      <Button asChild className="w-full justify-start">
                        <Link href="/login">
                          <Monitor className="h-4 w-4 mr-2" />
                          Access Your Dashboard
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/instance-rate-card">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Explore Instance Rate Card
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Advanced Features</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Set up automated data refreshes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Configure cost allocation tags</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Enable AI recommendations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Create custom SQL analytics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
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
                Python-based FinOps platform with DuckDB analytics engine and local data caching for cost optimization.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Setup Guide</h4>
              <div className="space-y-2 text-sm">
                <Link href="#installation" className="text-muted-foreground hover:text-foreground">
                  Installation
                </Link>
                <Link href="#configuration" className="text-muted-foreground hover:text-foreground">
                  Configuration
                </Link>
                <Link href="#deployment" className="text-muted-foreground hover:text-foreground">
                  Deployment
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">API Resources</h4>
              <div className="space-y-2 text-sm">
                <a href="http://localhost:8000/docs" className="text-muted-foreground hover:text-foreground">
                  API Documentation
                </a>
                <a href="http://localhost:8000/health" className="text-muted-foreground hover:text-foreground">
                  Health Check
                </a>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Support
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Components</h4>
              <div className="space-y-2 text-sm">
                <span className="text-muted-foreground">de-polars Library</span>
                <span className="text-muted-foreground">DuckDB Engine</span>
                <span className="text-muted-foreground">FastAPI Backend</span>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Infralyzer. Built on de-polars FinOps analytics platform.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
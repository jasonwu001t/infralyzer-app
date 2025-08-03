import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration - In production, this would connect to your Python backend
const mockInstanceData = [
  {
    instance_type: "t3.micro",
    metadata: {
      vcpu: "2",
      memory: "1 GiB",
      storage: "EBS only",
      network_performance: "Up to 5 Gigabit"
    },
    pricing: {
      ondemand: { hourly_price: 0.0104, monthly_price: 7.488, savings_vs_ondemand_pct: 0 },
      spot: { hourly_price: 0.0031, monthly_price: 2.232, savings_vs_ondemand_pct: 70.2 },
      reserved_1yr: { hourly_price: 0.007, monthly_price: 5.04, savings_vs_ondemand_pct: 32.7 },
      savings_plan: { hourly_price: 0.0075, monthly_price: 5.4, savings_vs_ondemand_pct: 27.9 }
    }
  },
  {
    instance_type: "t3.small",
    metadata: {
      vcpu: "2",
      memory: "2 GiB", 
      storage: "EBS only",
      network_performance: "Up to 5 Gigabit"
    },
    pricing: {
      ondemand: { hourly_price: 0.0208, monthly_price: 14.976, savings_vs_ondemand_pct: 0 },
      spot: { hourly_price: 0.0062, monthly_price: 4.464, savings_vs_ondemand_pct: 70.2 },
      reserved_1yr: { hourly_price: 0.014, monthly_price: 10.08, savings_vs_ondemand_pct: 32.7 },
      savings_plan: { hourly_price: 0.015, monthly_price: 10.8, savings_vs_ondemand_pct: 27.9 }
    }
  },
  {
    instance_type: "t3.medium",
    metadata: {
      vcpu: "2",
      memory: "4 GiB",
      storage: "EBS only", 
      network_performance: "Up to 5 Gigabit"
    },
    pricing: {
      ondemand: { hourly_price: 0.0416, monthly_price: 29.952, savings_vs_ondemand_pct: 0 },
      spot: { hourly_price: 0.0125, monthly_price: 9.0, savings_vs_ondemand_pct: 70.0 },
      reserved_1yr: { hourly_price: 0.028, monthly_price: 20.16, savings_vs_ondemand_pct: 32.7 },
      savings_plan: { hourly_price: 0.030, monthly_price: 21.6, savings_vs_ondemand_pct: 27.9 }
    }
  },
  {
    instance_type: "c5.large",
    metadata: {
      vcpu: "2",
      memory: "4 GiB",
      storage: "EBS only",
      network_performance: "Up to 10 Gigabit"
    },
    pricing: {
      ondemand: { hourly_price: 0.085, monthly_price: 61.2, savings_vs_ondemand_pct: 0 },
      spot: { hourly_price: 0.0255, monthly_price: 18.36, savings_vs_ondemand_pct: 70.0 },
      reserved_1yr: { hourly_price: 0.057, monthly_price: 41.04, savings_vs_ondemand_pct: 32.9 },
      savings_plan: { hourly_price: 0.061, monthly_price: 43.92, savings_vs_ondemand_pct: 28.2 }
    }
  },
  {
    instance_type: "c5.xlarge", 
    metadata: {
      vcpu: "4",
      memory: "8 GiB",
      storage: "EBS only",
      network_performance: "Up to 10 Gigabit"
    },
    pricing: {
      ondemand: { hourly_price: 0.17, monthly_price: 122.4, savings_vs_ondemand_pct: 0 },
      spot: { hourly_price: 0.051, monthly_price: 36.72, savings_vs_ondemand_pct: 70.0 },
      reserved_1yr: { hourly_price: 0.114, monthly_price: 82.08, savings_vs_ondemand_pct: 32.9 },
      savings_plan: { hourly_price: 0.122, monthly_price: 87.84, savings_vs_ondemand_pct: 28.2 }
    }
  },
  {
    instance_type: "m5.large",
    metadata: {
      vcpu: "2", 
      memory: "8 GiB",
      storage: "EBS only",
      network_performance: "Up to 10 Gigabit"
    },
    pricing: {
      ondemand: { hourly_price: 0.096, monthly_price: 69.12, savings_vs_ondemand_pct: 0 },
      spot: { hourly_price: 0.0288, monthly_price: 20.736, savings_vs_ondemand_pct: 70.0 },
      reserved_1yr: { hourly_price: 0.0648, monthly_price: 46.656, savings_vs_ondemand_pct: 32.5 },
      savings_plan: { hourly_price: 0.0691, monthly_price: 49.752, savings_vs_ondemand_pct: 28.0 }
    }
  },
  {
    instance_type: "m5.xlarge",
    metadata: {
      vcpu: "4",
      memory: "16 GiB", 
      storage: "EBS only",
      network_performance: "Up to 10 Gigabit"
    },
    pricing: {
      ondemand: { hourly_price: 0.192, monthly_price: 138.24, savings_vs_ondemand_pct: 0 },
      spot: { hourly_price: 0.0576, monthly_price: 41.472, savings_vs_ondemand_pct: 70.0 },
      reserved_1yr: { hourly_price: 0.1296, monthly_price: 93.312, savings_vs_ondemand_pct: 32.5 },
      savings_plan: { hourly_price: 0.1382, monthly_price: 99.504, savings_vs_ondemand_pct: 28.0 }
    }
  },
  {
    instance_type: "r5.large",
    metadata: {
      vcpu: "2",
      memory: "16 GiB",
      storage: "EBS only",
      network_performance: "Up to 10 Gigabit"
    },
    pricing: {
      ondemand: { hourly_price: 0.126, monthly_price: 90.72, savings_vs_ondemand_pct: 0 },
      spot: { hourly_price: 0.0378, monthly_price: 27.216, savings_vs_ondemand_pct: 70.0 },
      reserved_1yr: { hourly_price: 0.085, monthly_price: 61.2, savings_vs_ondemand_pct: 32.5 },
      savings_plan: { hourly_price: 0.091, monthly_price: 65.52, savings_vs_ondemand_pct: 27.8 }
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region') || 'us-east-1'
    const operatingSystem = searchParams.get('os') || 'Linux'
    const instanceTypes = searchParams.get('instances')?.split(',') || []

    // In production, you would use the Python backend:
    // const response = await fetch(`http://your-python-backend/api/pricing?region=${region}&os=${operatingSystem}`)
    // const data = await response.json()

    // For now, return mock data with some filtering
    let data = mockInstanceData
    
    if (instanceTypes.length > 0) {
      data = mockInstanceData.filter(item => 
        instanceTypes.includes(item.instance_type)
      )
    }

    // Simulate region-based pricing variations
    if (region !== 'us-east-1') {
      data = data.map(item => ({
        ...item,
        pricing: {
          ...item.pricing,
          ondemand: {
            ...item.pricing.ondemand,
            hourly_price: item.pricing.ondemand.hourly_price * 1.1, // 10% markup for other regions
            monthly_price: item.pricing.ondemand.monthly_price * 1.1
          }
        }
      }))
    }

    return NextResponse.json({
      success: true,
      data: data,
      region: region,
      operating_system: operatingSystem,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AWS Pricing API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch pricing data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { instance_types = [], region = 'us-east-1', operating_system = 'Linux' } = body

    // Filter data based on request
    let data = mockInstanceData
    
    if (instance_types.length > 0) {
      data = mockInstanceData.filter(item => 
        instance_types.includes(item.instance_type)
      )
    }

    return NextResponse.json({
      success: true,
      data: data,
      region: region,
      operating_system: operating_system,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AWS Pricing API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch pricing data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
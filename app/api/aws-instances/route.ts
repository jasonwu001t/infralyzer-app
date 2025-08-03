import { NextRequest, NextResponse } from 'next/server'

// Mock instance metadata - In production, this would come from your Python backend
const instanceMetadata = {
  "t3.nano": { vcpu: "2", memory: "0.5 GiB", storage: "EBS only", network_performance: "Up to 5 Gigabit", instance_family: "t3" },
  "t3.micro": { vcpu: "2", memory: "1 GiB", storage: "EBS only", network_performance: "Up to 5 Gigabit", instance_family: "t3" },
  "t3.small": { vcpu: "2", memory: "2 GiB", storage: "EBS only", network_performance: "Up to 5 Gigabit", instance_family: "t3" },
  "t3.medium": { vcpu: "2", memory: "4 GiB", storage: "EBS only", network_performance: "Up to 5 Gigabit", instance_family: "t3" },
  "t3.large": { vcpu: "2", memory: "8 GiB", storage: "EBS only", network_performance: "Up to 5 Gigabit", instance_family: "t3" },
  "t3.xlarge": { vcpu: "4", memory: "16 GiB", storage: "EBS only", network_performance: "Up to 5 Gigabit", instance_family: "t3" },
  "t3.2xlarge": { vcpu: "8", memory: "32 GiB", storage: "EBS only", network_performance: "Up to 5 Gigabit", instance_family: "t3" },
  
  "c5.large": { vcpu: "2", memory: "4 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "c5" },
  "c5.xlarge": { vcpu: "4", memory: "8 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "c5" },
  "c5.2xlarge": { vcpu: "8", memory: "16 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "c5" },
  "c5.4xlarge": { vcpu: "16", memory: "32 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "c5" },
  "c5.9xlarge": { vcpu: "36", memory: "72 GiB", storage: "EBS only", network_performance: "10 Gigabit", instance_family: "c5" },
  "c5.18xlarge": { vcpu: "72", memory: "144 GiB", storage: "EBS only", network_performance: "25 Gigabit", instance_family: "c5" },
  
  "m5.large": { vcpu: "2", memory: "8 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "m5" },
  "m5.xlarge": { vcpu: "4", memory: "16 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "m5" },
  "m5.2xlarge": { vcpu: "8", memory: "32 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "m5" },
  "m5.4xlarge": { vcpu: "16", memory: "64 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "m5" },
  "m5.8xlarge": { vcpu: "32", memory: "128 GiB", storage: "EBS only", network_performance: "10 Gigabit", instance_family: "m5" },
  "m5.16xlarge": { vcpu: "64", memory: "256 GiB", storage: "EBS only", network_performance: "20 Gigabit", instance_family: "m5" },
  
  "r5.large": { vcpu: "2", memory: "16 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "r5" },
  "r5.xlarge": { vcpu: "4", memory: "32 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "r5" },
  "r5.2xlarge": { vcpu: "8", memory: "64 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "r5" },
  "r5.4xlarge": { vcpu: "16", memory: "128 GiB", storage: "EBS only", network_performance: "Up to 10 Gigabit", instance_family: "r5" },
  "r5.8xlarge": { vcpu: "32", memory: "256 GiB", storage: "EBS only", network_performance: "10 Gigabit", instance_family: "r5" },
  "r5.16xlarge": { vcpu: "64", memory: "512 GiB", storage: "EBS only", network_performance: "20 Gigabit", instance_family: "r5" }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const instanceType = searchParams.get('type')
    const family = searchParams.get('family')

    if (instanceType) {
      // Return specific instance metadata
      const metadata = instanceMetadata[instanceType as keyof typeof instanceMetadata]
      if (!metadata) {
        return NextResponse.json(
          { success: false, error: 'Instance type not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: {
          instance_type: instanceType,
          ...metadata
        }
      })
    }

    if (family) {
      // Return all instances in a family
      const familyInstances = Object.entries(instanceMetadata)
        .filter(([type, meta]) => meta.instance_family === family)
        .map(([type, meta]) => ({
          instance_type: type,
          ...meta
        }))

      return NextResponse.json({
        success: true,
        data: familyInstances
      })
    }

    // Return all instances
    const allInstances = Object.entries(instanceMetadata).map(([type, meta]) => ({
      instance_type: type,
      ...meta
    }))

    return NextResponse.json({
      success: true,
      data: allInstances
    })

  } catch (error) {
    console.error('AWS Instances API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch instance data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get popular/recommended instances
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category = 'all', limit = 20 } = body

    let filteredInstances = Object.entries(instanceMetadata)

    // Filter by category if specified
    if (category !== 'all') {
      const categoryMap: Record<string, string[]> = {
        'general': ['t3', 'm5'],
        'compute': ['c5'],
        'memory': ['r5'],
        'burstable': ['t3']
      }
      
      const families = categoryMap[category] || []
      filteredInstances = filteredInstances.filter(([type, meta]) => 
        families.includes(meta.instance_family)
      )
    }

    // Limit results
    const limitedInstances = filteredInstances.slice(0, limit).map(([type, meta]) => ({
      instance_type: type,
      ...meta
    }))

    return NextResponse.json({
      success: true,
      data: limitedInstances,
      category,
      total: filteredInstances.length
    })

  } catch (error) {
    console.error('AWS Instances API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch instance data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
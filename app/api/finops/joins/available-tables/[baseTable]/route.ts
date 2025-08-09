import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ baseTable: string }> }
) {
  try {
    const { baseTable } = await params
    
    // Get backend URL from environment
    const backendApiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
    
    // Get API key if available
    const finopsApiKey = process.env.FINOPS_API_KEY
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (finopsApiKey) {
      headers['Authorization'] = `Bearer ${finopsApiKey}`
    }
    
    console.log('Join Tables API Route: Received request for base table:', baseTable)
    
    // Forward request to backend
    const backendUrl = `${backendApiUrl}/api/v1/finops/joins/available-tables/${baseTable}`
    console.log('Join Tables API Route: Forwarding to backend:', backendUrl)
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: headers,
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Join Tables API Route: Backend error:', response.status, errorText)
      return NextResponse.json(
        { 
          success: false, 
          error: `Backend join tables API error: ${response.status} - ${errorText}` 
        }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('Join Tables API Route: Backend response received successfully')
    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('Join Tables API Route Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch joinable tables' 
      }, 
      { status: 500 }
    )
  }
}

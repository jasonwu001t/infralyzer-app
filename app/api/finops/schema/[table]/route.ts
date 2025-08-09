import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table: tableName } = await params
    
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
    
    // Forward request to backend
    const response = await fetch(`${backendApiUrl}/api/v1/finops/schema/${tableName}`, {
      method: 'GET',
      headers: headers,
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API schema error:', response.status, errorText)
      return NextResponse.json(
        { 
          success: false, 
          error: `Backend schema API error: ${response.status} - ${errorText}` 
        }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('Schema API Route Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch schema' 
      }, 
      { status: 500 }
    )
  }
}

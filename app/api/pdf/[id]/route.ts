import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url)
    const scheduleData = url.searchParams.get('scheduleData')
    
    if (!scheduleData) {
      return new NextResponse('No schedule data provided', { status: 400 })
    }

    const pythonScript = path.join(process.cwd(), 'app/api/pdf/generate_pdf.py')
    const decodedData = decodeURIComponent(scheduleData)
    
    console.log('Sending data to Python:', decodedData)
    
    const pythonProcess = spawn('python', [pythonScript, decodedData])
    const chunks: Buffer[] = []
    const errorChunks: Buffer[] = []

    return new Promise<Response>((resolve) => {
      pythonProcess.stdout.on('data', (data) => chunks.push(Buffer.from(data)))
      pythonProcess.stderr.on('data', (data) => {
        console.log('Python stderr:', data.toString())
        errorChunks.push(Buffer.from(data))
      })
      
      pythonProcess.on('close', (code) => {
        if (code !== 0 || chunks.length === 0) {
          const errorMessage = Buffer.concat(errorChunks).toString()
          console.error('PDF Generation failed:', errorMessage)
          resolve(new NextResponse(`PDF generation failed: ${errorMessage}`, { status: 500 }))
          return
        }

        const pdfBuffer = Buffer.concat(chunks)
        console.log('Generated PDF size:', pdfBuffer.length)
        
        resolve(new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="schedule.pdf"',
            'Content-Length': pdfBuffer.length.toString(),
          },
        }))
      })
    })
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
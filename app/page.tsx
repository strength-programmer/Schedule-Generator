'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Schedule } from '@/types'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const savedSchedules = localStorage.getItem('schedules')
      if (savedSchedules) {
        setSchedules(JSON.parse(savedSchedules))
      }
    } catch (error) {
      console.error('Error loading schedules:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteSchedule = (id: string) => {
    const updatedSchedules = schedules.filter(schedule => schedule.id !== id)
    setSchedules(updatedSchedules)
    localStorage.setItem('schedules', JSON.stringify(updatedSchedules))
  }

  const downloadPDF = async (schedule: Schedule) => {
    try {
      // Show loading state
      const button = document.querySelector(`button[data-schedule-id="${schedule.id}"]`)
      if (button) button.textContent = 'Generating...'

      const scheduleData = encodeURIComponent(JSON.stringify(schedule))
      const response = await fetch(`/api/pdf/${schedule.id}?scheduleData=${scheduleData}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to generate PDF: ${errorText}`)
      }

      // Create a blob from the PDF stream
      const blob = await response.blob()
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty')
      }
      
      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${schedule.title}-schedule.pdf`
      
      // Append to document, click, and cleanup
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error('Error downloading PDF:', error)
      alert(`Failed to download PDF: ${error.message}`)
    } finally {
      // Reset button text
      const button = document.querySelector(`button[data-schedule-id="${schedule.id}"]`)
      if (button) button.textContent = 'Download PDF'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <p>Loading schedules...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Schedules</h1>
        <Button onClick={() => router.push('/schedule/new')}>Create New Schedule</Button>
      </div>
      {schedules.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No schedules yet. Create your first schedule!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{schedule.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  {schedule.activities.length} activities
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/schedule/${schedule.id}`)}
                  >
                    View/Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadPDF(schedule)}
                    data-schedule-id={schedule.id}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteSchedule(schedule.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 
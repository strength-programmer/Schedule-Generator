'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Schedule } from '@/types'
import { useRouter } from 'next/navigation'
import { jsPDF } from "jspdf";

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
      const doc = new jsPDF();
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      
      // Set title
      doc.setFontSize(20);
      doc.text(schedule.title, 10, margin);
      
      let yPosition = margin + 20; // Start after title
      
      // Iterate through each day
      daysOfWeek.forEach((day) => {
        const dayActivities = schedule.activities.filter((activity) => 
          activity.days.includes(day)
        );
        
        if (dayActivities.length > 0) {
          // Check if we need a new page for the day section
          if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = margin;
          }

          // Add day header
          doc.setFontSize(16);
          doc.text(day, 10, yPosition);
          yPosition += 10;
          
          // Sort activities by start time
          const sortedActivities = dayActivities.sort((a, b) => 
            a.startTime.localeCompare(b.startTime)
          );
          
          // Add activities for this day
          doc.setFontSize(12);
          sortedActivities.forEach((activity) => {
            // Calculate required height for this activity
            const activityHeight = activity.venue ? 21 : 14; // Base height + venue if present

            // Check if we need a new page for this activity
            if (yPosition + activityHeight > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }

            doc.text(`• ${activity.name} (${activity.category})`, 15, yPosition);
            yPosition += 7;
            doc.text(`  ${activity.startTime} - ${activity.endTime}`, 15, yPosition);
            yPosition += 7;
            if (activity.venue) {
              doc.text(`  Venue: ${activity.venue}`, 15, yPosition);
              yPosition += 7;
            }
            yPosition += 3; // Space between activities
          });
          
          yPosition += 10; // Space between days
        }
      });

      doc.save(`${schedule.title}-schedule.pdf`);
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      alert(`Failed to download PDF: ${error.message}`);
    }
  };

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
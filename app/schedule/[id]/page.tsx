'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { ScheduleForm } from '@/components/ScheduleForm'
import { ScheduleDisplay } from '@/components/ScheduleDisplay'
import { ScheduleTitle } from '@/components/ScheduleTitle'
import { Button } from '@/components/ui/button'
import { Activity, Schedule } from '@/types'

export default function ScheduleEditor({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  
  const [schedule, setSchedule] = useState<Schedule>(() => ({
    id: resolvedParams.id === 'new' ? uuidv4() : resolvedParams.id,
    title: 'New Schedule',
    activities: []
  }))

  useEffect(() => {
    if (resolvedParams.id !== 'new') {
      const savedSchedules = localStorage.getItem('schedules')
      if (savedSchedules) {
        const schedules: Schedule[] = JSON.parse(savedSchedules)
        const existingSchedule = schedules.find(s => s.id === resolvedParams.id)
        if (existingSchedule) {
          setSchedule(existingSchedule)
        }
      }
    }
  }, [resolvedParams.id])

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = { ...activity, id: uuidv4() }
    setSchedule(prev => ({ ...prev, activities: [...prev.activities, newActivity] }))
  }

  const editActivity = (updatedActivity: Activity) => {
    setSchedule(prev => ({
      ...prev,
      activities: prev.activities.map((activity) =>
        activity.id === updatedActivity.id ? updatedActivity : activity
      ),
    }))
  }

  const deleteActivity = (id: string) => {
    setSchedule(prev => ({
      ...prev,
      activities: prev.activities.filter((activity) => activity.id !== id),
    }))
  }

  const updateTitle = (newTitle: string) => {
    setSchedule(prev => ({ ...prev, title: newTitle }))
  }

  const saveSchedule = () => {
    const savedSchedules = localStorage.getItem('schedules')
    const schedules: Schedule[] = savedSchedules ? JSON.parse(savedSchedules) : []
    const existingIndex = schedules.findIndex(s => s.id === schedule.id)
    
    if (existingIndex >= 0) {
      schedules[existingIndex] = schedule
    } else {
      schedules.push(schedule)
    }
    
    localStorage.setItem('schedules', JSON.stringify(schedules))
    router.push('/')
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Schedule</h1>
        <div className="space-x-2">
          <Button onClick={() => router.push('/')}>Back to Home</Button>
          <Button onClick={saveSchedule}>Save Schedule</Button>
        </div>
      </div>
      <ScheduleTitle title={schedule.title} onUpdateTitle={updateTitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ScheduleForm onAddActivity={addActivity} />
      </div>
      <ScheduleDisplay
        activities={schedule.activities}
        onEditActivity={editActivity}
        onDeleteActivity={deleteActivity}
      />
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ScheduleForm } from './components/ScheduleForm'
import { ScheduleDisplay } from './components/ScheduleDisplay'
import { ScheduleTitle } from './components/ScheduleTitle'
import { SaveLoadButtons } from './components/SaveLoadButtons'
import { Activity, Schedule } from './types'

const defaultSchedule: Schedule = {
  id: uuidv4(),
  title: 'My Schedule',
  activities: []
}

export default function ScheduleMaker() {
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule)

  useEffect(() => {
    const savedSchedule = localStorage.getItem('schedule')
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule))
    }
  }, [])

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = { ...activity, id: uuidv4() }
    setSchedule({ ...schedule, activities: [...schedule.activities, newActivity] })
  }

  const editActivity = (updatedActivity: Activity) => {
    setSchedule({
      ...schedule,
      activities: schedule.activities.map((activity) =>
        activity.id === updatedActivity.id ? updatedActivity : activity
      ),
    })
  }

  const deleteActivity = (id: string) => {
    setSchedule({
      ...schedule,
      activities: schedule.activities.filter((activity) => activity.id !== id),
    })
  }

  const updateTitle = (newTitle: string) => {
    setSchedule({ ...schedule, title: newTitle })
  }

  const saveSchedule = () => {
    localStorage.setItem('schedule', JSON.stringify(schedule))
  }

  const loadSchedule = (loadedSchedule: Schedule) => {
    setSchedule(loadedSchedule)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Weekly Schedule Maker</h1>
      <ScheduleTitle title={schedule.title} onUpdateTitle={updateTitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ScheduleForm onAddActivity={addActivity} />
        <SaveLoadButtons onSave={saveSchedule} onLoad={loadSchedule} />
      </div>
      <ScheduleDisplay
        activities={schedule.activities}
        onEditActivity={editActivity}
        onDeleteActivity={deleteActivity}
      />
    </div>
  )
}


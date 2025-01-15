import { useState } from 'react'
import { Activity } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScheduleForm } from './ScheduleForm'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const categoryColors: { [key: string]: string } = {
  Work: 'bg-blue-500',
  Study: 'bg-green-500',
  Personal: 'bg-yellow-500',
  Health: 'bg-red-500',
  Social: 'bg-purple-500',
  Other: 'bg-gray-500',
}

export function ScheduleDisplay({
  activities,
  onEditActivity,
  onDeleteActivity,
}: {
  activities: Activity[]
  onEditActivity: (activity: Activity) => void
  onDeleteActivity: (id: string) => void
}) {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const sortedActivities = activities.sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {daysOfWeek.map((day) => (
        <Card key={day} className="w-full">
          <CardHeader>
            <CardTitle className="text-center">{day}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sortedActivities
              .filter((activity) => activity.days.includes(day))
              .map((activity) => (
                <div
                  key={activity.id}
                  className={`${categoryColors[activity.category]} text-white p-2 rounded-md text-sm`}
                >
                  <div className="font-semibold">{activity.name}</div>
                  <div>
                    {activity.startTime} - {activity.endTime}
                  </div>
                  {activity.venue && (
                    <div className="text-xs mt-1">
                      📍 {activity.venue}
                    </div>
                  )}
                  <div className="mt-1 flex justify-between">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingActivity(activity)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteActivity(activity.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
      <Dialog open={!!editingActivity} onOpenChange={(open) => {
        if (!open) setEditingActivity(null)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          {editingActivity && (
            <ScheduleForm
              initialActivity={editingActivity}
              onAddActivity={(updatedActivity) => {
                onEditActivity({ ...updatedActivity, id: editingActivity.id })
                setEditingActivity(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


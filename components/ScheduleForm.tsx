import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Activity } from '../types'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const categories = ['Work', 'Study', 'Personal', 'Health', 'Social', 'Other']

export function ScheduleForm({ onAddActivity }: { onAddActivity: (activity: Omit<Activity, 'id'>) => void }) {
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [category, setCategory] = useState('Other')
  const [venue, setVenue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && startTime && endTime && selectedDays.length > 0) {
      onAddActivity({ 
        name, 
        startTime, 
        endTime, 
        days: selectedDays, 
        category,
        venue
      })
      setName('')
      setStartTime('')
      setEndTime('')
      setSelectedDays([])
      setCategory('Other')
      setVenue('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Activity Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter activity name"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="venue">Venue</Label>
        <Input
          id="venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Enter location (optional)"
        />
      </div>
      <div>
        <Label>Days of the Week</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={day}
                checked={selectedDays.includes(day)}
                onCheckedChange={(checked) => {
                  setSelectedDays(
                    checked
                      ? [...selectedDays, day]
                      : selectedDays.filter((d) => d !== day)
                  )
                }}
              />
              <Label htmlFor={day}>{day}</Label>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit">Add Activity</Button>
    </form>
  )
}


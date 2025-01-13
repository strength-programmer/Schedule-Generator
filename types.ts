export interface Activity {
    id: string
    name: string
    startTime: string
    endTime: string
    days: string[]
    category: string
  }
  
  export interface Schedule {
    id: string
    title: string
    activities: Activity[]
  }
  
  export interface ScheduleStore {
    schedules: Schedule[]
    addSchedule: (schedule: Schedule) => void
    updateSchedule: (schedule: Schedule) => void
    deleteSchedule: (id: string) => void
    getSchedule: (id: string) => Schedule | undefined
  }
  
  
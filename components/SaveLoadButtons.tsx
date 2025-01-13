import { Button } from '@/components/ui/button'
import { Schedule } from '@/types'

export function SaveLoadButtons({
  onSave,
  onLoad,
}: {
  onSave: () => void
  onLoad: (schedule: Schedule) => void
}) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const schedule = JSON.parse(e.target?.result as string)
          onLoad(schedule)
        } catch (error) {
          console.error('Error parsing schedule file:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="flex gap-4">
      <Button onClick={onSave}>Save Schedule</Button>
      <div>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
          id="schedule-upload"
        />
        <label htmlFor="schedule-upload">
          <Button>Load Schedule</Button>
        </label>
      </div>
    </div>
  )
}


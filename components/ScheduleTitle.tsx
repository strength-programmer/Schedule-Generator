import { Input } from '@/components/ui/input'

export function ScheduleTitle({ 
  title, 
  onUpdateTitle 
}: { 
  title: string
  onUpdateTitle: (title: string) => void 
}) {
  return (
    <Input
      value={title}
      onChange={(e) => onUpdateTitle(e.target.value)}
      className="text-2xl font-bold mb-4 text-center"
    />
  )
}


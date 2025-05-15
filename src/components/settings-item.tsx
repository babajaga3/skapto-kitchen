import { ReactNode } from 'react'


export function SettingsItem({
  title,
  description,
  item
}: {
  title: string
  description: string
  item: ReactNode
}) {
  return (
    <div className="flex flex-row items-center gap-8">
      <div className="flex flex-col items-start">
        <h1 className="text-muted-foreground font-semibold">{title}</h1>
        <p className="text-base ">{description}</p>
      </div>
      <div>
        {item}
      </div>
    </div>
  )
}

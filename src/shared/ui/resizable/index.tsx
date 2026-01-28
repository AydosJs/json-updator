import {
  Group,
  Panel,
  Separator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
} from 'react-resizable-panels'
import { cn } from '@/shared/lib/utils'

function ResizablePanelGroup({
  className,
  ...props
}: GroupProps) {
  return (
    <Group
      className={cn(
        'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ className, ...props }: PanelProps) {
  return (
    <Panel
      className={cn(
        'min-w-0 overflow-hidden data-[panel-group-direction=vertical]:min-h-0',
        className
      )}
      {...props}
    />
  )
}

function ResizableHandle({
  withHandle = false,
  className,
  ...props
}: SeparatorProps & { withHandle?: boolean }) {
  return (
    <Separator
      className={cn(
        'relative flex w-px shrink-0 items-center justify-center border-0 bg-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-1 -after:translate-x-1/2 data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0',
        withHandle &&
          'before:absolute before:inset-0 before:bg-border before:opacity-0 hover:before:opacity-100 focus-visible:before:opacity-100 before:transition-opacity data-[panel-group-direction=vertical]:before:left-0 data-[panel-group-direction=vertical]:before:h-1 data-[panel-group-direction=vertical]:before:w-full data-[panel-group-direction=vertical]:before:-translate-y-1/2 data-[panel-group-direction=vertical]:before:translate-x-0',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 shrink-0 items-center justify-center rounded-sm border bg-border" />
      )}
    </Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

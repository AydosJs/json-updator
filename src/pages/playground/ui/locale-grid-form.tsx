import { useState } from 'react'
import { Download } from 'lucide-react'
import type { UseFormGetValues, UseFormRegister } from 'react-hook-form'
import { t } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/ui/resizable'
import { unflattenKeys } from '@/shared/lib/locale-table'

export type LocaleFormValues = { rows: Array<{ key: string; values: Array<string> }> }

function downloadJson(filename: string, json: string) {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

type LocaleGridFormProps = {
  register: UseFormRegister<LocaleFormValues>
  getValues: UseFormGetValues<LocaleFormValues>
  initialValues: LocaleFormValues
  tableColumnLabels: Array<string>
  columnFileNames: Array<string>
}

export function LocaleGridForm({
  register,
  getValues,
  initialValues,
  tableColumnLabels,
  columnFileNames,
}: LocaleGridFormProps) {
  const columnCount = tableColumnLabels.length
  const [fileNames, setFileNames] = useState<Array<string>>(() => columnFileNames)

  const handleDownloadColumn = (colIndex: number) => {
    const data = getValues()
    const flat: Record<string, string> = {}
    for (const row of data.rows) {
      flat[row.key] = row.values[colIndex] ?? ''
    }
    const nested = unflattenKeys(flat)
    const json = JSON.stringify(nested, null, 2)
    const name = fileNames[colIndex]?.trim() || columnFileNames[colIndex]
    downloadJson(name.endsWith('.json') ? name : `${name}.json`, json)
  }

  const setFileName = (colIndex: number, value: string) => {
    setFileNames((prev) => {
      const next = [...prev]
      next[colIndex] = value
      return next
    })
  }

  const localePanelDefaultSize = columnCount > 0 ? Math.floor(85 / columnCount) : 20

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="min-w-0 overflow-x-auto rounded-lg border border-white/10"
    >
      <ResizablePanelGroup orientation="horizontal" className="min-h-0">
        <ResizablePanel
          id="key"
          defaultSize={15}
          minSize={5}
          className="flex flex-col border-r border-white/10"
        >
          <div className="flex min-h-[48.9px] min-w-0 items-center overflow-x-auto border-b border-white/10 bg-muted/20 px-3 py-2 text-sm font-medium scrollbar-hide">
            <span className="whitespace-nowrap">{t('playground.key')}</span>
          </div>
          {initialValues.rows.map((row) => (
            <div
              key={row.key}
              className="scrollbar-hide min-w-0 overflow-x-auto border-b border-white/10 px-3 py-2 text-sm font-mono text-muted-foreground hover:bg-muted/10"
              title={row.key}
            >
              <span className="whitespace-nowrap">{row.key}</span>
            </div>
          ))}
        </ResizablePanel>
        <ResizableHandle withHandle />
        {columnFileNames.flatMap((_, colIndex) => [
          <ResizablePanel
            key={colIndex}
            id={`col-${colIndex}`}
            defaultSize={localePanelDefaultSize}
            minSize={5}
            className="flex flex-col border-r border-white/10"
          >
            <div className="flex min-h-[48.9px] min-w-0 items-center justify-between gap-2 border-b border-white/10 bg-muted/20 px-3 py-2 text-sm font-medium">
              <input
                type="text"
                value={fileNames[colIndex] ?? ''}
                onChange={(e) => setFileName(colIndex, e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-inherit outline-none focus:ring-0 focus:ring-offset-0"
                aria-label={t('playground.fileName')}
              />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="shrink-0 border-0"
                onClick={() => handleDownloadColumn(colIndex)}
                aria-label={`${t('playground.download')} ${fileNames[colIndex] ?? ''}`}
              >
                <Download />
              </Button>
            </div>
            {initialValues.rows.map((row, rowIndex) => (
              <div
                key={row.key}
                className="border-b border-white/10 hover:bg-muted/10"
              >
                <input
                  type="text"
                  className="w-full min-w-0 border-0 bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary/30"
                  {...register(`rows.${rowIndex}.values.${colIndex}`)}
                />
              </div>
            ))}
          </ResizablePanel>,
          ...(colIndex < columnFileNames.length - 1
            ? [<ResizableHandle key={`handle-${colIndex}`} withHandle />]
            : []),
        ])}
      </ResizablePanelGroup>
    </form>
  )
}

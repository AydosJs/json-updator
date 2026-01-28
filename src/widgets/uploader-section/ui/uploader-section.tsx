import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'
import { useUploadFiles } from '@/features/upload-files'
import { t } from '@/shared/lib/i18n'
import { cn } from '@/shared/lib/utils'

export function UploaderSection() {
  const {
    files,
    isDragging,
    setIsDragging,
    validateAndAddFiles,
    removeFile,
  } = useUploadFiles()

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      validateAndAddFiles(e.dataTransfer.files)
    },
    [setIsDragging, validateAndAddFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragging(true)
  }, [setIsDragging])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
  }, [setIsDragging])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateAndAddFiles(e.target.files)
      e.target.value = ''
    },
    [validateAndAddFiles]
  )

  const openFileInput = useCallback(() => {
    document.getElementById('file-input')?.click()
  }, [])

  const [isStarting, setIsStarting] = useState(false)
  const navigate = useNavigate()

  const handleStart = useCallback(async () => {
    const valid = files.filter((f) => !f.error)
    if (valid.length === 0) return
    setIsStarting(true)
    try {
      const localeFiles: Array<{ name: string; data: Record<string, unknown> }> = []
      for (const { file } of valid) {
        const text = await file.text()
        const data = JSON.parse(text) as Record<string, unknown>
        localeFiles.push({ name: file.name, data })
      }
      navigate({ to: '/playground', state: { localeFiles } })
    } catch {
      setIsStarting(false)
    }
  }, [files, navigate])

  return (
    <>
      <input
        id="file-input"
        type="file"
        accept=".json,application/json"
        multiple
        className="sr-only"
        onChange={handleInputChange}
        aria-label={t('uploader.browse')}
      />
      <div
        role="button"
        tabIndex={0}
        onDragEnter={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openFileInput()
          }
        }}
        className={cn(
          'cursor-pointer rounded-lg border-2 border-dashed border-border-medium bg-muted/30 px-6 py-10 text-center transition-colors',
          'hover:border-primary/40 hover:bg-muted/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isDragging && 'cursor-copy border-primary/70 bg-accent/50'
        )}
      >
        <p className="text-muted-foreground text-sm">{t('uploader.dropHint')}</p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={openFileInput}
        >
          {t('uploader.browse')}
        </Button>
      </div>

      {files.length > 0 && (
        <section className="mt-6" aria-label={t('uploader.filesSelected')}>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            {t('uploader.filesSelected')} ({files.length})
          </h2>
          <ul className="space-y-2">
            {files.map(({ file, error }, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 rounded-md bg-card/80 px-3 py-2 text-sm"
              >
                <span className="min-w-0 truncate font-medium" title={file.name}>
                  {file.name}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                {error && (
                  <span className="shrink-0 text-destructive text-xs" role="status">
                    {error}
                  </span>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={`${t('uploader.remove')} ${file.name}`}
                  onClick={() => removeFile(index)}
                >
                  {t('uploader.remove')}
                </Button>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 w-full cursor-pointer"
            onClick={openFileInput}
            aria-label={t('uploader.addMore')}
          >
            <Plus className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="default"
            size="lg"
            className="mt-4 w-full"
            onClick={handleStart}
            disabled={isStarting || files.some((f) => f.error)}
          >
            {isStarting ? '...' : t('uploader.start')}
          </Button>
        </section>
      )}
    </>
  )
}

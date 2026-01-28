import { useCallback, useState } from 'react'
import type { FileWithStatus } from '@/entities/file'
import { t } from '@/shared/lib/i18n'

export function useUploadFiles() {
  const [files, setFiles] = useState<Array<FileWithStatus>>([])
  const [isDragging, setIsDragging] = useState(false)

  const validateAndAddFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles?.length) return
    const append: Array<FileWithStatus> = []
    for (const file of Array.from(newFiles)) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        append.push({ file, error: t('uploader.invalidJson') })
        continue
      }
      append.push({ file })
    }
    setFiles((prev) => [...prev, ...append])
    append.forEach((item) => {
      if (item.error) return
      item.file.text().then(
        (text) => {
          try {
            JSON.parse(text)
          } catch {
            setFiles((prev) => {
              const i = prev.findIndex((f) => f.file === item.file)
              if (i === -1) return prev
              const next = [...prev]
              next[i] = { ...next[i], error: t('uploader.invalidJson') }
              return next
            })
          }
        },
        () => {
          setFiles((prev) => {
            const i = prev.findIndex((f) => f.file === item.file)
            if (i === -1) return prev
            const next = [...prev]
            next[i] = { ...next[i], error: t('uploader.invalidJson') }
            return next
          })
        }
      )
    })
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return {
    files,
    isDragging,
    setIsDragging,
    validateAndAddFiles,
    removeFile,
  }
}

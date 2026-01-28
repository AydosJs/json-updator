import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronUp } from 'lucide-react'
import { PlaygroundEmpty } from './playground-empty'
import { LocaleGridForm } from './locale-grid-form'
import type { LocaleFormValues } from './locale-grid-form'
import type { LocaleFile } from '@/shared/lib/locale-table'
import {
  flattenKeys,
  getAllKeys,
  getLocaleLabel,
} from '@/shared/lib/locale-table'
import { t } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'

const SCROLL_TO_TOP_THRESHOLD_PX = 400

const DEFAULT_LOCALE_FILENAME = 'locale.json'

function buildDefaultValues(
  localeFiles: Array<LocaleFile>,
  keys: Array<string>
): LocaleFormValues {
  const flatMaps = localeFiles.map((f) => flattenKeys(f.data))
  const rows = keys.map((key) => ({
    key,
    values: flatMaps.map((flat) => flat[key] ?? ''),
  }))
  return { rows }
}

type LocationState = { localeFiles?: Array<LocaleFile> }

export function PlaygroundPage() {
  const routerState = useRouterState()
  const localeFiles = (routerState.location.state as LocationState | undefined)
    ?.localeFiles

  const { initialValues, tableColumnLabels, columnFileNames } = useMemo((): {
    initialValues: LocaleFormValues
    tableColumnLabels: Array<string>
    columnFileNames: Array<string>
  } => {
    if (!localeFiles || localeFiles.length === 0) {
      return {
        initialValues: { rows: [] },
        tableColumnLabels: [],
        columnFileNames: [],
      }
    }
    const keys = getAllKeys(localeFiles)
    const values = buildDefaultValues(localeFiles, keys)
    const labels = localeFiles.map((f) => getLocaleLabel(f.name))
    const fileNames = localeFiles.map((f) => f.name || DEFAULT_LOCALE_FILENAME)
    return {
      initialValues: values,
      tableColumnLabels: labels,
      columnFileNames: fileNames,
    }
  }, [localeFiles])

  const { register, getValues } = useForm<LocaleFormValues>({
    defaultValues: initialValues,
  })

  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > SCROLL_TO_TOP_THRESHOLD_PX)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!localeFiles?.length) {
    return <PlaygroundEmpty />
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <Link
        to="/"
        className="mb-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        {t('playground.goBack')}
      </Link>

      <LocaleGridForm
        register={register}
        getValues={getValues}
        initialValues={initialValues}
        tableColumnLabels={tableColumnLabels}
        columnFileNames={columnFileNames}
      />
      {showScrollToTop && (
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="fixed bottom-6 right-6 rounded-full shadow-lg"
          onClick={scrollToTop}
          aria-label={t('playground.scrollToTop')}
        >
          <ChevronUp />
        </Button>
      )}
    </div>
  )
}

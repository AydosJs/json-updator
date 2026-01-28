import { t } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'

export function PlaygroundEmpty() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 px-4">
      <p className="text-muted-foreground text-center">
        {t('playground.noFiles')}
      </p>
      <Button asChild variant="outline">
        <a href="/">{t('playground.goBack')}</a>
      </Button>
    </div>
  )
}

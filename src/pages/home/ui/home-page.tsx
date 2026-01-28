import { UploaderSection } from '@/widgets/uploader-section'
import { ExampleFormats } from '@/widgets/example-formats'
import { t } from '@/shared/lib/i18n'

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t('uploader.title')}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base">
            {t('uploader.description')}
          </p>
        </header>

        <UploaderSection />
      </main>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <ExampleFormats />
      </div>
    </div>
  )
}

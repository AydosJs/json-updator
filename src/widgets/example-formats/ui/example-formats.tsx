import { t } from '@/shared/lib/i18n'
import { JsonSyntax } from '@/shared/lib/json-syntax'
import { exampleSnippets } from '@/shared/config/example-snippets'

export function ExampleFormats() {
  return (
    <section
      className="mt-12 border-t border-border pt-8 pb-10"
      aria-labelledby="example-title"
    >
      <h2
        id="example-title"
        className="mb-4 text-center text-sm font-medium text-muted-foreground"
      >
        {t('example.title')}
      </h2>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t('example.english')}
          </p>
          <pre className="scrollbar-hide overflow-x-auto rounded-md border border-border bg-muted/50 p-3 font-mono text-xs">
            <code><JsonSyntax>{exampleSnippets.en}</JsonSyntax></code>
          </pre>
        </div>
        <div>
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t('example.russian')}
          </p>
          <pre className="scrollbar-hide overflow-x-auto rounded-md border border-border bg-muted/50 p-3 font-mono text-xs">
            <code><JsonSyntax>{exampleSnippets.ru}</JsonSyntax></code>
          </pre>
        </div>
        <div>
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t('example.uzbek')}
          </p>
          <pre className="scrollbar-hide overflow-x-auto rounded-md border border-border bg-muted/50 p-3 font-mono text-xs">
            <code><JsonSyntax>{exampleSnippets.uz}</JsonSyntax></code>
          </pre>
        </div>
      </div>
    </section>
  )
}

import logo from './logo.svg'
import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-foreground text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p>
          Edit <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">src/App.tsx</code> and save to reload.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="default">
            <a
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href="https://tanstack.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn TanStack
            </a>
          </Button>
        </div>
      </header>
    </div>
  )
}

export default App

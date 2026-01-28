import type { ReactNode } from 'react'

type TokenType = 'key' | 'string' | 'number' | 'keyword' | 'bracket' | 'punctuation' | 'whitespace'

type Token = { type: TokenType; value: string }

function tokenize(json: string): Array<Token> {
  const tokens: Array<Token> = []
  let i = 0

  while (i < json.length) {
    const rest = json.slice(i)

    const ws = rest.match(/^\s+/)
    if (ws) {
      tokens.push({ type: 'whitespace', value: ws[0] })
      i += ws[0].length
      continue
    }

    if (rest[0] === '"') {
      let end = 1
      while (end < rest.length) {
        if (rest[end] === '\\') end += 2
        else if (rest[end] === '"') { end += 1; break }
        else end += 1
      }
      const value = rest.slice(0, end)
      const after = rest.slice(end).match(/^\s*:/)
      tokens.push({ type: after ? 'key' : 'string', value })
      i += end
      continue
    }

    const num = rest.match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/)
    if (num) {
      tokens.push({ type: 'number', value: num[0] })
      i += num[0].length
      continue
    }

    if (rest.startsWith('true') || rest.startsWith('false') || rest.startsWith('null')) {
      const word = rest.startsWith('true') ? 'true' : rest.startsWith('false') ? 'false' : 'null'
      tokens.push({ type: 'keyword', value: word })
      i += word.length
      continue
    }

    if ('{}[]'.includes(rest[0])) {
      tokens.push({ type: 'bracket', value: rest[0] })
      i += 1
      continue
    }

    if (rest[0] === ',' || rest[0] === ':') {
      tokens.push({ type: 'punctuation', value: rest[0] })
      i += 1
      continue
    }

    tokens.push({ type: 'punctuation', value: rest[0] })
    i += 1
  }

  return tokens
}

const tokenClasses: Record<Exclude<TokenType, 'whitespace'>, string> = {
  key: 'text-sky-400 dark:text-sky-400',
  string: 'text-emerald-600 dark:text-emerald-400',
  number: 'text-amber-600 dark:text-amber-400',
  keyword: 'text-violet-400 dark:text-violet-300',
  bracket: 'text-foreground/90',
  punctuation: 'text-muted-foreground',
}

export function JsonSyntax({ children }: { children: string }): ReactNode {
  const tokens = tokenize(children)
  return (
    <>
      {tokens.map((token, idx) => {
        if (token.type === 'whitespace') {
          return <span key={idx}>{token.value}</span>
        }
        return (
          <span key={idx} className={tokenClasses[token.type]}>
            {token.value}
          </span>
        )
      })}
    </>
  )
}

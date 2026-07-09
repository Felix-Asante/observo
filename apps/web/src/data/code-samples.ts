/**
 * Pre-tokenized code samples for the developer experience section.
 * Tokens map to syntax utility classes defined in the design system,
 * keeping rendering dependency-free (no runtime highlighter).
 */

export type CodeToken = {
  text: string
  tok?: 'kw' | 'fn' | 'str' | 'num' | 'key' | 'cm' | 'punct'
}

export type CodeLine = Array<CodeToken>

export type CodeSample = {
  id: string
  label: string
  install: string
  lines: Array<CodeLine>
}

export const codeSamples: Array<CodeSample> = [
  {
    id: 'node',
    label: 'Node.js',
    install: 'npm install @observo/sdk',
    lines: [
      [
        { text: 'import', tok: 'kw' },
        { text: ' { observo } ' },
        { text: 'from', tok: 'kw' },
        { text: ' ' },
        { text: "'@observo/sdk'", tok: 'str' },
      ],
      [],
      [
        { text: 'observo.', tok: 'key' },
        { text: 'init', tok: 'fn' },
        { text: '({ apiKey: ', tok: 'punct' },
        { text: 'process.env.OBSERVO_KEY' },
        { text: ' })', tok: 'punct' },
      ],
      [],
      [
        { text: 'observo.', tok: 'key' },
        { text: 'info', tok: 'fn' },
        { text: '(', tok: 'punct' },
        { text: "'checkout.completed'", tok: 'str' },
        { text: ', {', tok: 'punct' },
      ],
      [
        { text: '  orderId: ', tok: 'key' },
        { text: 'order.id' },
        { text: ',', tok: 'punct' },
      ],
      [
        { text: '  amount: ', tok: 'key' },
        { text: '4200', tok: 'num' },
        { text: ',', tok: 'punct' },
      ],
      [{ text: '})', tok: 'punct' }],
    ],
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    install: 'npm install @observo/next',
    lines: [
      [{ text: '// instrumentation.ts', tok: 'cm' }],
      [
        { text: 'import', tok: 'kw' },
        { text: ' { register } ' },
        { text: 'from', tok: 'kw' },
        { text: ' ' },
        { text: "'@observo/next'", tok: 'str' },
      ],
      [],
      [
        { text: 'export', tok: 'kw' },
        { text: ' ' },
        { text: 'const', tok: 'kw' },
        { text: ' onRequestError = ' },
        { text: 'register', tok: 'fn' },
        { text: '({', tok: 'punct' },
      ],
      [
        { text: '  apiKey: ', tok: 'key' },
        { text: 'process.env.OBSERVO_KEY' },
        { text: ',', tok: 'punct' },
      ],
      [
        { text: '  traces: ', tok: 'key' },
        { text: 'true', tok: 'num' },
        { text: ',', tok: 'punct' },
      ],
      [{ text: '})', tok: 'punct' }],
    ],
  },
  {
    id: 'python',
    label: 'Python',
    install: 'pip install observo',
    lines: [
      [{ text: 'import', tok: 'kw' }, { text: ' observo' }],
      [],
      [
        { text: 'observo.', tok: 'key' },
        { text: 'init', tok: 'fn' },
        { text: '(api_key=', tok: 'punct' },
        { text: 'os.environ', tok: 'key' },
        { text: '[', tok: 'punct' },
        { text: '"OBSERVO_KEY"', tok: 'str' },
        { text: '])', tok: 'punct' },
      ],
      [],
      [
        { text: 'observo.', tok: 'key' },
        { text: 'info', tok: 'fn' },
        { text: '(', tok: 'punct' },
        { text: '"job.finished"', tok: 'str' },
        { text: ', duration_ms=', tok: 'punct' },
        { text: '184', tok: 'num' },
        { text: ')', tok: 'punct' },
      ],
    ],
  },
  {
    id: 'go',
    label: 'Go',
    install: 'go get github.com/observo/observo-go',
    lines: [
      [
        { text: 'client := observo.', tok: 'key' },
        { text: 'New', tok: 'fn' },
        { text: '(os.', tok: 'punct' },
        { text: 'Getenv', tok: 'fn' },
        { text: '(', tok: 'punct' },
        { text: '"OBSERVO_KEY"', tok: 'str' },
        { text: '))', tok: 'punct' },
      ],
      [],
      [
        { text: 'client.', tok: 'key' },
        { text: 'Info', tok: 'fn' },
        { text: '(ctx, ', tok: 'punct' },
        { text: '"deploy.rollout"', tok: 'str' },
        { text: ', observo.', tok: 'punct' },
        { text: 'Fields', tok: 'fn' },
        { text: '{', tok: 'punct' },
      ],
      [
        { text: '  ', tok: 'punct' },
        { text: '"region"', tok: 'str' },
        { text: ': ', tok: 'punct' },
        { text: '"eu-west-1"', tok: 'str' },
        { text: ',', tok: 'punct' },
      ],
      [{ text: '})', tok: 'punct' }],
    ],
  },
]

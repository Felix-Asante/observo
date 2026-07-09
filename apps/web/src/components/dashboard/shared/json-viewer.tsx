import { Fragment } from 'react'

type JsonValue =
  | string
  | number
  | boolean
  | null
  | Array<JsonValue>
  | { [key: string]: JsonValue }

function ValueToken({ value }: { value: JsonValue }) {
  if (value === null) return <span className="tok-kw">null</span>
  if (typeof value === 'string')
    return <span className="tok-str">"{value}"</span>
  if (typeof value === 'number') return <span className="tok-num">{value}</span>
  if (typeof value === 'boolean')
    return <span className="tok-num">{String(value)}</span>
  return null
}

function Entries({ value, depth }: { value: JsonValue; depth: number }) {
  const indent = '  '.repeat(depth)

  if (Array.isArray(value)) {
    return (
      <>
        <span className="tok-punct">[</span>
        {'\n'}
        {value.map((item, index) => (
          <Fragment key={index}>
            {indent}
            {'  '}
            <Entries value={item} depth={depth + 1} />
            {index < value.length - 1 ? (
              <span className="tok-punct">,</span>
            ) : null}
            {'\n'}
          </Fragment>
        ))}
        {indent}
        <span className="tok-punct">]</span>
      </>
    )
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value)
    return (
      <>
        <span className="tok-punct">{'{'}</span>
        {'\n'}
        {entries.map(([key, entryValue], index) => (
          <Fragment key={key}>
            {indent}
            {'  '}
            <span className="tok-key">"{key}"</span>
            <span className="tok-punct">: </span>
            <Entries value={entryValue} depth={depth + 1} />
            {index < entries.length - 1 ? (
              <span className="tok-punct">,</span>
            ) : null}
            {'\n'}
          </Fragment>
        ))}
        {indent}
        <span className="tok-punct">{'}'}</span>
      </>
    )
  }

  return <ValueToken value={value} />
}

/** Syntax-highlighted, dependency-free JSON tree. */
export function JsonViewer({ value }: { value: Record<string, unknown> }) {
  return (
    <pre className="surface-inset overflow-x-auto rounded-lg p-4 font-mono text-xs leading-6">
      <code>
        <Entries value={value as JsonValue} depth={0} />
      </code>
    </pre>
  )
}

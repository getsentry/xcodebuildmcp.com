"use client"

import { useState, type ReactNode } from "react"

export interface CodeToken {
  text: string
  cls?: string
}

export interface CodeBlockProps {
  lang?: string
  filename?: string
  tokens?: CodeToken[]
  children?: ReactNode
  plain?: string
}

function tokensToString(tokens: CodeToken[] | undefined): string {
  if (!tokens) return ""
  return tokens.map((t) => t.text).join("")
}

export function CodeBlock({ lang, filename, tokens, children, plain }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    const text =
      plain ??
      (typeof children === "string" ? children : tokensToString(tokens))
    if (!text) return
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    })
  }

  return (
    <div className="codeblock">
      <div className="cb-head">
        {lang ? <span className="lang">{lang}</span> : null}
        {lang && filename ? <span className="sep">·</span> : null}
        {filename ? <span className="filename">{filename}</span> : null}
        <button className="cb-copy" onClick={copy} type="button">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>
          {tokens
            ? tokens.map((t, i) =>
                t.cls ? (
                  <span key={i} className={t.cls}>
                    {t.text}
                  </span>
                ) : (
                  <span key={i}>{t.text}</span>
                )
              )
            : children}
        </code>
      </pre>
    </div>
  )
}

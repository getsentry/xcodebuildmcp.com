import type { MDXComponents } from "mdx/types"
import type { ReactElement } from "react"
import { Callout } from "@/app/docs/_components/callout"
import { CodeBlock } from "@/app/docs/_components/code-block"
import { Tabs } from "@/app/docs/_components/tabs"
import { MermaidDiagram } from "@/app/docs/_components/mermaid-diagram"
import { ToolExplorer } from "@/app/docs/_components/tool-explorer"
import {
  LiveToolCount,
  LiveWorkflowCount,
  LiveVersion,
  LiveRef,
  LiveWorkflowToolCount,
  LiveWorkflowsTable,
} from "@/app/docs/_components/live"
import { LiveChangelog } from "@/app/docs/_components/live-changelog"

type PreChild = ReactElement<{
  children?: string
  className?: string
  "data-filename"?: string
}>

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Render fenced code blocks through our styled CodeBlock so they get
    // the filename/lang header and copy button.
    pre: (props) => {
      const child = (props as { children?: PreChild }).children
      if (!child || typeof child !== "object") {
        return <pre>{(props as { children?: unknown }).children as never}</pre>
      }
      const codeClass = child.props.className ?? ""
      const langMatch = /language-([a-zA-Z0-9-]+)/.exec(codeClass)
      const lang = langMatch ? langMatch[1] : undefined
      const filename = child.props["data-filename"]
      const raw = typeof child.props.children === "string" ? child.props.children : ""
      const content = raw.replace(/\n$/, "")

      if (lang?.toLowerCase() === "mermaid") {
        return <MermaidDiagram source={content} />
      }

      return (
        <CodeBlock lang={lang} filename={filename} plain={content}>
          {content}
        </CodeBlock>
      )
    },
    h2: ({ children, ...props }) => (
      <h2 className="section" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="sub" {...props}>
        {children}
      </h3>
    ),
    table: ({ children, ...props }) => (
      <table className="docs-table" {...props}>
        {children}
      </table>
    ),
    Callout,
    CodeBlock,
    Tabs,
    ToolExplorer,
    LiveToolCount,
    LiveWorkflowCount,
    LiveVersion,
    LiveRef,
    LiveWorkflowToolCount,
    LiveWorkflowsTable,
    LiveChangelog,
    ...components,
  }
}

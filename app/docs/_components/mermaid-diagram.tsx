"use client"

import { useEffect, useId, useMemo, useState } from "react"
import { Maximize2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MermaidDiagramProps {
  source: string
}

const baseConfig = {
  startOnLoad: false,
  theme: "default" as const,
  fontSize: 16,
  flowchart: { useMaxWidth: false, htmlLabels: true, padding: 16 },
  sequence: { useMaxWidth: false, actorFontSize: 15, noteFontSize: 14, messageFontSize: 14 },
  // @ts-expect-error mermaid types lag the runtime config surface
  stateDiagram: { useMaxWidth: false },
}

// Mermaid renders text labels via <foreignObject> + HTML, which inherit `color`
// from the page body. In dark-mode pages the body color is white, so the labels
// disappear against the diagram's light fills. Inject a scoped <style> into the
// SVG to lock text/label colors to a dark value regardless of page theme.
const colorLockStyle = `<style>
  text { fill: #1f2937; }
  .nodeLabel, .edgeLabel, .cluster-label, .titleText, .messageText, .noteText, .label, .stateLabel { color: #1f2937 !important; fill: #1f2937; }
  .actor > tspan, .actor-line, .loopText, .loopText > tspan { fill: #1f2937; }
  foreignObject, foreignObject div, foreignObject span, foreignObject p { color: #1f2937 !important; }
</style>`

function fitSvg(svg: string): string {
  return svg
    .replace(/(<svg\b[^>]*?)\sstyle="([^"]*?)"/, (_match, prefix, style) => {
      const cleaned = style
        .replace(/max-width:\s*[^;]+;?/g, "")
        .replace(/^\s*;\s*/, "")
        .trim()
      return cleaned ? `${prefix} style="${cleaned}"` : prefix
    })
    .replace(/(<svg\b[^>]*?)\swidth="[^"]*"/, "$1")
    .replace(/(<svg\b[^>]*?)\sheight="[^"]*"/, "$1")
    .replace(/<svg\b/, '<svg width="100%" height="auto"')
    .replace(/(<svg\b[^>]*?>)/, `$1${colorLockStyle}`)
}

export function MermaidDiagram({ source }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const baseId = useId()

  const diagramId = useMemo(() => baseId.replace(/[^a-zA-Z0-9_-]/g, ""), [baseId])

  useEffect(() => {
    let isMounted = true

    const renderDiagram = async () => {
      try {
        setSvg(null)
        setError(null)

        const mermaid = (await import("mermaid")).default
        mermaid.initialize(baseConfig)

        const { svg: rendered } = await mermaid.render(`mermaid-${diagramId}-${Date.now()}`, source)
        if (isMounted) {
          setSvg(fitSvg(rendered))
        }
      } catch (renderError) {
        if (isMounted) {
          setError(renderError instanceof Error ? renderError.message : "Unable to render Mermaid diagram")
        }
      }
    }

    if (!source.trim()) {
      setSvg("")
      return () => {
        isMounted = false
      }
    }

    void renderDiagram()

    return () => {
      isMounted = false
    }
  }, [diagramId, source])

  if (error) {
    return (
      <div className="my-6">
        <p className="mb-2 text-sm text-red-600 dark:text-red-400">Diagram failed to render: {error}</p>
        <pre>
          <code>{source}</code>
        </pre>
      </div>
    )
  }

  if (svg === null) {
    return <div className="my-6 h-40 w-full animate-pulse rounded-md bg-muted/50" aria-hidden="true" />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="View diagram full screen"
          className="mermaid-diagram group relative my-6 block w-full cursor-zoom-in overflow-x-auto rounded-md border border-neutral-200 bg-white p-4 text-left text-neutral-900 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span dangerouslySetInnerHTML={{ __html: svg }} />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-2 text-neutral-400 opacity-40 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="grid h-[90vh] w-[95vw] max-w-[95vw] grid-rows-[auto_1fr] gap-0 overflow-hidden border-neutral-200 bg-white p-0 text-neutral-900 sm:rounded-lg">
        <DialogTitle className="border-b border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-900">
          Diagram
        </DialogTitle>
        <div
          className="mermaid-diagram-fullscreen flex h-full w-full items-center justify-center overflow-auto bg-white p-6"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </DialogContent>
    </Dialog>
  )
}

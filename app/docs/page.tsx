import type { Metadata } from "next"
import { DocsShell } from "./_components/docs-shell"
import { Pager } from "./_components/pager"
import { PAGE_COMPONENTS } from "./_content"
import { PAGE_META, neighbors } from "./_data/routes"

export const metadata: Metadata = {
  title: PAGE_META.introduction.title,
  description: PAGE_META.introduction.description,
}

export default function DocsIndexPage() {
  const IntroductionPage = PAGE_COMPONENTS.introduction
  const { next } = neighbors("introduction")

  return (
    <DocsShell activeSlug="introduction">
      <IntroductionPage />
      {next ? <Pager prev={null} next={next} /> : null}
    </DocsShell>
  )
}

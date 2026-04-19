import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DocsShell } from "../_components/docs-shell"
import { Pager } from "../_components/pager"
import { PAGE_COMPONENTS } from "../_content"
import {
  PAGES_ORDER,
  PAGE_META,
  isDocSlug,
  neighbors,
  type DocSlug,
} from "../_data/routes"

interface PageParams {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PAGES_ORDER.filter((slug) => slug !== "introduction").map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  if (!isDocSlug(slug)) return {}
  const meta = PAGE_META[slug]
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function DocsSlugPage({ params }: PageParams) {
  const { slug } = await params
  if (!isDocSlug(slug) || slug === "introduction") {
    notFound()
  }
  const activeSlug: DocSlug = slug
  const PageComp = PAGE_COMPONENTS[activeSlug]
  const { prev, next } = neighbors(activeSlug)

  return (
    <DocsShell activeSlug={activeSlug}>
      <PageComp />
      <Pager prev={prev} next={next} />
    </DocsShell>
  )
}

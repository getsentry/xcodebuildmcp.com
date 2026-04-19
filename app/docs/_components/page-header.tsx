import { Fragment } from "react"

export interface PageHeaderProps {
  breadcrumbs?: string[]
  title: string
  lede?: string
  meta?: string[]
}

export function PageHeader({ breadcrumbs, title, lede, meta }: PageHeaderProps) {
  return (
    <>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <div className="breadcrumbs">
          {breadcrumbs.map((b, i) => (
            <Fragment key={i}>
              <span>{b}</span>
              {i < breadcrumbs.length - 1 ? <span className="sep">/</span> : null}
            </Fragment>
          ))}
        </div>
      ) : null}
      <h1 className="page-title">{title}</h1>
      {lede ? <p className="page-lede">{lede}</p> : null}
      {meta && meta.length > 0 ? (
        <div className="page-meta">
          {meta.map((m, i) => (
            <Fragment key={i}>
              {i > 0 ? <span className="dot" /> : null}
              <span>{m}</span>
            </Fragment>
          ))}
        </div>
      ) : null}
    </>
  )
}

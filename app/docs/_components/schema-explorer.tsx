"use client"

import { useMemo, useState } from "react"
import { Icons } from "./icons"
import { publishedSchemas } from "../_data/generated/schemas"

const latestVersionOption = "latest"

export function SchemaExplorer() {
  const [query, setQuery] = useState("")
  const [selectedVersion, setSelectedVersion] = useState(latestVersionOption)

  const versionOptions = useMemo(() => {
    const versions = new Set<string>()

    for (const schema of publishedSchemas) {
      for (const version of schema.versions) {
        versions.add(version)
      }
    }

    return Array.from(versions).sort((left, right) => Number(right) - Number(left))
  }, [])

  const filteredSchemas = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return publishedSchemas.filter((schema) => {
      const matchesQuery = normalizedQuery
        ? schema.name.toLowerCase().includes(normalizedQuery)
        : true
      const hasSelectedVersion =
        selectedVersion === latestVersionOption || schema.versions.includes(selectedVersion)

      return matchesQuery && hasSelectedVersion
    })
  }, [query, selectedVersion])

  return (
    <>
      <div className="tools-controls">
        <div className="search-wrap">
          <div className="si">
            <Icons.Search size={14} />
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Filter ${publishedSchemas.length} schemas…`}
          />
        </div>
        <label className="schema-version">
          <span>Version</span>
          <select
            value={selectedVersion}
            onChange={(event) => setSelectedVersion(event.target.value)}
          >
            <option value={latestVersionOption}>Latest</option>
            {versionOptions.map((version) => (
              <option key={version} value={version}>
                v{version}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="tool-grid">
        {filteredSchemas.map((schema) => {
          const resolvedVersion =
            selectedVersion === latestVersionOption ? schema.latest : selectedVersion
          const href = `/schemas/structured-output/${schema.name}/${resolvedVersion}.schema.json`
          const versionLabel =
            selectedVersion === latestVersionOption
              ? `latest · v${schema.latest}`
              : `v${resolvedVersion}`

          return (
            <a key={schema.name} className="tool-card schema-card" href={href}>
              <div>
                <div className="tc-name">{schema.name}</div>
                <div className="tc-sub">{versionLabel}</div>
              </div>
              <span className="tc-badge">JSON schema</span>
            </a>
          )
        })}
        {filteredSchemas.length === 0 ? (
          <div
            style={{
              padding: "24px 14px",
              color: "var(--fg-muted)",
              textAlign: "center",
              border: "1px dashed var(--border-primary)",
              borderRadius: 6,
            }}
          >
            No schemas match the current filter and version.
          </div>
        ) : null}
      </div>
    </>
  )
}

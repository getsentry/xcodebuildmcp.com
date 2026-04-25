"use client"

import { useState, type ReactNode } from "react"

export interface Tab {
  label: string
  content: ReactNode
}

export interface TabsProps {
  tabs: Tab[]
  initial?: number
}

export function Tabs({ tabs, initial = 0 }: TabsProps) {
  const [i, setI] = useState(initial)
  return (
    <>
      <div className="tabs">
        {tabs.map((t, idx) => (
          <button
            key={idx}
            className={i === idx ? "active" : ""}
            onClick={() => setI(idx)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">{tabs[i]?.content}</div>
    </>
  )
}

import type { SVGProps, ReactElement, FC } from "react"

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number
  stroke?: number
}

function makeIcon(children: ReactElement): FC<IconProps> {
  const Icon: FC<IconProps> = ({ size = 16, stroke = 1.75, ...rest }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  )
  return Icon
}

export const Icons = {
  Home: makeIcon(
    <path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V11z" />
  ),
  Rocket: makeIcon(
    <g>
      <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1 0-2.9-.8-.8-2.1-.8-2.9 0z" />
      <path d="M12 15l-3-3a22 22 0 014-7l5-3 3 3-3 5a22 22 0 01-7 4" />
      <path d="M9 12H4s.5-2.8 2-4c1.4-1 4-1 4-1" />
      <path d="M12 15v5s2.8-.5 4-2c1-1.4 1-4 1-4" />
    </g>
  ),
  Download: makeIcon(
    <g>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </g>
  ),
  Terminal: makeIcon(
    <g>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </g>
  ),
  Wrench: makeIcon(
    <path d="M14.7 6.3a4 4 0 00-5.4 5.4l-6.3 6.3a2 2 0 002.8 2.8l6.3-6.3a4 4 0 005.4-5.4l-2.1 2.1-1.4-1.4 2.1-2.1a4 4 0 00-1.4-1.4z" />
  ),
  Book: makeIcon(
    <g>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </g>
  ),
  Github: makeIcon(
    <g>
      <path d="M15 22v-4a5 5 0 00-1-3c3 0 6-2 6-5 0-1-.5-2.5-1-3 0-2-1-3-1-3s-2 0-4 1.5c-2-.5-4-.5-6 0C6 3 4 3 4 3s-1 1-1 3c-.5.5-1 2-1 3 0 3 3 5 6 5a5 5 0 00-1 3v4" />
      <path d="M9 18c-4 1-5-2-7-2" />
    </g>
  ),
  Search: makeIcon(
    <g>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </g>
  ),
  Chev: makeIcon(<path d="m9 6 6 6-6 6" />),
  ChevDown: makeIcon(<path d="m6 9 6 6 6-6" />),
  Ext: makeIcon(
    <g>
      <path d="M7 17L17 7" />
      <polyline points="9 7 17 7 17 15" />
    </g>
  ),
  Copy: makeIcon(
    <g>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </g>
  ),
  Sun: makeIcon(
    <g>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </g>
  ),
  Moon: makeIcon(<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />),
  Info: makeIcon(
    <g>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </g>
  ),
  Warn: makeIcon(
    <g>
      <path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </g>
  ),
  Check: makeIcon(<path d="M20 6 9 17l-5-5" />),
  X: makeIcon(
    <g>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </g>
  ),
  Phone: makeIcon(
    <g>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h0" />
    </g>
  ),
  Laptop: makeIcon(
    <g>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 20h20" />
    </g>
  ),
  Package: makeIcon(
    <g>
      <path d="M16.5 9.4l-9-5.2" />
      <path d="M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.3 7 12 12 20.7 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </g>
  ),
  Play: makeIcon(<polygon points="5 3 19 12 5 21 5 3" />),
  Bug: makeIcon(
    <g>
      <rect x="8" y="6" width="8" height="14" rx="4" />
      <path d="M12 6V4M8 10H5m14 0h-3M8 14H4m16 0h-4M8 18H5m14 0h-3" />
    </g>
  ),
  Image: makeIcon(
    <g>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </g>
  ),
  FileText: makeIcon(
    <g>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </g>
  ),
  Zap: makeIcon(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />),
  Layers: makeIcon(
    <g>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </g>
  ),
  Key: makeIcon(
    <g>
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </g>
  ),
  Shield: makeIcon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />),
  Clock: makeIcon(
    <g>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </g>
  ),
  List: makeIcon(
    <g>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </g>
  ),
  Settings: makeIcon(
    <g>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </g>
  ),
  SidebarIc: makeIcon(
    <g>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </g>
  ),
}

export type IconName = keyof typeof Icons

/**
 * Curated Lucide icons for the DiagramBuilder picker.
 *
 * Each entry is identified by a kebab-case id that matches both:
 *   - the `lucide-react` PascalCase component (for the UI)
 *   - the `lucide-static` SVG filename (for server-side embedding into the
 *     generated diagram SVG)
 *
 * Keep this set small and intentional — the goal is a clean, professional
 * vocabulary, not "every Lucide icon ever". 30 covers the diagram needs.
 */

import {
  // Data
  ChartBar,
  ChartLine,
  ChartPie,
  Database,
  Search,
  Table,
  Calculator,
  FileSpreadsheet,
  // Health
  Hospital,
  HeartPulse,
  Stethoscope,
  Baby,
  Pill,
  Syringe,
  Activity,
  // Communication
  MessageCircle,
  Megaphone,
  Mail,
  Mic,
  Phone,
  Send,
  // Actions / status
  CircleCheck,
  TriangleAlert,
  Target,
  Lightbulb,
  RefreshCw,
  KeyRound,
  ArrowRight,
  // People / process
  Users,
  Hand,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

export type DiagramIconCategory = 'Data' | 'Health' | 'Communication' | 'Actions' | 'People'

export interface DiagramIcon {
  id: string
  Component: LucideIcon
  category: DiagramIconCategory
  label: string
}

export const DIAGRAM_ICONS: DiagramIcon[] = [
  // Data
  { id: 'chart-bar', Component: ChartBar, category: 'Data', label: 'Bar chart' },
  { id: 'chart-line', Component: ChartLine, category: 'Data', label: 'Line chart' },
  { id: 'chart-pie', Component: ChartPie, category: 'Data', label: 'Pie chart' },
  { id: 'database', Component: Database, category: 'Data', label: 'Database' },
  { id: 'search', Component: Search, category: 'Data', label: 'Search' },
  { id: 'table', Component: Table, category: 'Data', label: 'Table' },
  { id: 'calculator', Component: Calculator, category: 'Data', label: 'Calculator' },
  { id: 'file-spreadsheet', Component: FileSpreadsheet, category: 'Data', label: 'Spreadsheet' },
  // Health
  { id: 'hospital', Component: Hospital, category: 'Health', label: 'Hospital' },
  { id: 'heart-pulse', Component: HeartPulse, category: 'Health', label: 'Pulse' },
  { id: 'stethoscope', Component: Stethoscope, category: 'Health', label: 'Stethoscope' },
  { id: 'baby', Component: Baby, category: 'Health', label: 'Baby' },
  { id: 'pill', Component: Pill, category: 'Health', label: 'Pill' },
  { id: 'syringe', Component: Syringe, category: 'Health', label: 'Syringe' },
  { id: 'activity', Component: Activity, category: 'Health', label: 'Activity' },
  // Communication
  { id: 'message-circle', Component: MessageCircle, category: 'Communication', label: 'Message' },
  { id: 'megaphone', Component: Megaphone, category: 'Communication', label: 'Megaphone' },
  { id: 'mail', Component: Mail, category: 'Communication', label: 'Mail' },
  { id: 'mic', Component: Mic, category: 'Communication', label: 'Mic' },
  { id: 'phone', Component: Phone, category: 'Communication', label: 'Phone' },
  { id: 'send', Component: Send, category: 'Communication', label: 'Send' },
  // Actions / status
  { id: 'circle-check', Component: CircleCheck, category: 'Actions', label: 'Check' },
  { id: 'triangle-alert', Component: TriangleAlert, category: 'Actions', label: 'Warning' },
  { id: 'target', Component: Target, category: 'Actions', label: 'Target' },
  { id: 'lightbulb', Component: Lightbulb, category: 'Actions', label: 'Idea' },
  { id: 'refresh-cw', Component: RefreshCw, category: 'Actions', label: 'Refresh' },
  { id: 'key-round', Component: KeyRound, category: 'Actions', label: 'Key' },
  { id: 'arrow-right', Component: ArrowRight, category: 'Actions', label: 'Next' },
  // People / process
  { id: 'users', Component: Users, category: 'People', label: 'Group' },
  { id: 'hand', Component: Hand, category: 'People', label: 'Hand' },
  { id: 'graduation-cap', Component: GraduationCap, category: 'People', label: 'Training' },
]

export const DIAGRAM_ICON_IDS = new Set(DIAGRAM_ICONS.map(i => i.id))

export function isDiagramIconId(value: string | undefined): boolean {
  return !!value && DIAGRAM_ICON_IDS.has(value)
}

export const DIAGRAM_ICONS_BY_CATEGORY: Record<DiagramIconCategory, DiagramIcon[]> = DIAGRAM_ICONS.reduce(
  (acc, icon) => {
    if (!acc[icon.category]) acc[icon.category] = []
    acc[icon.category].push(icon)
    return acc
  },
  {} as Record<DiagramIconCategory, DiagramIcon[]>,
)

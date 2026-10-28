import {
  BadgeCheck,
  BookOpenCheck,
  ChartLine,
  Database,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Library,
  ListChecks,
  MessageSquareText,
  Settings,
  SlidersHorizontal,
  Target,
  UserCog,
  Users,
} from 'lucide-react'
import { type Lang } from '@/lib/i18n'
import { type SidebarData } from '../types'

const L = (ms: string, en: string) => ({ ms, en })

type Label = ReturnType<typeof L>

interface ItemDef {
  title: Label
  url?: string
  icon?: React.ElementType
  badge?: string
  items?: { title: Label; url: string; icon?: React.ElementType; badge?: string }[]
}

interface GroupDef {
  title: Label
  items: ItemDef[]
}

const GROUPS: GroupDef[] = [
  {
    title: L('Umum', 'General'),
    items: [{ title: L('Overview', 'Overview'), url: '/', icon: LayoutDashboard }],
  },
  {
    title: L('Foresight', 'Foresight'),
    items: [
      {
        title: L('Foresight Kemahiran', 'Skills Foresight'),
        url: '/foresight',
        icon: BookOpenCheck,
      },
    ],
  },
  {
    title: L('Bukti', 'Evidence'),
    items: [
      {
        title: L('Prestasi SPM', 'SPM Performance'),
        url: '/analytics/spm',
        icon: GraduationCap,
      },
      {
        title: L('Program STEM (i-360)', 'STEM Programmes (i-360)'),
        url: '/analytics/i360',
        icon: Users,
        badge: 'Pautan',
      },
      {
        title: L('Minat & Aspirasi', 'Interest & Aspiration'),
        url: '/analytics/impak',
        icon: ChartLine,
        badge: 'Pautan',
      },
      {
        title: L('Bakat Profesional', 'Professional Talent'),
        url: '/analytics/professional',
        icon: BadgeCheck,
        badge: 'New',
      },
    ],
  },
  {
    title: L('Diagnosis', 'Diagnosis'),
    items: [
      {
        title: L('E&E Talent Intelligence', 'E&E Talent Intelligence'),
        icon: ChartLine,
        items: [
          { title: L('Supply & Demand', 'Supply & Demand'), url: '/analytics/eande/supply-demand' },
          { title: L('Graduate Mismatch', 'Graduate Mismatch'), url: '/analytics/eande/mismatch' },
          { title: L('Supply Strength', 'Supply Strength'), url: '/analytics/eande/strength' },
        ],
      },
    ],
  },
  {
    title: L('Keputusan', 'Decision'),
    items: [
      {
        title: L('Scenario Simulator', 'Scenario Simulator'),
        url: '/simulator/scenario',
        icon: SlidersHorizontal,
      },
      {
        title: L('Gap Closure & Interventions', 'Gap Closure & Interventions'),
        url: '/simulator/interventions',
        icon: Target,
      },
    ],
  },
  {
    title: L('Pengetahuan', 'Knowledge'),
    items: [
      {
        title: L('Ask MASTIC', 'Ask MASTIC'),
        url: '/ask-mastic',
        icon: MessageSquareText,
        badge: 'Beta',
      },
      {
        title: L('Sumber Data', 'Data Sources'),
        url: '/data-sources',
        icon: Library,
      },
      {
        title: L('Data Explorer', 'Data Explorer'),
        url: '/data',
        icon: Database,
      },
      {
        title: L('Methodology & Diagnostics', 'Methodology & Diagnostics'),
        url: '/model',
        icon: Gauge,
      },
    ],
  },
  {
    title: L('Admin', 'Admin'),
    items: [
      {
        title: L('Users', 'Users'),
        url: '/users',
        icon: UserCog,
      },
    ],
  },
  {
    title: L('Lain-lain', 'Other'),
    items: [
      {
        title: L('Tetapan', 'Settings'),
        icon: Settings,
        items: [
          { title: L('Profil', 'Profile'), url: '/settings', icon: UserCog },
          { title: L('Akaun', 'Account'), url: '/settings/account', icon: ListChecks },
          { title: L('Penampilan', 'Appearance'), url: '/settings/appearance', icon: Settings },
          { title: L('Notifikasi', 'Notifications'), url: '/settings/notifications', icon: Settings },
          { title: L('Paparan', 'Display'), url: '/settings/display', icon: Settings },
        ],
      },
    ],
  },
]

export function getSidebarData(lang: Lang): SidebarData {
  return {
    user: {
      name: 'MASTIC Analyst',
      email: 'analyst@stemintel.gov.my',
      avatar: '',
    },
    navGroups: GROUPS.map((g) => ({
      title: g.title[lang],
      items: g.items.map((item) =>
        item.items
          ? {
              title: item.title[lang],
              icon: item.icon,
              items: item.items.map((sub) => ({
                title: sub.title[lang],
                url: sub.url,
                icon: sub.icon,
                badge: sub.badge,
              })),
            }
          : {
              title: item.title[lang],
              url: item.url ?? '/',
              icon: item.icon,
              badge: item.badge,
            }
      ),
    })),
  }
}

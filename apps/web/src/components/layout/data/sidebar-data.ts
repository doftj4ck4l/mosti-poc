import {
  ChartLine,
  Database,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Library,
  ListChecks,
  Settings,
  SlidersHorizontal,
  Target,
  UserCog,
  Users,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'MASTIC Analyst',
    email: 'analyst@stemintel.gov.my',
    avatar: '',
  },
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Overview',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Evidence',
      items: [
        {
          title: 'Prestasi SPM',
          url: '/analytics/spm',
          icon: GraduationCap,
          badge: 'New',
        },
        {
          title: 'Supply & Demand E&E',
          url: '/analytics/supply-demand',
          icon: ChartLine,
        },
      ],
    },
    {
      title: 'Diagnosis',
      items: [
        {
          title: 'Graduate Mismatch',
          url: '/analytics/mismatch',
          icon: Users,
        },
      ],
    },
    {
      title: 'Decision',
      items: [
        {
          title: 'Scenario Simulator',
          url: '/simulator/scenario',
          icon: SlidersHorizontal,
        },
        {
          title: 'Gap Closure & Interventions',
          url: '/simulator/interventions',
          icon: Target,
        },
      ],
    },
    {
      title: 'Knowledge',
      items: [
        {
          title: 'Sumber Data',
          url: '/data-sources',
          icon: Library,
        },
        {
          title: 'Data Explorer',
          url: '/data',
          icon: Database,
        },
        {
          title: 'Methodology & Diagnostics',
          url: '/model',
          icon: Gauge,
        },
      ],
    },
    {
      title: 'Admin',
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: UserCog,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: ListChecks,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Settings,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Settings,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Settings,
            },
          ],
        },
      ],
    },
  ],
}

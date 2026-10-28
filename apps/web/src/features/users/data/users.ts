import type { User, UserRole, UserStatus } from './schema'

const d = (iso: string) => new Date(iso)

type SeedUser = [string, string, string, string, UserStatus, UserRole]

const raw: SeedUser[] = [
  ['Farah', 'Nadhirah', 'farah.nadhirah@mosti.gov.my', '+60 12-345 6789', 'active', 'admin'],
  ['Ahmad', 'Faizal', 'ahmad.faizal@mastic.gov.my', '+60 19-882 4410', 'active', 'analyst'],
  ['Nurul', 'Izzah', 'nurul.izzah@mosti.gov.my', '+60 13-774 9920', 'active', 'viewer'],
  ['Lim', 'Wei Jie', 'lim.weijie@mastic.gov.my', '+60 16-221 8834', 'active', 'analyst'],
  ['Tan', 'Mei Ling', 'tan.meiling@dsm.gov.my', '+60 11-550 2210', 'active', 'viewer'],
  ['Muhammad', 'Danial', 'danial.kpt@kpt.gov.my', '+60 17-664 3301', 'invited', 'viewer'],
  ['Aina', 'Sofea', 'aina.sofea@perkeso.gov.my', '+60 12-908 1177', 'active', 'analyst'],
  ['Rajesh', 'Kumar', 'rajesh.kumar@ilmia.gov.my', '+60 19-330 5562', 'active', 'viewer'],
  ['Chong', 'Kah Wai', 'chong.kahwai@bem.org.my', '+60 14-226 7781', 'invited', 'viewer'],
  ['Hafiz', 'Rahman', 'hafiz.rahman@mbot.gov.my', '+60 13-445 6612', 'active', 'viewer'],
  ['Siti', 'Aminah', 'siti.aminah@upm.edu.my', '+60 12-610 8845', 'active', 'analyst'],
  ['Mohd', 'Shahril', 'mohd.shahril@upm.edu.my', '+60 19-114 2209', 'active', 'viewer'],
  ['Nazrul', 'Hadi', 'nazrul.hadi@mastic.gov.my', '+60 11-233 9901', 'active', 'admin'],
  ['Siti', 'Zubaidah', 'siti.zubaidah@mosti.gov.my', '+60 16-778 4150', 'inactive', 'viewer'],
  ['Kumar', 'Selvam', 'kumar.selvam@mosti.gov.my', '+60 12-351 7723', 'active', 'viewer'],
  ['Amelia', 'Wong', 'amelia.wong@mastic.gov.my', '+60 17-883 5519', 'invited', 'analyst'],
  ['Zulhilmi', 'Anuar', 'zulhilmi@bem.org.my', '+60 18-902 3344', 'active', 'viewer'],
  ['Farid', 'Kamarudin', 'farid.kamarudin@mastic.gov.my', '+60 14-671 2208', 'active', 'analyst'],
]

export const users: User[] = raw.map(
  ([firstName, lastName, email, phoneNumber, status, role], i) => ({
    id: `usr-${String(i + 1).padStart(3, '0')}`,
    firstName,
    lastName,
    username: `${firstName}.${lastName}`.toLowerCase().replace(/\s+/g, ''),
    email,
    phoneNumber,
    status,
    role,
    createdAt: d('2026-01-12T02:30:00Z'),
    updatedAt: d('2026-10-20T08:15:00Z'),
  })
)

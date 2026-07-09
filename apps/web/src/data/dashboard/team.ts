export type TeamMember = {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  initials: string
  lastActive: string
}

export const teamMembers: Array<TeamMember> = [
  {
    id: 'usr_1',
    name: 'Maya Lindqvist',
    email: 'maya@arcline.dev',
    role: 'owner',
    initials: 'ML',
    lastActive: 'now',
  },
  {
    id: 'usr_2',
    name: 'Dev Okafor',
    email: 'dev@arcline.dev',
    role: 'admin',
    initials: 'DO',
    lastActive: '2h ago',
  },
  {
    id: 'usr_3',
    name: 'Sofia Reyes',
    email: 'sofia@arcline.dev',
    role: 'member',
    initials: 'SR',
    lastActive: '1d ago',
  },
  {
    id: 'usr_4',
    name: 'Jonas Weber',
    email: 'jonas@arcline.dev',
    role: 'member',
    initials: 'JW',
    lastActive: '3d ago',
  },
]

export const pendingInvites = [
  { email: 'priya@meridian.io', role: 'member' as const, sent: '2d ago' },
]

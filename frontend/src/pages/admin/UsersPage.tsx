import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { userManagementService } from '@/services/analytics'
import { UserTable } from '@/components/admin/UserTable'
import { DashboardSkeleton } from '@/components/common/Skeletons'
import type { User } from '@/types'

export default function UsersManagementPage() {
  const [users, setUsers]     = useState<User[]>([])
  const [search, setSearch]   = useState('')
  const [role, setRole]       = useState('all')
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (search) params.search = search
      if (role !== 'all') params.role = role
      const data = await userManagementService.getAll(params)
      setUsers(data.users ?? [])
    } finally { setLoading(false) }
  }, [search, role])

  useEffect(() => { fetch() }, [fetch])

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-espresso">Users Management</h1>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
            className="w-full h-10 bg-cream border border-beige/60 rounded-xl pl-9 text-sm font-sans text-ink outline-none focus:border-gold/50" />
        </div>
        <select value={role} onChange={e => setRole(e.target.value)}
          className="h-10 bg-cream border border-beige/60 rounded-xl px-4 text-sm font-display text-ink-2 outline-none focus:border-gold/50 cursor-pointer">
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="staff">Staff</option>
          <option value="admin">Admins</option>
        </select>
      </div>
      <div className="card-premium overflow-hidden">
        {loading ? <DashboardSkeleton /> : <UserTable users={users} onUpdate={fetch} />}
      </div>
    </div>
  )
}

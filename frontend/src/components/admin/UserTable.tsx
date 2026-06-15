import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ban, CheckCircle } from 'lucide-react'
import { userManagementService } from '@/services/analytics'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/format'
import toast from 'react-hot-toast'
import type { User } from '@/types'

interface Props { users: User[]; onUpdate: () => void }

export const UserTable = ({ users, onUpdate }: Props) => {
  const [loading, setLoading] = useState<string | null>(null)

  const toggleBlock = async (id: string) => {
    setLoading(id)
    try { await userManagementService.toggleBlock(id); onUpdate() }
    catch { toast.error('Action failed') }
    finally { setLoading(null) }
  }

  const ROLE_VARIANT: Record<string, any> = { admin: 'espresso', staff: 'gold', customer: 'default' }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-beige/40">
          <tr>{['User','Role','Status','Joined','Orders','Actions'].map(h => (
            <th key={h} className="text-left px-4 py-3 font-display text-xs text-ink-3 uppercase tracking-wide">{h}</th>
          ))}</tr>
        </thead>
        <tbody className="divide-y divide-beige/20">
          {users.map((u, i) => (
            <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="hover:bg-canvas-2/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {u.avatar
                    ? <img src={u.avatar} className="w-8 h-8 rounded-full object-cover" alt={u.name} />
                    : <div className="w-8 h-8 rounded-full bg-espresso flex items-center justify-center text-cream text-sm font-serif">{u.name[0]}</div>}
                  <div>
                    <p className="font-display text-sm font-medium text-espresso">{u.name}</p>
                    <p className="font-sans text-xs text-ink-3">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><Badge variant={ROLE_VARIANT[u.role]}>{u.role}</Badge></td>
              <td className="px-4 py-3">
                {u.isBlocked
                  ? <span className="flex items-center gap-1 text-xs text-red-600"><Ban size={12} />Blocked</span>
                  : <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle size={12} />Active</span>}
              </td>
              <td className="px-4 py-3 font-sans text-xs text-ink-3">{formatDate(u.createdAt)}</td>
              <td className="px-4 py-3 font-display text-sm text-espresso">{u.totalOrders}</td>
              <td className="px-4 py-3">
                {u.role !== 'admin' && (
                  <button onClick={() => toggleBlock(u._id)} disabled={loading === u._id}
                    className={`px-3 py-1.5 rounded-lg font-display text-xs font-medium transition-colors disabled:opacity-50 ${u.isBlocked ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                    {loading === u._id ? '…' : u.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p className="text-center font-sans text-sm text-ink-3 py-12">No users found.</p>}
    </div>
  )
}

export default UserTable

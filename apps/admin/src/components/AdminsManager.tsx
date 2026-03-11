'use client'

import { useState } from 'react'
import { Plus, Trash2, Shield } from 'lucide-react'
import type { Admin } from '@hb-tech/shared'

export default function AdminsManager({ admins }: { admins: Admin[] }) {
  const [list, setList] = useState(admins)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addAdmin = async () => {
    if (!email || !password || !name) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Failed to add admin')
      return
    }

    setList((prev) => [...prev, data.admin])
    setEmail('')
    setName('')
    setPassword('')
  }

  const removeAdmin = async (id: string) => {
    if (!confirm('Remove this admin?')) return
    await fetch(`/api/admins/${id}`, { method: 'DELETE' })
    setList((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* Add form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="font-semibold">Invite Admin</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
          />
          <button
            onClick={addAdmin}
            disabled={loading}
            className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-1"
          >
            <Plus size={16} /> {loading ? 'Adding...' : 'Add Admin'}
          </button>
        </div>
        {error && <p className="text-sm text-accent">{error}</p>}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {list.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No admins found.</div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {list.map((admin) => (
              <div key={admin.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield size={14} className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{admin.name}</p>
                  <p className="text-xs text-gray-500">{admin.email}</p>
                </div>
                <span className="text-xs text-gray-400 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                  {admin.role}
                </span>
                <button
                  onClick={() => removeAdmin(admin.id)}
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

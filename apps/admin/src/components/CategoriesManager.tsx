'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit, Check, X } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import type { Category } from '@hb-tech/shared'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [list, setList] = useState(categories)
  const [newName, setNewName] = useState('')
  const [newParent, setNewParent] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const addCategory = async () => {
    if (!newName.trim()) return
    const { data } = await supabase
      .from('categories')
      .insert({ name: newName, slug: slugify(newName), parent_id: newParent || null })
      .select()
      .single()
    if (data) {
      setList((prev) => [...prev, data as Category])
      setNewName('')
      setNewParent('')
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Products in this category will have no category.')) return
    await supabase.from('categories').delete().eq('id', id)
    setList((prev) => prev.filter((c) => c.id !== id))
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return
    await supabase.from('categories').update({ name: editName, slug: slugify(editName) }).eq('id', id)
    setList((prev) => prev.map((c) => c.id === id ? { ...c, name: editName, slug: slugify(editName) } : c))
    setEditId(null)
  }

  const roots = list.filter((c) => !c.parent_id)
  const getChildren = (parentId: string) => list.filter((c) => c.parent_id === parentId)

  return (
    <div className="max-w-2xl space-y-4">
      {/* Add form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="font-semibold mb-4">Add Category</h2>
        <div className="flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          />
          <select
            value={newParent}
            onChange={(e) => setNewParent(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-accent"
          >
            <option value="">No parent</option>
            {roots.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={addCategory}
            className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {roots.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">No categories yet.</div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {roots.map((cat) => (
              <div key={cat.id}>
                <CategoryRow
                  cat={cat}
                  editId={editId}
                  editName={editName}
                  onEdit={(id, name) => { setEditId(id); setEditName(name) }}
                  onSave={saveEdit}
                  onCancelEdit={() => setEditId(null)}
                  onDelete={deleteCategory}
                  onEditNameChange={setEditName}
                />
                {getChildren(cat.id).map((child) => (
                  <CategoryRow
                    key={child.id}
                    cat={child}
                    indent
                    editId={editId}
                    editName={editName}
                    onEdit={(id, name) => { setEditId(id); setEditName(name) }}
                    onSave={saveEdit}
                    onCancelEdit={() => setEditId(null)}
                    onDelete={deleteCategory}
                    onEditNameChange={setEditName}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CategoryRow({
  cat, indent, editId, editName, onEdit, onSave, onCancelEdit, onDelete, onEditNameChange
}: {
  cat: Category
  indent?: boolean
  editId: string | null
  editName: string
  onEdit: (id: string, name: string) => void
  onSave: (id: string) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
  onEditNameChange: (name: string) => void
}) {
  const isEditing = editId === cat.id

  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${indent ? 'pl-8 bg-gray-50/50 dark:bg-gray-800/20' : ''}`}>
      {indent && <span className="text-gray-400 text-xs">↳</span>}
      {isEditing ? (
        <>
          <input
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
            autoFocus
          />
          <button onClick={() => onSave(cat.id)} className="text-green-500 hover:text-green-600">
            <Check size={16} />
          </button>
          <button onClick={onCancelEdit} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </>
      ) : (
        <>
          <div className="flex-1">
            <span className="text-sm font-medium">{cat.name}</span>
            <span className="text-xs text-gray-400 ml-2">/{cat.slug}</span>
          </div>
          <button onClick={() => onEdit(cat.id, cat.name)} className="text-gray-400 hover:text-accent transition-colors">
            <Edit size={15} />
          </button>
          <button onClick={() => onDelete(cat.id)} className="text-gray-400 hover:text-accent transition-colors">
            <Trash2 size={15} />
          </button>
        </>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase, obtenerNotas, crearNota, eliminarNota } from '../lib/supabase'
import { Nota } from '../types'
import { 
  Plus, 
  Trash2, 
  LogOut, 
  Calendar, 
  User, 
  StickyNote,
  Loader2,
  X
} from 'lucide-react'

interface NotasProps {
  onLogout: () => void
}

export default function Notas({ onLogout }: NotasProps) {
  const [notas, setNotas] = useState<Nota[]>([])
  const [nuevaNota, setNuevaNota] = useState('')
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    cargarUsuarioYNotas()
  }, [])

  async function cargarUsuarioYNotas() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUserEmail(user.email || '')
        setUserId(user.id)
        const notasData = await obtenerNotas(user.id)
        setNotas(notasData)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCrearNota(e: React.FormEvent) {
    e.preventDefault()
    if (!nuevaNota.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const notaCreada = await crearNota(nuevaNota.trim(), userId)
      setNotas([notaCreada, ...notas])
      setNuevaNota('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEliminarNota(id: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta nota?')) return

    try {
      await eliminarNota(id)
      setNotas(notas.filter(n => n.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    onLogout()
  }

  function formatearFecha(fechaStr: string) {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xl">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <StickyNote className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Mis Notas</h1>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <User className="w-4 h-4" />
                  <span>{userEmail}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between animate-slide-up">
            <span className="text-red-700">{error}</span>
            <button onClick={() => setError(null)}>
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}

        {/* Create Note Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Nueva Nota
          </h2>
          <form onSubmit={handleCrearNota}>
            <textarea
              value={nuevaNota}
              onChange={(e) => setNuevaNota(e.target.value)}
              placeholder="Escribe tu nota aquí..."
              rows={3}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none outline-none text-gray-700"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={!nuevaNota.trim() || isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Crear Nota
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notas.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center animate-fade-in">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StickyNote className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No tienes notas aún
              </h3>
              <p className="text-gray-500">
                Crea tu primera nota usando el formulario de arriba
              </p>
            </div>
          ) : (
            notas.map((nota, index) => (
              <div
                key={nota.id}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all animate-slide-up group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {nota.contenido}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatearFecha(nota.fecha)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEliminarNota(nota.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Eliminar nota"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 mt-8 text-sm">
          {notas.length} {notas.length === 1 ? 'nota' : 'notas'} en total
        </p>
      </div>
    </div>
  )
}

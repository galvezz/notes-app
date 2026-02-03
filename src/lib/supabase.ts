import { createClient } from '@supabase/supabase-js'
import { Nota } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funciones auxiliares para operaciones CRUD
export async function obtenerNotas(userId: string): Promise<Nota[]> {
  const { data, error } = await supabase
    .from('notas')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false })

  if (error) {
    console.error('Error al obtener notas:', error)
    throw error
  }

  return data || []
}

export async function crearNota(contenido: string, userId: string): Promise<Nota> {
  const nuevaNota = {
    user_id: userId,
    contenido,
    fecha: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('notas')
    .insert([nuevaNota])
    .select()
    .single()

  if (error) {
    console.error('Error al crear nota:', error)
    throw error
  }

  return data
}

export async function eliminarNota(id: string): Promise<void> {
  const { error } = await supabase
    .from('notas')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar nota:', error)
    throw error
  }
}

export async function actualizarNota(id: string, contenido: string): Promise<Nota> {
  const { data, error } = await supabase
    .from('notas')
    .update({ contenido })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error al actualizar nota:', error)
    throw error
  }

  return data
}

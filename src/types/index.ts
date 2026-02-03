export interface Nota {
  id: string;
  user_id: string;
  contenido: string;
  fecha: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
}

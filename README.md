# 📒 Notas App - Supabase CRUD

Aplicación web moderna de notas personales construida con **Vite + React + TypeScript + Tailwind CSS + Supabase**.

![Demo](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

---

## ✨ Características

- 🔐 **Autenticación completa** - Login y registro con Supabase Auth
- 📝 **CRUD de notas** - Crear, leer y eliminar notas personales
- 🔒 **Seguridad RLS** - Políticas de seguridad a nivel de fila
- 🎨 **Diseño moderno** - Interfaz elegante con Tailwind CSS
- 📱 **Responsive** - Funciona en móvil, tablet y desktop
- ⚡ **Rendimiento** - Construido con Vite para desarrollo rápido

---

## 🚀 Instrucciones de Instalación

### 1. Instalar Node.js

Si no tienes Node.js instalado, descárgalo desde [nodejs.org](https://nodejs.org/) o usa un gestor de paquetes:

```bash
# macOS con Homebrew
brew install node

# Windows con Chocolatey
choco install nodejs

# Linux (Ubuntu/Debian)
sudo apt update && sudo apt install nodejs npm
```

### 2. Instalar Dependencias

```bash
cd notas-app
npm install
```

### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🗄️ Configuración de Supabase

### Paso 1: Crear la Tabla `notas`

Ve al **SQL Editor** de tu proyecto Supabase y ejecuta:

```sql
-- Crear la tabla notas
CREATE TABLE notas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  fecha TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice para búsquedas por usuario
CREATE INDEX idx_notas_user_id ON notas(user_id);

-- Crear índice para ordenar por fecha
CREATE INDEX idx_notas_fecha ON notas(fecha DESC);
```

---

## 🔒 Políticas RLS (Row Level Security)

### PASO IMPORTANTE: Habilitar RLS

Primero, habilita RLS en la tabla:

```sql
-- Habilitar RLS en la tabla notas
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;
```

### Políticas de Seguridad

Copia y pega estas políticas en el **SQL Editor** de Supabase:

```sql
-- =====================================================
-- POLÍTICAS RLS PARA LA TABLA "notas"
-- Estas políticas aseguran que los usuarios solo puedan
-- ver, crear y eliminar sus PROPIAS notas
-- =====================================================

-- 1. POLÍTICA SELECT: Los usuarios solo pueden ver sus propias notas
CREATE POLICY "Usuarios pueden ver sus propias notas" 
ON notas FOR SELECT 
USING (auth.uid() = user_id);

-- 2. POLÍTICA INSERT: Los usuarios solo pueden crear notas para sí mismos
CREATE POLICY "Usuarios pueden crear sus propias notas" 
ON notas FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. POLÍTICA UPDATE: Los usuarios solo pueden actualizar sus propias notas
CREATE POLICY "Usuarios pueden actualizar sus propias notas" 
ON notas FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. POLÍTICA DELETE: Los usuarios solo pueden eliminar sus propias notas
CREATE POLICY "Usuarios pueden eliminar sus propias notas" 
ON notas FOR DELETE 
USING (auth.uid() = user_id);
```

### Explicación de las Políticas

| Política | Descripción | Seguridad |
|----------|-------------|-----------|
| **SELECT** | Solo devuelve notas donde `user_id` = usuario autenticado | ✅ Usuarios solo ven sus notas |
| **INSERT** | Solo permite insertar si `user_id` = usuario autenticado | ✅ No se pueden asignar notas a otros |
| **UPDATE** | Solo permite actualizar notas propias | ✅ Nadie puede editar notas ajenas |
| **DELETE** | Solo permite eliminar notas propias | ✅ Nadie puede borrar notas ajenas |

---

## 📁 Estructura del Proyecto

```
notas-app/
├── src/
│   ├── components/
│   │   ├── Auth.tsx          # Login y Registro
│   │   └── Notas.tsx         # CRUD de notas
│   ├── lib/
│   │   └── supabase.ts       # Cliente Supabase + funciones CRUD
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript
│   ├── App.tsx               # Componente principal
│   ├── main.tsx              # Punto de entrada
│   ├── App.css               # Estilos adicionales
│   ├── index.css             # Tailwind + estilos globales
│   └── vite-env.d.ts         # Tipos de Vite
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🔑 Credenciales Configuradas

Las credenciales de Supabase ya están configuradas en `src/lib/supabase.ts`:

```typescript
const supabaseUrl = 'https://eqzasbezmztzkudzowfk.supabase.co'
const supabaseKey = 'sb_publishable_7xSMJ04xXNoVxIQ4V-rb3A_tuT6rOTi'
```

---

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción |
| `npm run preview` | Previsualiza build de producción |

---

## 📝 Funcionalidades del CRUD

### Crear Nota
- Escribe en el textarea y presiona "Crear Nota"
- La nota se guarda automáticamente en Supabase

### Ver Notas
- Todas las notas del usuario se cargan automáticamente
- Ordenadas por fecha (más recientes primero)

### Eliminar Nota
- Pasa el mouse sobre una nota y aparece el ícono de papelera
- Click para eliminar (con confirmación)

---

## 🔐 Seguridad

- ✅ **RLS Habilitado**: Todas las operaciones están protegidas
- ✅ **Autenticación**: Solo usuarios registrados pueden acceder
- ✅ **Aislamiento de datos**: Cada usuario solo ve sus propias notas
- ✅ **Validación**: Contraseñas mínimo 6 caracteres

---

## 🐛 Solución de Problemas

### Error: "No inputs were found in config file"
Instala las dependencias: `npm install`

### Error de conexión con Supabase
Verifica que las credenciales en `src/lib/supabase.ts` sean correctas

### Error de CORS
En Supabase, ve a Authentication > URL Configuration y añade:
- `http://localhost:5173` (desarrollo)
- Tu dominio de producción

---

## 📄 Licencia

MIT License - Libre para usar y modificar.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Puedes:
- Reportar bugs
- Sugerir mejoras
- Enviar pull requests

---

**¡Disfruta tu app de notas!** 🎉

# 🔐 Password Vault - Frontend

Frontend moderno y seguro para el Password Vault, construido con React + TypeScript + Vite.

## 🎯 Características

- ✅ **Autenticación completa**: Signup, verificación por email, login
- 🔐 **Gestión segura de credenciales**: Crear, listar, ver y revelar passwords cifradas
- 🎨 **UI moderna y responsiva**: Mobile-first, dark theme, transiciones suaves
- 🔒 **Seguridad frontend**: JWT en sessionStorage, auto-logout en 401
- ⚡ **Performance**: Vite para dev rápido y builds optimizados
- 📝 **Type-safe**: TypeScript + Zod para validación de formularios
- ♿ **Accesible**: WCAG compliance, navegación por teclado

## 🏗️ Tech Stack

| Categoría | Tecnología |
|-----------|-----------|
| Framework | React 18 |
| Lenguaje | TypeScript |
| Build Tool | Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Formularios | React Hook Form + Zod |
| Estilos | CSS moderno (variables, Grid, Flexbox) |

## 📁 Estructura del Proyecto

```
Password-Vault-Frontend/
├── src/
│   ├── api/
│   │   └── client.ts          # Cliente Axios con interceptores JWT
│   ├── auth/
│   │   ├── AuthContext.tsx    # Context API para autenticación
│   │   ├── useAuth.ts         # Hook personalizado
│   │   └── ProtectedRoute.tsx # HOC para rutas protegidas
│   ├── pages/
│   │   ├── Signup.tsx         # Registro de usuario
│   │   ├── VerifyEmail.tsx    # Verificación de email
│   │   ├── Login.tsx          # Inicio de sesión
│   │   ├── VaultList.tsx      # Lista de credenciales
│   │   ├── VaultRegister.tsx  # Nueva credencial
│   │   └── VaultDetail.tsx    # Detalle y revelación de password
│   ├── App.tsx                # Router y configuración principal
│   ├── main.tsx               # Entry point
│   ├── styles.css             # Estilos globales
│   └── types.ts               # Tipos TypeScript
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Instalación y Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con la URL de tu backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### 4. Asegúrate de que el backend esté corriendo

El backend debe estar corriendo en `http://127.0.0.1:5000` (o la URL que configuraste).

## 🎮 Scripts Disponibles

```bash
# Desarrollo
npm run dev         # Inicia servidor de desarrollo con hot reload

# Producción
npm run build       # Compila TypeScript y construye para producción
npm run preview     # Preview del build de producción (puerto 5174)

# Linting
npm run lint        # Ejecuta ESLint
```

## 🔐 Flujo de Uso

### 1️⃣ Registro
- Ve a `/signup`
- Ingresa email y contraseña maestra (mín. 12 caracteres)
- Recibirás un email de verificación

### 2️⃣ Verificación
- Haz click en el link del email
- Serás redirigido a `/verify?token=...`
- Una vez verificado, puedes iniciar sesión

### 3️⃣ Login
- Ve a `/login`
- Ingresa tus credenciales
- El JWT se guarda automáticamente

### 4️⃣ Gestión del Vault
- **Lista**: Ver todas tus credenciales guardadas
- **Crear**: Agregar nueva credencial (requiere master password)
- **Ver**: Ver detalles de una credencial
- **Revelar**: Descifrar y mostrar la contraseña (requiere master password)

## 🎨 Diseño y Estilos

### Características CSS
- ✅ **CSS Variables** para theming consistente
- ✅ **Mobile-first** responsive design
- ✅ **Flexbox y Grid** para layouts modernos
- ✅ **Transiciones suaves** y animaciones
- ✅ **Dark theme** optimizado para reducir fatiga visual
- ✅ **Accesibilidad**: focus states, contrast ratios
- ✅ **Print styles** incluidos

### Tokens de Diseño
```css
/* Spacing: xs, sm, md, lg, xl, 2xl */
/* Colores: primary, secondary, success, error */
/* Borders: radius-sm, radius-md, radius-lg */
/* Shadows: shadow-sm, shadow-md, shadow-lg */
```

## 🔒 Seguridad

### Prácticas implementadas

1. **JWT en sessionStorage**: Evita XSS persistente (no usa localStorage)
2. **Auto-interceptor 401**: Logout automático si el token expira
3. **Master password nunca se guarda**: Solo se envía en formularios específicos
4. **Passwords reveladas temporalmente**: Auto-hide después de 30 segundos
5. **HTTPS recomendado**: En producción usar siempre HTTPS
6. **Validación client-side**: Zod schemas previenen datos malformados

### ⚠️ Notas de Seguridad

- La contraseña maestra **nunca se almacena** en el frontend
- Solo se envía al backend cuando es necesaria (registro, cifrado, descifrado)
- El JWT es **stateless** - logout simplemente borra el token del sessionStorage
- Las contraseñas reveladas se muestran temporalmente y deben copiarse manualmente

## 🌐 API Endpoints Consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/signup` | Registro de usuario |
| GET | `/auth/verify?token=...` | Verificación de email |
| POST | `/auth/login` | Autenticación |
| GET | `/vault/list` | Lista de credenciales |
| POST | `/vault/register` | Nueva credencial |
| GET | `/vault/:id` | Detalle de credencial |
| POST | `/vault/:id/reveal` | Revelar password cifrada |

## 📦 Build para Producción

```bash
# 1. Construir
npm run build

# 2. Los archivos estáticos estarán en ./dist
# 3. Puedes servirlos con cualquier servidor estático
```

### Opciones de deploy

#### Vercel
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

#### Servidor manual (Nginx, Apache, etc)
Solo sirve la carpeta `dist/` como archivos estáticos.

**Importante**: Configura el servidor para redirigir todas las rutas a `index.html` (SPA routing).

Ejemplo Nginx:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 🛠️ Personalización

### Cambiar colores del tema

Edita las variables CSS en `src/styles.css`:

```css
:root {
  --color-primary: #3b82f6;    /* Color principal */
  --color-bg-primary: #0b0f14; /* Fondo principal */
  /* ... más variables */
}
```

### Agregar nuevas páginas

1. Crea el componente en `src/pages/NuevaPagina.tsx`
2. Agrega la ruta en `src/App.tsx`:

```tsx
<Route path="/nueva" element={<NuevaPagina />} />
```

### Modificar validaciones

Edita los schemas Zod en cada página:

```tsx
const schema = z.object({
  email: z.string().email(),
  // ... tus reglas
});
```

## 🐛 Troubleshooting

### El backend no responde
- Verifica que el backend esté corriendo en el puerto correcto
- Revisa la variable `VITE_API_BASE_URL` en `.env`
- Abre DevTools > Network para ver los requests

### Error 401 al hacer requests
- Tu token expiró, vuelve a hacer login
- Verifica que el backend acepte el formato `Authorization: Bearer <token>`

### No se ven los estilos
- Reinicia el servidor de desarrollo (`npm run dev`)
- Limpia caché del navegador
- Verifica que `src/styles.css` esté importado en `main.tsx`

### TypeScript errors
```bash
# Regenerar tipos
rm -rf node_modules package-lock.json
npm install
```

## 📝 Mejoras Futuras

- [ ] Agregar edición de credenciales (PUT `/vault/:id`)
- [ ] Implementar eliminación de credenciales
- [ ] Sistema de categorías/tags
- [ ] Generador de contraseñas seguras
- [ ] Búsqueda avanzada y filtros
- [ ] Exportar credenciales (CSV, JSON)
- [ ] PWA con service workers
- [ ] Dark/Light theme toggle
- [ ] Autenticación 2FA

## 📄 Licencia

MIT License - Libre para uso personal y comercial.

## 👨‍💻 Autor

Desarrollado con ❤️ para el Holberton Portfolio Project.

---

**¿Necesitas ayuda?** Revisa la documentación del backend o abre un issue en GitHub.

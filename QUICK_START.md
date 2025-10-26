# 🚀 Quick Start - Password Vault Frontend

## Pasos rápidos para comenzar

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar el backend
Asegúrate de que el backend Flask esté corriendo:
```bash
# En el directorio del backend
flask --app app:create_app run
```

### 3. Configurar variables de entorno (opcional)
Si tu backend corre en otro puerto, crea un archivo `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

### 4. Iniciar el frontend
```bash
npm run dev
```

Abre tu navegador en: **http://localhost:5173**

---

## 🎯 Flujo de prueba rápida

1. **Registro** → Ve a `/signup`
   - Email: `test@example.com`
   - Password: `MySecurePassword123`

2. **Verificación** → Revisa tu email y haz click en el link

3. **Login** → Usa las mismas credenciales

4. **Crear credencial** → Click en "+ Nueva credencial"
   - App: `GitHub`
   - URL: `https://github.com/login`
   - Usuario: `miusuario`
   - Password: `mi_github_password`
   - Master password: `MySecurePassword123`

5. **Ver credencial** → Click en la card, ingresa master password para revelar

---

## 🛠️ Comandos útiles

```bash
# Desarrollo
npm run dev          # Servidor con hot reload

# Build producción
npm run build        # Compilar para producción
npm run preview      # Ver build localmente

# Linting
npm run lint         # Verificar código
```

---

## 🐛 Problemas comunes

**Error de conexión al backend:**
- Verifica que el backend esté corriendo en `http://127.0.0.1:5000`
- Revisa la consola del navegador (F12) para ver errores de red

**401 Unauthorized:**
- Tu token expiró, vuelve a hacer login
- Verifica que el backend esté usando JWT correctamente

**Formulario no valida:**
- La contraseña maestra debe tener al menos 12 caracteres
- El email debe ser válido

---

## 📚 Estructura rápida

```
src/
├── api/          → Cliente HTTP (Axios)
├── auth/         → Sistema de autenticación
├── pages/        → Todas las páginas/vistas
├── App.tsx       → Router principal
├── main.tsx      → Entry point
├── styles.css    → Estilos globales
└── types.ts      → Tipos TypeScript
```

---

## 💡 Tips

- **sessionStorage**: El JWT se guarda aquí (se borra al cerrar el navegador)
- **Master password**: Nunca se almacena, solo se envía cuando es necesario
- **Responsivo**: Funciona en mobile, tablet y desktop
- **Dark theme**: Optimizado para reducir fatiga visual

---

¡Listo para desarrollar! 🎉


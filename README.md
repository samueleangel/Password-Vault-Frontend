# 🔐 Password Vault - Frontend

Modern and secure frontend for Password Vault, built with React + TypeScript + Vite.

## 🎯 Features

- ✅ **Complete authentication**: Signup, email verification, login
- 🔐 **Secure credential management**: Create, list, view and reveal encrypted passwords
- 🎨 **Modern responsive UI**: Mobile-first, dark theme, smooth transitions
- 🔒 **Frontend security**: JWT in sessionStorage, auto-logout on 401
- ⚡ **Performance**: Vite for fast dev and optimized builds
- 📝 **Type-safe**: TypeScript + Zod for form validation
- ♿ **Accessible**: WCAG compliance, keyboard navigation

## 🏗️ Tech Stack

| Category | Technology |
|-----------|-----------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Styles | Modern CSS (variables, Grid, Flexbox) |

## 📁 Project Structure

```
Password-Vault-Frontend/
├── src/
│   ├── api/
│   │   └── client.ts          # Axios client with JWT interceptors
│   ├── auth/
│   │   ├── AuthContext.tsx    # Context API for authentication
│   │   ├── useAuth.ts         # Custom hook
│   │   └── ProtectedRoute.tsx # HOC for protected routes
│   ├── pages/
│   │   ├── Signup.tsx         # User registration
│   │   ├── VerifyEmail.tsx    # Email verification
│   │   ├── Login.tsx          # Login
│   │   ├── VaultList.tsx      # Credentials list
│   │   ├── VaultRegister.tsx  # New credential
│   │   └── VaultDetail.tsx    # Detail and password reveal
│   ├── App.tsx                # Router and main configuration
│   ├── main.tsx               # Entry point
│   ├── styles.css             # Global styles
│   └── types.ts               # TypeScript types
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Installation and Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your backend URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

### 3. Start development server

```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

### 4. Make sure the backend is running

The backend must be running at `http://127.0.0.1:5000` (or your configured URL).

## 🎮 Available Scripts

```bash
# Development
npm run dev         # Start dev server with hot reload

# Production
npm run build       # Compile TypeScript and build for production
npm run preview     # Preview production build (port 5174)

# Linting
npm run lint        # Run ESLint
```

## 🔐 User Flow

### 1️⃣ Registration
- Go to `/signup`
- Enter email and master password (min. 12 characters)
- You'll receive a verification email

### 2️⃣ Verification
- Click the link in the email
- You'll be redirected to `/verify?token=...`
- Once verified, you can log in

### 3️⃣ Login
- Go to `/login`
- Enter your credentials
- JWT is saved automatically

### 4️⃣ Vault Management
- **List**: View all your saved credentials
- **Create**: Add new credential (requires master password)
- **View**: See credential details
- **Reveal**: Decrypt and show password (requires master password)

## 🎨 Design and Styles

### CSS Features
- ✅ **CSS Variables** for consistent theming
- ✅ **Mobile-first** responsive design
- ✅ **Flexbox and Grid** for modern layouts
- ✅ **Smooth transitions** and animations
- ✅ **Dark theme** optimized to reduce eye strain
- ✅ **Accessibility**: focus states, contrast ratios
- ✅ **Print styles** included

### Design Tokens
```css
/* Spacing: xs, sm, md, lg, xl, 2xl */
/* Colors: primary, secondary, success, error */
/* Borders: radius-sm, radius-md, radius-lg */
/* Shadows: shadow-sm, shadow-md, shadow-lg */
```

## 🔒 Security

### Implemented Practices

1. **JWT in sessionStorage**: Prevents persistent XSS (doesn't use localStorage)
2. **Auto-interceptor 401**: Automatic logout if token expires
3. **Master password never saved**: Only sent in specific forms
4. **Revealed passwords temporary**: Auto-hide after 30 seconds
5. **HTTPS recommended**: Always use HTTPS in production
6. **Client-side validation**: Zod schemas prevent malformed data

### ⚠️ Security Notes

- Master password is **never stored** in frontend
- Only sent to backend when necessary (registration, encryption, decryption)
- JWT is **stateless** - logout simply clears token from sessionStorage
- Revealed passwords are shown temporarily and must be manually copied

## 🌐 API Endpoints Consumed

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | User registration |
| GET | `/auth/verify?token=...` | Email verification |
| POST | `/auth/login` | Authentication |
| GET | `/vault/list` | List credentials |
| POST | `/vault/register` | New credential |
| GET | `/vault/:id` | Credential detail |
| POST | `/vault/:id/reveal` | Reveal encrypted password |

## 📦 Build for Production

```bash
# 1. Build
npm run build

# 2. Static files will be in ./dist
# 3. You can serve them with any static server
```

### Deploy Options

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

#### Manual server (Nginx, Apache, etc)
Just serve the `dist/` folder as static files.

**Important**: Configure the server to redirect all routes to `index.html` (SPA routing).

Nginx example:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 🛠️ Customization

### Change theme colors

Edit CSS variables in `src/styles.css`:

```css
:root {
  --color-primary: #3b82f6;    /* Primary color */
  --color-bg-primary: #0b0f14; /* Primary background */
  /* ... more variables */
}
```

### Add new pages

1. Create component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:

```tsx
<Route path="/new" element={<NewPage />} />
```

### Modify validations

Edit Zod schemas in each page:

```tsx
const schema = z.object({
  email: z.string().email(),
  // ... your rules
});
```

## 🐛 Troubleshooting

### Backend doesn't respond
- Verify backend is running on correct port
- Check `VITE_API_BASE_URL` variable in `.env`
- Open DevTools > Network to see requests

### 401 Error on requests
- Your token expired, log in again
- Verify backend accepts `Authorization: Bearer <token>` format

### Styles not showing
- Restart dev server (`npm run dev`)
- Clear browser cache
- Verify `src/styles.css` is imported in `main.tsx`

### TypeScript errors
```bash
# Regenerate types
rm -rf node_modules package-lock.json
npm install
```

## 📝 Future Improvements

- [ ] Add credential editing (PUT `/vault/:id`)
- [ ] Implement credential deletion
- [ ] Category/tag system
- [ ] Secure password generator
- [ ] Advanced search and filters
- [ ] Export credentials (CSV, JSON)
- [ ] PWA with service workers
- [ ] Dark/Light theme toggle
- [ ] 2FA authentication

## 📄 License

MIT License - Free for personal and commercial use.

## 👨‍💻 Author

Developed with ❤️ for the Holberton Portfolio Project.

---

**Need help?** Check the backend documentation or open an issue on GitHub.

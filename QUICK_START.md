# 🚀 Quick Start - Password Vault Frontend

## Quick steps to get started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure the backend
Make sure the Flask backend is running:
```bash
# In the backend directory
flask --app app:create_app run
```

### 3. Configure environment variables (optional)
If your backend runs on a different port, create a `.env` file:
```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

### 4. Start the frontend
```bash
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 🎯 Quick test flow

1. **Registration** → Go to `/signup`
   - Email: `test@example.com`
   - Password: `MySecurePassword123`

2. **Verification** → Check your email and click the link

3. **Login** → Use the same credentials

4. **Create credential** → Click "+ New credential"
   - App: `GitHub`
   - URL: `https://github.com/login`
   - Username: `myusername`
   - Password: `my_github_password`
   - Master password: `MySecurePassword123`

5. **View credential** → Click the card, enter master password to reveal

---

## 🛠️ Useful commands

```bash
# Development
npm run dev          # Server with hot reload

# Production build
npm run build        # Compile for production
npm run preview      # View build locally

# Linting
npm run lint         # Verify code
```

---

## 🐛 Common problems

**Backend connection error:**
- Verify backend is running at `http://127.0.0.1:5000`
- Check browser console (F12) for network errors

**401 Unauthorized:**
- Your token expired, log in again
- Verify backend is using JWT correctly

**Form doesn't validate:**
- Master password must be at least 12 characters
- Email must be valid

---

## 📚 Quick structure

```
src/
├── api/          → HTTP Client (Axios)
├── auth/         → Authentication system
├── pages/        → All pages/views
├── App.tsx       → Main router
├── main.tsx      → Entry point
├── styles.css    → Global styles
└── types.ts      → TypeScript types
```

---

## 💡 Tips

- **sessionStorage**: JWT is saved here (cleared when browser closes)
- **Master password**: Never stored, only sent when needed
- **Responsive**: Works on mobile, tablet and desktop
- **Dark theme**: Optimized to reduce eye strain

---

Ready to develop! 🎉

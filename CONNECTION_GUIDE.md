# 🔗 Backend Connection Guide

## Repository Information

**Backend Repository**: [holberton-passVault](https://github.com/LuisMay12/holberton-passVault)  
**Tech Stack**: Flask + PostgreSQL + Argon2id + AES-256-GCM  
**Authentication**: JWT Bearer tokens

---

## 📋 Endpoint Compatibility Check

### ✅ Authentication Endpoints

| Frontend Expects | Backend Provides | Status |
|-----------------|------------------|--------|
| `POST /auth/signup` | `POST /auth/signup` | ✅ Match |
| `GET /auth/verify?token=...` | `GET /auth/verify?token=...` | ✅ Match |
| `POST /auth/login` | `POST /auth/login` | ✅ Match |

### ✅ Vault Endpoints

| Frontend Expects | Backend Provides | Status |
|-----------------|------------------|--------|
| `GET /vault/list` | `GET /vault/list` | ✅ Match |
| `POST /vault/register` | `POST /vault/register` | ✅ Match |
| `GET /vault/:id` | `GET /vault/:id` | ✅ Match |
| `POST /vault/:id/reveal` | `POST /vault/:id/reveal` | ✅ Match |

---

## 🚀 Setup Steps

### 1. Clone the Backend Repository

```bash
# Navigate to your Desktop
cd C:\Users\Samuel\Desktop

# Clone the backend repository
# If git is not available in PowerShell, use WSL:
wsl bash -c "cd /mnt/c/Users/Samuel/Desktop && git clone https://github.com/LuisMay12/holberton-passVault.git"
```

### 2. Set Up PostgreSQL (Backend Requirement)

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker run --name mydb \
  -e POSTGRES_PASSWORD=secret123 \
  -p 5432:5432 \
  -d postgres
```

#### Option B: Local PostgreSQL Installation

Ensure PostgreSQL is running on port 5432.

### 3. Configure Backend Environment

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql+psycopg2://postgres:secret123@localhost:5432/postgres
SECRET_KEY=change_me_in_production
JWT_SECRET_KEY=jwt_secret_change_me_in_production
```

### 4. Install Backend Dependencies

```bash
cd holberton-passVault

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows PowerShell:
.venv\Scripts\activate
# WSL:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 5. Initialize Database

```bash
# Run migrations
flask --app app:create_app db upgrade
```

### 6. Configure CORS (CRITICAL)

The backend needs to allow requests from the frontend. Add this to the backend's `app.py` or `extensions.py`:

```python
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for frontend
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # ... rest of your app configuration
    
    return app
```

Don't forget to install `flask-cors`:
```bash
pip install flask-cors
```

### 7. Start the Backend Server

```bash
flask --app app:create_app run
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

### 8. Verify Frontend Configuration

Your frontend is already configured to connect to `http://127.0.0.1:5000` by default.

If you need to change it, create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

### 9. Start the Frontend

```bash
cd Password-Vault-Frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🧪 Testing the Connection

### Test Backend Health

```bash
curl http://127.0.0.1:5000/health
```

Expected response:
```json
{"status": "healthy"}
```

### Test Complete Flow

1. **Open frontend**: `http://localhost:5173`
2. **Go to Signup**: `/signup`
3. **Register**: Enter email and master password
4. **Verify**: Check email for verification link
5. **Login**: Use credentials
6. **Access Vault**: Should redirect to `/vault`
7. **Create Credential**: Click "+ New credential"
8. **View Details**: Click on credential card
9. **Reveal Password**: Enter master password

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Add CORS configuration to backend (see step 6 above)

### Issue: Connection Refused

**Error**: `Network Error` or `Failed to fetch`

**Solution**: 
- Verify backend is running on port 5000
- Check backend terminal for config issues
- Test with: `curl http://127.0.0.1:5000/health`

### Issue: 401 Unauthorized

**Error**: After successful login, vault requests fail

**Solution**:
- Verify JWT is being saved in sessionStorage
- Check browser DevTools > Application > sessionStorage for `pv_token`
- Verify Authorization header is being sent (check Network tab)

### Issue: Database Connection Failed

**Error**: `could not connect to server`

**Solution**:
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Check PostgreSQL logs

### Issue: Port Already in Use

**Error**: `Address already in use`

**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process or use different port
flask --app app:create_app run --port 5001

# Update frontend .env
VITE_API_BASE_URL=http://127.0.0.1:5001
```

---

## 📊 Request/Response Examples

### Signup Request

```json
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "master_password": "MySecurePassword123"
}
```

### Login Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Vault List Response

```json
{
  "items": [
    {
      "id": "1",
      "app_name": "GitHub",
      "app_login_url": "https://github.com/login",
      "username": "myuser",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Reveal Password Response

```json
{
  "password": "decrypted_password_here"
}
```

---

## ✅ Checklist

Before testing, ensure:

- [ ] PostgreSQL is running (port 5432)
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Database migrations applied (`flask db upgrade`)
- [ ] CORS configured in backend
- [ ] Backend server running (`flask run`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend server running (`npm run dev`)
- [ ] `.env` configured (if needed)

---

## 🎯 Expected Behavior

Once everything is connected:

1. **Frontend loads** without errors
2. **Signup form** submits successfully
3. **Email verification** works
4. **Login** returns JWT token
5. **Vault list** shows credentials
6. **Create credential** saves successfully
7. **Reveal password** decrypts correctly
8. **Logout** clears session

---

## 📞 Need Help?

If you encounter issues:

1. Check backend logs (terminal where Flask is running)
2. Check frontend console (browser DevTools > Console)
3. Check network requests (browser DevTools > Network)
4. Verify all endpoints match table above
5. Test backend independently with `curl` or Postman

---

**Backend Repository**: https://github.com/LuisMay12/holberton-passVault  
**Frontend Repository**: Your local project  
**Status**: Ready to connect ✅


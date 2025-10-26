# 🔧 Backend Configuration

## Prerequisites

1. **PostgreSQL running** (Docker or local installation)
2. **Flask Backend** downloaded and configured
3. **Python 3.11+** installed

---

## Start the Backend

### Option 1: With Docker (PostgreSQL)

```bash
# Start PostgreSQL
docker run --name mydb \
  -e POSTGRES_PASSWORD=secret123 \
  -p 5432:5432 \
  -d postgres
```

### Option 2: Local PostgreSQL

Make sure PostgreSQL is running on port 5432.

---

## Configure the Backend

1. **Navigate to backend directory**:
   ```bash
   cd /path/to/your/backend
   ```

2. **Create `.env` file**:
   ```env
   DATABASE_URL=postgresql+psycopg2://postgres:secret123@localhost:5432/postgres
   SECRET_KEY=change_me_in_production
   JWT_SECRET_KEY=jwt_secret_change_me_in_production
   ```

3. **Activate virtual environment**:
   ```bash
   # Linux/WSL
   source .venv/bin/activate
   
   # Windows
   .venv\Scripts\activate
   ```

4. **Install dependencies** (if not already done):
   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize database**:
   ```bash
   flask --app app:create_app db upgrade
   ```

6. **Start server**:
   ```bash
   flask --app app:create_app run
   ```

---

## Verify it Works

You should see in the terminal:

```
 * Serving Flask app 'app:create_app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in production.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

---

## Test the Backend

Open another terminal and run:

```bash
# Health check test
curl http://127.0.0.1:5000/health

# Should respond something like:
# {"status": "healthy"}
```

---

## Configure CORS (IMPORTANT)

If the backend doesn't have CORS configured, add it:

1. **Install flask-cors**:
   ```bash
   pip install flask-cors
   ```

2. **In your `app.py` or `extensions.py`**:
   ```python
   from flask_cors import CORS
   
   def create_app():
       app = Flask(__name__)
       
       # Configure CORS
       CORS(app, resources={
           r"/*": {
               "origins": ["http://localhost:5173"],
               "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
               "allow_headers": ["Content-Type", "Authorization"]
           }
       })
       
       # ... rest of configuration
       return app
   ```

---

## Endpoints Expected by Frontend

Frontend makes requests to:

### Authentication
- `POST /auth/signup` - User registration
- `GET /auth/verify?token=...` - Email verification
- `POST /auth/login` - Login

### Vault
- `GET /vault/list` - List credentials
- `POST /vault/register` - New credential
- `GET /vault/:id` - Credential detail
- `POST /vault/:id/reveal` - Reveal encrypted password

---

## Troubleshooting

### Error: "Connection refused"
```
❌ Backend is not running
✅ Run: flask --app app:create_app run
```

### Error: "Database connection failed"
```
❌ PostgreSQL is not running
✅ Start PostgreSQL (Docker or local service)
```

### Error: "Module not found"
```
❌ Missing dependencies
✅ Run: pip install -r requirements.txt
```

### Error: "Port 5000 already in use"
```
❌ Another process is using port 5000
✅ Kill the process or use another port:
   flask --app app:create_app run --port 5001
   
   Then update in frontend:
   VITE_API_BASE_URL=http://127.0.0.1:5001
```

---

## Complete Flow

```
1. PostgreSQL running → Port 5432
2. Flask Backend running → Port 5000
3. Vite Frontend running → Port 5173
4. Open browser → http://localhost:5173
5. Done! Frontend ↔ Backend connected
```

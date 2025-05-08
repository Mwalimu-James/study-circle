# 📚 Study Circle

**Study Circle** is a full-stack web application that helps students connect, form study groups, share resources, and organize sessions. Built with Flask (backend), React (frontend), PostgreSQL, and deployed using Heroku and Netlify.

---

## ✨ Features

- 🔒 User registration & login (with JWT authentication)
- 👥 Create, join, and delete study groups
- 📁 Upload and access shared files
- 🧠 Organize and view study sessions
- 📝 Post and read shared articles
- 🛡️ Role-based access for admins (moderation, elevated permissions)

---

## 🧱 Tech Stack

| Frontend       | Backend        | Deployment      | DB         |
|----------------|----------------|------------------|------------|
| React + Vite   | Flask + JWT    | Netlify (UI)     | PostgreSQL |
| Tailwind CSS   | SQLAlchemy ORM | Heroku (API)     |            |

---

## 🚀 Getting Started (Local)

### 🔧 Backend (Flask)
```bash
# 1. Clone the repo
git clone https://github.com/your-username/study-circle.git
cd study-circle/backend

# 2. Set up virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run server locally
flask run
💻 Frontend (React)
bash
Copy
Edit
cd ../frontend

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
🧪 Environment Variables
.env (Backend)
env
Copy
Edit
SECRET_KEY=your-secret
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=postgresql://user:password@localhost:5432/study_circle
.env (Frontend)
env
Copy
Edit
VITE_API_BASE_URL=http://localhost:5000
☁️ Deployment
Backend → Heroku
Add a Procfile with:

arduino
Copy
Edit
web: gunicorn run:app
Push to Heroku and provision a PostgreSQL add-on.

Frontend → Netlify
Connect to Git or drag dist/ folder

Set VITE_API_BASE_URL=https://your-heroku-app.herokuapp.com

🧑‍💻 Admin Access
To make a user admin:

sql
Copy
Edit
UPDATE users SET is_admin = TRUE WHERE email = 'admin@example.com';
🤝 Contributing
Pull requests are welcome. Open an issue first for feature discussions.

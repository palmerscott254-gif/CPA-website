# CPA Academy - Setup Instructions

## 🚀 Quick Start

### Backend Setup (Django)

1. **Navigate to backend directory**
   ```bash
   cd CPA-website/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)

1. **Navigate to frontend directory**
   ```bash
   cd CPA-website/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

## 🔧 Environment Variables

Create `.env` file in backend directory:
```env
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
REACT_APP_API_BASE=http://localhost:8000/api
```

## 📊 Admin Panel

Access the admin panel at `/admin` with your superuser credentials to:
- Manage users, subjects, units, materials, and quizzes
- View quiz attempts and user progress
- Upload and manage study materials

## 🎨 Features

- **Modern UI**: 2026 design standards with glassmorphism
- **Dark/Light Mode**: Complete theme system
- **Responsive Design**: Mobile-first approach
- **JWT Authentication**: Secure user management
- **File Uploads**: Multi-format support (PDF, DOC, PPT, MP4)
- **Quiz System**: Interactive learning assessments
- **Admin Panel**: Complete content management

## 🚀 Production Deployment

1. **Backend**: Use `production.py` settings
2. **Frontend**: Run `npm run build`
3. **Database**: Configure PostgreSQL for production
4. **Static Files**: Run `python manage.py collectstatic`
5. **Environment**: Set production environment variables

## 🛠️ Troubleshooting

- **Admin Import Error**: Fixed by renaming `admin.py` to `custom_admin.py`
- **CORS Issues**: Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`
- **File Upload**: Check file size limits and allowed extensions
- **Database**: Ensure migrations are up to date

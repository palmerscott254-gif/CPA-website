# CPA Academy - Learning Management System

A comprehensive learning management system for CPA (Certified Public Accountant) exam preparation, built with Django REST Framework backend and React frontend.

## 🚀 Features

- **Subject Management**: Organize CPA topics into subjects and units
- **Study Materials**: Upload and download PDF study materials
- **Practice Quizzes**: Interactive quizzes with scoring system
- **User Authentication**: Secure login/registration with JWT tokens
- **Search & Filter**: Find content quickly with advanced search
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **JWT Authentication** - Secure user authentication
- **SQLite** - Database (easily configurable for PostgreSQL/MySQL)
- **CORS Headers** - Cross-origin resource sharing

### Frontend
- **React 18.2.0** - User interface library
- **React Router 6.8.0** - Client-side routing
- **Axios** - HTTP client for API calls
- **Modern CSS** - Responsive design with inline styles

## 📁 Project Structure

```
CPA-website/
├── backend/                 # Django backend
│   ├── cpa_academy/         # Main Django project
│   ├── users/               # User management app
│   ├── courses/             # Subjects and units app
│   ├── materials/           # Study materials app
│   ├── quizzes/             # Quiz system app
│   ├── requirements.txt     # Python dependencies
│   └── manage.py           # Django management script
└── Frontend/               # React frontend
    ├── public/             # Static files
    ├── src/                # React source code
    │   ├── Components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── api.js          # API utilities
    │   ├── app.js          # Main app component
    │   └── index.js        # Entry point
    └── package.json        # Node.js dependencies
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (you have Python 3.13.7 ✅)
- Node.js 16+ and npm (you need to install this)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd "CPA-website\backend"
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start the Django development server:**
   ```bash
   python manage.py runserver
   ```
   
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Install Node.js** (if not already installed):
   - Download from: https://nodejs.org/
   - Choose the LTS version

2. **Navigate to frontend directory:**
   ```bash
   cd "CPA-website\Frontend"
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

4. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration
- **Database**: SQLite by default (configure in `settings.py` for production)
- **CORS**: Configured for `localhost:3000` (frontend)
- **JWT**: 60-minute access tokens, 7-day refresh tokens
- **File Uploads**: PDF files up to 20MB

### Frontend Configuration
- **API Base URL**: `http://localhost:8000/api` (configurable via environment variables)
- **Authentication**: JWT tokens stored in localStorage
- **Routing**: React Router v6 with protected routes

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Token refresh

### Subjects & Units
- `GET /api/subjects/` - List all subjects
- `GET /api/subjects/units/` - List all units

### Materials
- `GET /api/materials/` - List materials (with filters)
- `POST /api/materials/upload/` - Upload material (authenticated)
- `GET /api/materials/{id}/download/` - Download material

### Quizzes
- `GET /api/quizzes/sets/{id}/` - Get quiz details
- `POST /api/quizzes/attempts/` - Submit quiz attempt

## 🎨 Frontend Pages

- **Home** (`/`) - Welcome page with subjects overview
- **Units** (`/units`) - Browse all study units with search
- **Unit Detail** (`/units/:id`) - Detailed unit view with materials
- **Materials** (`/materials`) - Browse and download study materials
- **Quizzes** (`/quizzes`) - Practice quiz interface
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **CORS Protection** - Configured for specific origins
- **File Type Validation** - Only PDF files allowed for materials
- **File Size Limits** - 20MB maximum file size
- **Password Validation** - Django's built-in password validators

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors:**
   - Make sure you're in the correct directory
   - Run `pip install -r requirements.txt` for backend
   - Run `npm install` for frontend

2. **CORS errors:**
   - Ensure Django server is running on port 8000
   - Check CORS settings in `settings.py`

3. **Database errors:**
   - Run `python manage.py migrate` to create database tables
   - Check database permissions

4. **Frontend not loading:**
   - Ensure Node.js is installed
   - Run `npm install` in the Frontend directory
   - Check if port 3000 is available

### Getting Help

- Check the Django logs in the terminal
- Use browser developer tools for frontend debugging
- Ensure both servers are running simultaneously

## 🚀 Deployment

### Backend Deployment
- Configure production database (PostgreSQL recommended)
- Set `DEBUG = False` in settings
- Configure static file serving
- Set up proper CORS origins

### Frontend Deployment
- Run `npm run build` to create production build
- Serve static files with nginx or similar
- Configure API base URL for production

## 📝 Development Notes

### Code Quality
- All Python code follows PEP 8 standards
- React components use modern hooks and functional programming
- Consistent error handling throughout the application
- Responsive design principles applied

### Future Enhancements
- Add user progress tracking
- Implement quiz scoring and analytics
- Add material rating and review system
- Create admin dashboard for content management
- Add email notifications for new materials

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

---

**Happy Learning! 📚✨**

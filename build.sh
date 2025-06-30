#!/bin/bash

echo "🚀 Building University Cloud Backend and Frontend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install backend dependencies
echo "📥 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Run Django migrations
echo "🗄️ Running Django migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser if it doesn't exist
echo "👤 Creating superuser..."
python manage.py shell -c "
from django.contrib.auth.models import User
from storage.models import User as StorageUser
if not User.objects.filter(username='admin').exists():
    user = User.objects.create_superuser('admin', 'admin@university.com', 'admin123')
    storage_user = StorageUser.objects.create(
        first_name='Admin',
        last_name='User',
        email='admin@university.com',
        role='teacher'
    )
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"

# Start Django backend in background
echo "🌐 Starting Django backend on http://localhost:8000..."
python manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!

cd ..

# Install frontend dependencies
echo "📥 Installing frontend dependencies..."
cd react-app
npm install

# Start React frontend
echo "⚛️ Starting React frontend on http://localhost:3000..."
npm start &
REACT_PID=$!

cd ..

echo ""
echo "✅ Build complete! Both services are running:"
echo "   🌐 Backend: http://localhost:8000"
echo "   ⚛️ Frontend: http://localhost:3000"
echo "   📚 Admin: http://localhost:8000/admin (admin/admin123)"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
trap "echo '🛑 Stopping services...'; kill $DJANGO_PID $REACT_PID; exit" INT
wait 
# University Cloud

Облачная платформа для университетов с системой управления файлами, курсами и пользователями.

## 🚀 Быстрая установка

### Автоматическая установка (рекомендуется)

**Для macOS/Linux:**
```bash
./install.sh
```

**Для Windows:**
```cmd
install.bat
```

Эти скрипты автоматически установят все зависимости и настроят проект.

### Ручная установка

#### Требования
- Node.js 16+ и npm
- Python 3.8+ и pip
- PostgreSQL (для продакшена)

#### Шаги установки

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/Liroyz/university_cloud_final.git
   cd university_cloud_final
   ```

2. **Установите зависимости фронтенда:**
   ```bash
   npm install
   ```

3. **Создайте виртуальное окружение Python:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # macOS/Linux
   # или
   venv\Scripts\activate.bat  # Windows
   ```

4. **Установите зависимости бэкенда:**
   ```bash
   pip install -r backend/requirements.txt
   ```

5. **Настройте базу данных:**
   ```bash
   cd backend
   python manage.py migrate
   python manage.py createsuperuser  # опционально
   cd ..
   ```

## 🏃‍♂️ Запуск проекта

### Разработка

1. **Запустите бэкенд:**
   ```bash
   cd backend
   source ../venv/bin/activate  # macOS/Linux
   # или
   venv\Scripts\activate.bat  # Windows
   python manage.py runserver
   ```

2. **Запустите фронтенд (в новом терминале):**
   ```bash
   npm start
   ```

### Docker (альтернативный способ)

```bash
./build.sh
docker-compose up --build
```

## 🌐 Доступ к приложению

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **API:** http://localhost:8000/api

## 📚 Документация

- [AUTHENTICATION.md](AUTHENTICATION.md) - Документация по аутентификации
- [API Documentation](http://localhost:8000/api/) - Swagger документация API

## 🛠️ Технологии

### Frontend
- React 18
- TypeScript
- Styled Components
- Axios

### Backend
- Django 5.2
- Django REST Framework
- JWT Authentication
- PostgreSQL
- MinIO Storage

## 📁 Структура проекта

```
university_cloud_final/
├── backend/                 # Django бэкенд
│   ├── backend/            # Настройки проекта
│   ├── storage/            # Основное приложение
│   └── requirements.txt    # Python зависимости
├── src/                    # React фронтенд
│   ├── components/         # React компоненты
│   ├── pages/             # Страницы приложения
│   ├── services/          # API сервисы
│   └── styles/            # Стили
├── install.sh             # Скрипт установки для Unix
├── install.bat            # Скрипт установки для Windows
└── README.md              # Документация
``` 
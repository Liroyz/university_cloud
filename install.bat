@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM University Cloud - Install Dependencies Script for Windows
REM Этот скрипт устанавливает все необходимые зависимости для фронтенда и бэкенда

echo 🚀 University Cloud - Установка зависимостей
echo ==============================================

REM Проверяем наличие необходимых инструментов
echo 📋 Проверка требований...

REM Проверяем Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не найден. Установите Node.js с https://nodejs.org/
    pause
    exit /b 1
)

REM Проверяем npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не найден. Установите npm
    pause
    exit /b 1
)

REM Проверяем Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не найден. Установите Python с https://python.org/
    pause
    exit /b 1
)

REM Проверяем pip
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip не найден. Установите pip
    pause
    exit /b 1
)

echo ✅ Все требования выполнены

REM Установка зависимостей фронтенда
echo.
echo 📦 Установка зависимостей фронтенда...

if exist "package.json" (
    echo 📥 Установка npm пакетов...
    call npm install
    echo ✅ Зависимости фронтенда установлены
) else (
    echo ❌ package.json не найден
    pause
    exit /b 1
)

REM Установка зависимостей бэкенда
echo.
echo 🐍 Установка зависимостей бэкенда...

REM Создаем виртуальное окружение если его нет
if not exist "venv" (
    echo 🔧 Создание виртуального окружения Python...
    python -m venv venv
)

REM Активируем виртуальное окружение
echo 🔧 Активация виртуального окружения...
call venv\Scripts\activate.bat

REM Обновляем pip
echo 📥 Обновление pip...
python -m pip install --upgrade pip

REM Устанавливаем зависимости
if exist "backend\requirements.txt" (
    echo 📥 Установка Python пакетов...
    pip install -r backend\requirements.txt
    echo ✅ Зависимости бэкенда установлены
) else (
    echo ❌ backend\requirements.txt не найден
    pause
    exit /b 1
)

REM Настройка базы данных
echo.
echo 🗄️  Настройка базы данных...

REM Переходим в папку backend
cd backend

REM Выполняем миграции
echo 🔄 Выполнение миграций...
python manage.py migrate

REM Создаем суперпользователя (опционально)
echo.
set /p create_superuser="🤔 Создать суперпользователя Django? (y/n): "
if /i "!create_superuser!"=="y" (
    echo 👤 Создание суперпользователя...
    python manage.py createsuperuser
)

REM Возвращаемся в корневую папку
cd ..

REM Деактивируем виртуальное окружение
call venv\Scripts\deactivate.bat

REM Проверка установки
echo.
echo 🔍 Проверка установки...

echo 📋 Node.js версия:
node --version

echo 📋 npm версия:
npm --version

call venv\Scripts\activate.bat
echo 📋 Python версия:
python --version

echo 📋 pip версия:
pip --version
call venv\Scripts\deactivate.bat

echo ✅ Проверка завершена

REM Показываем инструкции по запуску
echo.
echo 🎉 Установка завершена!
echo ==============================================
echo.
echo 📋 Для запуска проекта используйте:
echo.
echo 1️⃣  Запуск бэкенда:
echo    cd backend
echo    venv\Scripts\activate.bat
echo    python manage.py runserver
echo.
echo 2️⃣  Запуск фронтенда (в новом терминале):
echo    npm start
echo.
echo 🌐 Приложение будет доступно по адресам:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo    API:      http://localhost:8000/api
echo.
echo 📚 Дополнительная документация:
echo    README.md - Основная документация
echo    AUTHENTICATION.md - Документация по аутентификации
echo.

pause 
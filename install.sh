#!/bin/bash

# University Cloud - Install Dependencies Script
# Этот скрипт устанавливает все необходимые зависимости для фронтенда и бэкенда

set -e  # Остановить выполнение при ошибке

echo "🚀 University Cloud - Установка зависимостей"
echo "=============================================="

# Проверяем наличие необходимых инструментов
check_requirements() {
    echo "📋 Проверка требований..."
    
    # Проверяем Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js не найден. Установите Node.js с https://nodejs.org/"
        exit 1
    fi
    
    # Проверяем npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm не найден. Установите npm"
        exit 1
    fi
    
    # Проверяем Python
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 не найден. Установите Python 3"
        exit 1
    fi
    
    # Проверяем pip
    if ! command -v pip3 &> /dev/null; then
        echo "❌ pip3 не найден. Установите pip3"
        exit 1
    fi
    
    echo "✅ Все требования выполнены"
}

# Установка зависимостей фронтенда
install_frontend() {
    echo ""
    echo "📦 Установка зависимостей фронтенда..."
    
    if [ -f "package.json" ]; then
        echo "📥 Установка npm пакетов..."
        npm install
        echo "✅ Зависимости фронтенда установлены"
    else
        echo "❌ package.json не найден"
        exit 1
    fi
}

# Установка зависимостей бэкенда
install_backend() {
    echo ""
    echo "🐍 Установка зависимостей бэкенда..."
    
    # Создаем виртуальное окружение если его нет
    if [ ! -d "venv" ]; then
        echo "🔧 Создание виртуального окружения Python..."
        python3 -m venv venv
    fi
    
    # Активируем виртуальное окружение
    echo "🔧 Активация виртуального окружения..."
    source venv/bin/activate
    
    # Обновляем pip
    echo "📥 Обновление pip..."
    pip install --upgrade pip
    
    # Устанавливаем зависимости
    if [ -f "backend/requirements.txt" ]; then
        echo "📥 Установка Python пакетов..."
        pip install -r backend/requirements.txt
        echo "✅ Зависимости бэкенда установлены"
    else
        echo "❌ backend/requirements.txt не найден"
        exit 1
    fi
    
    # Деактивируем виртуальное окружение
    deactivate
}

# Настройка базы данных
setup_database() {
    echo ""
    echo "🗄️  Настройка базы данных..."
    
    # Активируем виртуальное окружение
    source venv/bin/activate
    
    # Переходим в папку backend
    cd backend
    
    # Выполняем миграции
    echo "🔄 Выполнение миграций..."
    python manage.py migrate
    
    # Создаем суперпользователя (опционально)
    echo ""
    read -p "🤔 Создать суперпользователя Django? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "👤 Создание суперпользователя..."
        python manage.py createsuperuser
    fi
    
    # Возвращаемся в корневую папку
    cd ..
    
    # Деактивируем виртуальное окружение
    deactivate
}

# Проверка установки
verify_installation() {
    echo ""
    echo "🔍 Проверка установки..."
    
    # Проверяем Node.js версию
    echo "📋 Node.js версия: $(node --version)"
    echo "📋 npm версия: $(npm --version)"
    
    # Проверяем Python версию
    source venv/bin/activate
    echo "📋 Python версия: $(python --version)"
    echo "📋 pip версия: $(pip --version)"
    deactivate
    
    echo "✅ Проверка завершена"
}

# Показываем инструкции по запуску
show_instructions() {
    echo ""
    echo "🎉 Установка завершена!"
    echo "=============================================="
    echo ""
    echo "📋 Для запуска проекта используйте:"
    echo ""
    echo "1️⃣  Запуск бэкенда:"
    echo "   cd backend"
    echo "   source ../venv/bin/activate"
    echo "   python manage.py runserver"
    echo ""
    echo "2️⃣  Запуск фронтенда (в новом терминале):"
    echo "   npm start"
    echo ""
    echo "🌐 Приложение будет доступно по адресам:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
    echo "   API:      http://localhost:8000/api"
    echo ""
    echo "📚 Дополнительная документация:"
    echo "   README.md - Основная документация"
    echo "   AUTHENTICATION.md - Документация по аутентификации"
    echo ""
}

# Основная функция
main() {
    check_requirements
    install_frontend
    install_backend
    setup_database
    verify_installation
    show_instructions
}

# Запуск скрипта
main "$@" 
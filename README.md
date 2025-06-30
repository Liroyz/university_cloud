# University Cloud

## Сборка и запуск проекта локально

1. Клонируйте репозиторий и перейдите в папку проекта:
   ```bash
   git clone <URL-репозитория>
   cd university_cloud
   ```

2. Соберите и запустите проект с помощью Docker Compose:
   ```bash
   ./build.sh
   docker-compose up --build
   ```

3. Откройте фронтенд-приложение по адресу:
   [http://localhost:3000](http://localhost:3000)

4. Бэкенд доступен по адресу:
   [http://localhost:8000](http://localhost:8000) 
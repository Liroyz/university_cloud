FROM python:3.13-slim

# Создаем пользователя для приложения
RUN addgroup --system django && \
    adduser --system --ingroup django django

WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код приложения
COPY --chown=django:django . .

# Создаем папку для логов внутри приложения
RUN mkdir -p /app/logs && \
    chown -R django:django /app/logs && \
    chmod -R 755 /app/logs

# Переключаемся на непривилегированного пользователя
USER django

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

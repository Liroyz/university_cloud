FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chmod +x run.sh
# Команда для запуска приложения
CMD ["/app/run.sh"]
# CMD gunicorn config.wsgi:application -c /code/config/gunicorn.conf.py
#!/usr/bin/env python
"""Утилита для управления Django через командную строку."""
import os
import sys
import logging

logger = logging.getLogger(__name__)

def main():
    """Запуск административных задач Django."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        logger.error("Django import error: %s", str(exc))
        raise ImportError(
            "Не удалось импортировать Django. Убедитесь, что он установлен и "
            "доступен в переменной окружения PYTHONPATH. Возможно, вы забыли "
            "активировать виртуальное окружение?"
        ) from exc
    
    try:
        execute_from_command_line(sys.argv)
    except Exception as e:
        logger.error("Command execution failed: %s", str(e))
        raise

if __name__ == '__main__':
    main()

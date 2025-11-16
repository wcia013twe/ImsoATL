"""
Configuration package for backend services
"""

from .snowflake_config import get_config, get_connection, execute_query, execute_many

__all__ = ['get_config', 'get_connection', 'execute_query', 'execute_many']

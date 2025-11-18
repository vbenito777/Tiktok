"""
Configurações do projeto
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Configurações da aplicação"""
    
    # Mercado Pago
    MERCADOPAGO_ACCESS_TOKEN: str = "APP_USR-6061834737027144-100216-686a6893aafd59eccf38db11db199080-577440377"
    
    # Webhook URL (opcional)
    WEBHOOK_URL: Optional[str] = None
    
    # Database (se necessário)
    DATABASE_URL: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Instância global de settings
settings = Settings()


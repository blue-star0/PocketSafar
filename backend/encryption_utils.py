"""Encryption and Privacy Utilities for PocketSafar"""

from cryptography.fernet import Fernet
import base64
import os
import logging
import hashlib
from typing import Dict, Any

logger = logging.getLogger(__name__)

class EncryptionManager:
    """Handles encryption/decryption for sensitive data"""
    
    def __init__(self, master_key: bytes = None):
        if master_key is None:
            master_key = os.environ.get('ENCRYPTION_KEY', Fernet.generate_key())
        
        if isinstance(master_key, str):
            master_key = master_key.encode()
            
        self.fernet = Fernet(master_key)
    
    def encrypt(self, data: str) -> str:
        """Encrypt string data"""
        try:
            encrypted = self.fernet.encrypt(data.encode())
            return base64.urlsafe_b64encode(encrypted).decode()
        except Exception as e:
            logger.error(f"Encryption error: {str(e)}")
            raise
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt string data"""
        try:
            decoded = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted = self.fernet.decrypt(decoded)
            return decrypted.decode()
        except Exception as e:
            logger.error(f"Decryption error: {str(e)}")
            raise

def anonymize_user_data(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Anonymize user data for sharing with government/analytics"""
    anonymized = user_data.copy()
    
    if 'user_id' in anonymized:
        anonymized['user_id'] = hashlib.sha256(
            anonymized['user_id'].encode()
        ).hexdigest()[:16]
    
    pii_fields = ['email', 'name', 'phone', 'address']
    for field in pii_fields:
        anonymized.pop(field, None)
    
    if 'latitude' in anonymized:
        anonymized['latitude'] = round(anonymized['latitude'], 2)
    if 'longitude' in anonymized:
        anonymized['longitude'] = round(anonymized['longitude'], 2)
    
    return anonymized

def hash_sensitive_field(value: str, salt: str = "pocketsafar") -> str:
    """Create one-way hash of sensitive data"""
    return hashlib.sha256(f"{value}{salt}".encode()).hexdigest()

encryption_manager = EncryptionManager()

def encrypt_data(data: str) -> str:
    return encryption_manager.encrypt(data)

def decrypt_data(encrypted: str) -> str:
    return encryption_manager.decrypt(encrypted)

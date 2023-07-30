from pydantic import BaseModel

class Usuario(BaseModel):
    nome: str
    email: str
    senha: str
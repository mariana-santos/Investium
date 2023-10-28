from typing import List
from pydantic import BaseModel
from datetime import date
from Postagem import Postagem
from Empresa import Empresa

from Utils import Utils

import oracledb

class Usuario(BaseModel):
    nome: str
    email: str
    senha: str
    dtNascimento: date
    papel: str
    postagens: List[Postagem]
    empresas: List[Empresa]
    
    @classmethod
    def inserir_usuario(cls, usuario: 'Usuario', dsn):
        try:
            conn = Utils.connect(dsn)
            cursor_usuario = conn.cursor()
            
            query = "INSERT INTO in_usuario (email, nome, dtNascimento, senha, papel) VALUES (?, ?, ?, ?, ?)"

            data_nascimento = usuario.dtNascimento.strftime('%Y-%m-%d')

            cursor_usuario.execute(query, (usuario.email, usuario.nome, data_nascimento, usuario.senha, usuario.papel))

            conn.commit()

            new_user = Usuario(
                nome=usuario.nome,
                email=usuario.email,
                senha=usuario.senha,
                dtNascimento=usuario.dtNascimento,
                papel=usuario.papel,
                postagens=[],
                empresas=[]
            )

            return new_user

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO INSERIR USUÁRIO: {str(e)}")

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO INSERIR USUÁRIO NO BANCO DE DADOS: {str(e)}")

        finally:
            if cursor_usuario is not None:
                cursor_usuario.close()

            if conn is not None:
                conn.close()
    
    @classmethod
    def fazer_login(cls, email: str, senha: str, dsn):
        try:
            conn = Utils.connect(dsn)
            cursor = conn.cursor()

            query = "SELECT * FROM in_usuario WHERE email = :email AND senha = :senha"

            cursor.execute(query, {'email': email, 'senha': senha})

            row = cursor.fetchone()

            if row:
                user = Usuario(
                    nome=row[1],
                    email=row[0],
                    senha=row[3],
                    dtNascimento=row[2],
                    papel=row[4],
                    postagens=Postagem.buscar_postagens_por_usuario(email, dsn),
                    empresas=Empresa.buscar_empresas_por_usuario(email, dsn)
                )
                return user
            
            else:
                return None

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO FAZER LOGIN: {str(e)}")
            return None

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO FAZER LOGIN: {str(e)}")
            return None


        finally:
            if cursor is not None:
                cursor.close()

            if conn is not None:
                conn.close()

    @classmethod
    def salvar_postagem(cls, email, id_postagem, dsn):
        try:
            conn = Utils.connect(dsn)
            cursor = conn.cursor()

            query = "INSERT INTO consome (fk_email, id_postagem) VALUES (:email, :id_postagem)"

            cursor.execute(query, {"email": email, "id_postagem": id_postagem})

            conn.commit()

            print("Postagem salva com sucesso!")

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO SALVAR A POSTAGEM: {str(e)}")

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO SALVAR A POSTAGEM: {str(e)}")

        finally:
            if cursor is not None:
                cursor.close()

            if conn is not None:
                conn.close()

    @classmethod
    def remover_salva_postagem(cls, email, id_postagem, dsn):
        try:
            conn = Utils.connect(dsn)
            cursor = conn.cursor()

            query = "DELETE FROM consome WHERE fk_email = :email AND id_postagem = :id_postagem"

            cursor.execute(query, {"email": email, "id_postagem": id_postagem})

            conn.commit()

            print("Postagem removida dos salvos com sucesso!")

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO REMOVER A POSTAGEM DOS SALVOS: {str(e)}")

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO REMOVER A POSTAGEM DOS SALVOS: {str(e)}")

        finally:
            if cursor is not None:
                cursor.close()

            if conn is not None:
                conn.close()

    @classmethod
    def salvar_empresa(self, email, id_empresa, dsn):
        try:
            conn = Utils.connect(dsn)
            cursor = conn.cursor()

            query = "INSERT INTO explora (fk_empresa, fk_usuario) VALUES (:id_empresa, :email)"

            cursor.execute(query, {"id_empresa": id_empresa, "email": email})

            conn.commit()
            print("Empresa/IPO salva com sucesso!")

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO SALVAR A EMPRESA/IPO: {str(e)}")

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO SALVAR A EMPRESA/IPO: {str(e)}")

        finally:
            if cursor is not None:
                cursor.close()

            if conn is not None:
                conn.close()

    @classmethod
    def remover_salvos_empresa(self, email, id_empresa, dsn):
        try:
            conn = Utils.connect(dsn)
            cursor = conn.cursor()

            query = "DELETE FROM explora WHERE fk_empresa = :id_empresa AND fk_usuario = :email"

            cursor.execute(query, {"id_empresa": id_empresa, "email": email})

            conn.commit()
            print("Empresa/IPO removida dos salvos com sucesso!")

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO REMOVER A EMPRESA/IPO DOS SALVOS: {str(e)}")

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO REMOVER A EMPRESA/IPO DOS SALVOS: {str(e)}")

        finally:
            if cursor is not None:
                cursor.close()

            if conn is not None:
                conn.close()
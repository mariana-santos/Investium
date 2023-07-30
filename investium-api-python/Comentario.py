from pydantic import BaseModel
from datetime import date
import oracledb
from UsuarioComentario import Usuario
from Utils import Utils

class Comentario(BaseModel):
    id: int
    conteudo: str
    data: date
    usuario: Usuario

    @classmethod
    def buscar_todos_comentarios(cls, dsn: str) -> list:
        try:
            conn = Utils.connect(dsn)
            cursor_comentario = conn.cursor()

            cursor_comentario.execute("""
                SELECT c.id_coment, c.conteudo, c.data, u.email, u.nome, u.senha
                FROM comentario c
                JOIN usuario u ON c.fk_email = u.email
                ORDER BY c.data DESC
            """)

            lista_comentarios = []
            for row in cursor_comentario:
                comentario = cls(
                    id=row[0],
                    conteudo=row[1],
                    data=row[2],
                    usuario=Usuario(email=row[3], nome=row[4], senha=row[5])
                )
                lista_comentarios.append(comentario)

            return lista_comentarios

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR OS COMENTÁRIOS: {str(e)}")
            return []

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR OS COMENTÁRIOS NO BANCO DE DADOS: {str(e)}")
            return []

        finally:
            if cursor_comentario is not None:
                cursor_comentario.close()
            if conn is not None:
                conn.close()

    @classmethod
    def buscar_comentarios_por_id(cls, dsn: str, id_coment: int) -> 'Comentario':
        try:
            conn = Utils.connect(dsn)
            cursor_comentario = conn.cursor()

            cursor_comentario.execute("""
                SELECT c.id_coment, c.conteudo, c.data, u.email, u.nome, u.senha
                FROM comentario c
                JOIN usuario u ON c.fk_email = u.email
                WHERE c.id_coment = :id_coment
            """, {"id_coment": id_coment})

            row = cursor_comentario.fetchone()
            if row:
                comentario = cls(
                    id=row[0],
                    conteudo=row[1],
                    data=row[2],
                    usuario=Usuario(email=row[3], nome=row[4], senha=row[5])
                )
                return comentario
            else:
                return None

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR O COMENTÁRIO POR ID: {str(e)}")
            return None

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR O COMENTÁRIO POR ID NO BANCO DE DADOS: {str(e)}")
            return None

        finally:
            if cursor_comentario is not None:
                cursor_comentario.close()
            if conn is not None:
                conn.close()

    @classmethod
    def novo_comentario(cls, c: 'Comentario', id_post: int, dsn: str) -> None:
        try:
            conn = Utils.connect(dsn)
            cursor_comentario = conn.cursor()

            data_comentario = c.data.strftime("%d-%m-%Y")

            query_id = "SELECT MAX(id_coment) AS id FROM comentario"

            cursor_id = conn.cursor()
            cursor_id.execute(query_id)

            id = 1
            row_id = cursor_id.fetchone()
            if row_id:
                id = row_id[0] + 1

            query = f"INSERT INTO comentario VALUES({id}, '{data_comentario}', '{c.conteudo}', {id_post}, '{c.usuario.email}')"

            cursor_comentario.execute(query)
            conn.commit()

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO INSERIR O COMENTÁRIO: {str(e)}")

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO INSERIR O COMENTÁRIO NO BANCO DE DADOS: {str(e)}")

        finally:
            if cursor_comentario is not None:
                cursor_comentario.close()
            if cursor_id is not None:
                cursor_id.close()
            if conn is not None:
                conn.close()

    @classmethod
    def buscar_comentarios_por_post(cls, dsn: str, id_post: int):
        try:
            conn = Utils.connect(dsn)
            cursor_comentario = conn.cursor()

            cursor_comentario.execute("""
                SELECT c.id_coment, c.conteudo, c.data, u.email, u.nome, u.senha
                FROM comentario c
                JOIN usuario u ON c.fk_email = u.email
                WHERE c.fk_postagem = :id_post
                ORDER BY c.data DESC
            """, {"id_post": id_post})

            lista_comentarios = []
            for row in cursor_comentario:
                comentario = cls(
                    id=row[0],
                    conteudo=row[1],
                    data=row[2],
                    usuario=Usuario(email=row[3], nome=row[4], senha=row[5])
                )

                lista_comentarios.append(comentario)

            return lista_comentarios

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR OS COMENTÁRIOS POR POST: {str(e)}")
            return []

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR OS COMENTÁRIOS POR POST NO BANCO DE DADOS: {str(e)}")
            return []

        finally:
            if cursor_comentario is not None:
                cursor_comentario.close()
            if conn is not None:
                conn.close()
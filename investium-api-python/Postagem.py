from pydantic import BaseModel
from datetime import date
from Categoria import Categoria
import oracledb

from Utils import Utils

class Postagem(BaseModel):
    id: int
    titulo: str
    conteudo: str
    imgUrl: str
    date: date
    likes: int
    categoria: Categoria

    def buscar_todas_postagens(dsn):
        try:
            conn = Utils.connect(dsn)
            cursor_postagem = conn.cursor()

            cursor_postagem.execute("""
                SELECT p.id_post, p.titulo, p.texto, p.img_url, p.data, p.likes, c.id_cat, c.descricao
                FROM postagem p
                JOIN categoria c ON p.fk_cat = c.id_cat
                ORDER BY p.data DESC
            """)

            lista_postagens = []
            for row in cursor_postagem:
                postagem = Postagem(
                    id=row[0],
                    titulo=row[1],
                    conteudo=row[2].read(),
                    imgUrl=row[3],
                    date=row[4],
                    likes=row[5],
                    categoria = Categoria(id=row[6], descricao=row[7]),
                )

                lista_postagens.append(postagem)

            return lista_postagens

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR AS POSTAGENS: {str(e)}")
            return []

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR AS POSTAGENS NO BANCO DE DADOS: {str(e)}")
            return []

        finally:
            if cursor_postagem is not None:
                cursor_postagem.close()
            if conn is not None:
                conn.close()


    def buscar_postagem_por_id(dsn, id_postagem: int):
        try:
            conn = Utils.connect(dsn)
            cursor_postagem = conn.cursor()

            cursor_postagem.execute("""
                SELECT p.id_post, p.titulo, p.texto, p.img_url, p.data, p.likes, c.id_cat, c.descricao
                FROM postagem p
                JOIN categoria c ON p.fk_cat = c.id_cat
                WHERE p.id_post = :id_post
            """, {"id_post": id_postagem})

            row = cursor_postagem.fetchone()
            if row:
                postagem = Postagem(
                    id=row[0],
                    titulo=row[1],
                    conteudo=row[2].read(),
                    imgUrl=row[3],
                    date=row[4],
                    likes=row[5],
                    categoria=Categoria(id=row[6], descricao=row[7]),
                )
                return postagem
            else:
                return None

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR A POSTAGEM POR ID: {str(e)}")
            return None

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR A POSTAGEM POR ID NO BANCO DE DADOS: {str(e)}")
            return None

        finally:
            if cursor_postagem is not None:
                cursor_postagem.close()
            if conn is not None:
                conn.close()

    @classmethod
    def buscar_postagens_por_usuario(cls, email: str, dsn: str):
        try:
            conn = Utils.connect(dsn)
            cursor_postagem = conn.cursor()

            query = """
                SELECT p.id_post, p.titulo, p.texto, p.img_url, p.data, p.likes, c.id_cat, c.descricao
                FROM postagem p
                JOIN categoria c ON p.fk_cat = c.id_cat
                JOIN consome cons ON cons.fk_email = :email AND cons.id_post = p.id_post
                ORDER BY p.data DESC
            """

            cursor_postagem.execute(query, {"email": email})

            lista_postagens = []
            for row in cursor_postagem:
                postagem = Postagem(
                    id=row[0],
                    titulo=row[1],
                    conteudo=row[2].read(),
                    imgUrl=row[3],
                    date=row[4],
                    likes=row[5],
                    categoria=Categoria(id=row[6], descricao=row[7]),
                )

                lista_postagens.append(postagem)

            return lista_postagens

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR AS POSTAGENS POR USUÁRIO: {str(e)}")
            return []

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR AS POSTAGENS POR USUÁRIO NO BANCO DE DADOS: {str(e)}")
            return []

        finally:
            if cursor_postagem is not None:
                cursor_postagem.close()
            if conn is not None:
                conn.close()
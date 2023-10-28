from pydantic import BaseModel
from Utils import Utils
import oracledb

class Categoria(BaseModel):
    id: int
    descricao: str

    def buscar_categorias_banco(dsn):
        try:
            conn = Utils.connect(dsn)
            cursor_cat = conn.cursor()

            cursor_cat.execute("""
                SELECT cat.id_categoria, cat.descricao
                FROM categoria cat
                ORDER BY cat.id_categoria
            """)

            lista_categorias = []
            for row in cursor_cat:

                cat_banco = Categoria(
                    id = row[0],
                    descricao = row[1],
                )

                lista_categorias.append(cat_banco)

            return lista_categorias

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR AS CATEGORIAS: {str(e)}")
            return None

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR AS CATEGORIAS NO BANCO DE DADOS: {str(e)}")
            return None

        finally:
            Utils.disconnect(conn, cursor_cat)

    def buscar_categoria_por_id(dsn, categoria_id):
        try:
            conn = Utils.connect(dsn)
            cursor_cat = conn.cursor()

            cursor_cat.execute("""
                SELECT cat.id_categoria, cat.descricao
                FROM categoria cat
                WHERE cat.id_categoria = :id_categoria
            """, {"id_categoria": categoria_id})

            row = cursor_cat.fetchone()
            if row is not None:
                categoria = Categoria(
                    id = row[0],
                    descricao = row[1],
                )
                return categoria
            else:
                return None

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR A CATEGORIA POR ID: {str(e)}")
            return None

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR A CATEGORIA POR ID NO BANCO DE DADOS: {str(e)}")
            return None

        finally:
            Utils.disconnect(conn, cursor_cat)
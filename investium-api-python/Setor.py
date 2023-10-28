from pydantic import BaseModel
import oracledb

from Utils import Utils

class Setor(BaseModel):
    id: int
    descricao: str

    @classmethod
    def buscar_setores_banco(cls, dsn):
        try:
            conn = Utils.connect(dsn)
            cursor_set = conn.cursor()

            cursor_set.execute("SELECT * FROM setor ORDER BY id_setor")

            lista_setores = []
            for row in cursor_set:
                set_banco = Setor(
                    id = row[0],
                    descricao = row[1],
                )

                lista_setores.append(set_banco)

            return lista_setores

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR OS SETORES: {str(e)}")
            return None

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR OS SETORES NO BANCO DE DADOS: {str(e)}")
            return None

        finally:
            Utils.disconnect(conn, cursor_set)

    def buscar_setor_por_id(dsn, setor_id):
        try:
            conn = Utils.connect(dsn)
            cursor_set = conn.cursor()

            cursor_set.execute("""
                SELECT *
                FROM setor
                WHERE id_setor = :id_setor
            """, {"id_setor": setor_id})

            row = cursor_set.fetchone()
            if row is not None:
                setor = Setor(
                    id = row[0],
                    descricao = row[1],
                )
                return setor
            else:
                return None

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR O SETOR POR ID: {str(e)}")
            return None

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR O SETOR POR ID NO BANCO DE DADOS: {str(e)}")
            return None

        finally:
            Utils.disconnect(conn, cursor_set)
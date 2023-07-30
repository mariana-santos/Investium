from pydantic import BaseModel
import oracledb

from Utils import Utils

class Ativo(BaseModel):
    id: int
    descricao: str
    valor: float

    @classmethod
    def listar_ativos_por_balanco(cls, dsn: str, id_balanco: int):
        try:
            conn = Utils.connect(dsn)
            cursor_ativo = conn.cursor()

            cursor_ativo.execute("""
                SELECT id_ativo, descricao, valor
                FROM ativo
                WHERE fk_balanco = :id_balanco
                ORDER BY id_ativo
            """, {"id_balanco": id_balanco})

            lista_ativos = []
            for row in cursor_ativo:
                ativo = Ativo(
                    id=row[0],
                    descricao=row[1],
                    valor=row[2],
                )
                lista_ativos.append(ativo)

            return lista_ativos

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR OS ATIVOS PELO ID DO BALANÇO: {str(e)}")
            return None

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR OS ATIVOS PELO ID DO BALANÇO NO BANCO DE DADOS: {str(e)}")
            return None

        finally:
            Utils.disconnect(conn, cursor_ativo)
from pydantic import BaseModel
import oracledb

from Utils import Utils

class Passivo(BaseModel):
    id: int
    descricao: str
    valor: float

    @classmethod
    def listar_passivos_por_balanco(cls, dsn: str, id_balanco: int):
        try:
            conn = Utils.connect(dsn)
            cursor_passivo = conn.cursor()

            cursor_passivo.execute("""
                SELECT id_passivo, descricao, valor
                FROM passivo
                WHERE fk_balanco = :id_balanco
                ORDER BY id_passivo
            """, {"id_balanco": id_balanco})

            lista_passivos = []
            for row in cursor_passivo:
                passivo = Passivo(
                    id=row[0],
                    descricao=row[1],
                    valor=row[2],
                )
                lista_passivos.append(passivo)

            return lista_passivos

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR OS ATIVOS PELO ID DO BALANÇO: {str(e)}")
            return None

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR OS ATIVOS PELO ID DO BALANÇO NO BANCO DE DADOS: {str(e)}")
            return None

        finally:
            Utils.disconnect(conn, cursor_passivo)
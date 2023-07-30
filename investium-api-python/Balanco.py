from pydantic import BaseModel
from typing import List
from datetime import date
from Ativo import Ativo
from Passivo import Passivo
from Utils import Utils
import oracledb

class Balanco(BaseModel):
    id: int
    dtInicio: date
    dtFinal: date
    patrimonioLiquido: float
    ativos: List[Ativo]
    passivos: List[Passivo]

    @classmethod
    def listar_balancos_por_empresa(cls, dsn: str, id_empresa: int):
        try:
            conn = Utils.connect(dsn)
            cursor_balanco = conn.cursor()

            cursor_balanco.execute("""
                SELECT id_balanco, dt_inicio, dt_final, patrimonio_liq
                FROM balanco
                WHERE fk_empresa = :id_empresa
                ORDER BY id_balanco
            """, {"id_empresa": id_empresa})

            lista_balancos = []
            
            for row in cursor_balanco:
                id_balanco = row[0]
                balanco = Balanco(
                    id=id_balanco,
                    dtInicio=row[1],
                    dtFinal=row[2],
                    patrimonioLiquido=row[3],
                    ativos=Ativo.listar_ativos_por_balanco(dsn, id_balanco),
                    passivos=Passivo.listar_passivos_por_balanco(dsn, id_balanco),
                )

                lista_balancos.append(balanco)

            return lista_balancos

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR OS BALANÇOS POR EMPRESA: {str(e)}")
            return None

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR OS BALANÇOS POR EMPRESA NO BANCO DE DADOS: {str(e)}")
            return None

        finally:
            Utils.disconnect(conn, cursor_balanco)

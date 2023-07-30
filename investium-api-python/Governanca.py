from pydantic import BaseModel
from datetime import date
from PessoaGovernanca import PessoaGovernanca
from Utils import Utils
import oracledb
from typing import List, Optional

class Governanca(BaseModel):
    id: int
    dtInicio: date
    dtFim: Optional[date]
    pessoasGovernanca: List[PessoaGovernanca]

    @classmethod
    def listar_governancas_por_empresa(cls, dsn: str, id_empresa: int):
        try:
            conn = Utils.connect(dsn)
            cursor_gov = conn.cursor()

            cursor_gov.execute("""
                SELECT id_gov, dt_inicio, dt_fim, fk_empresa
                FROM governanca
                WHERE fk_empresa = :id_empresa
                ORDER BY id_gov
            """, {"id_empresa": id_empresa})

            lista_governancas = []
            for row in cursor_gov:
                id_gov = row[0]
                governanca = Governanca(
                    id=id_gov,
                    dtInicio=row[1],
                    dtFim=row[2],
                    pessoasGovernanca=PessoaGovernanca.listar_pessoas_por_governanca(dsn, id_gov)
                )

                lista_governancas.append(governanca)

            return lista_governancas

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR AS GOVERNANÇAS POR EMPRESA: {str(e)}")
            return []

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR AS GOVERNANÇAS POR EMPRESA NO BANCO DE DADOS: {str(e)}")
            return []

        finally:
            Utils.disconnect(conn, cursor_gov)
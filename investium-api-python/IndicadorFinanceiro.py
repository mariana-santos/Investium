from pydantic import BaseModel
import oracledb

from Utils import Utils

class IndicadorFinanceiro(BaseModel):
    id: int
    descricao: str
    tipo: str
    valor: str
    ano: int

    @classmethod
    def listar_indicadores_por_empresa(dsn: str, id_empresa: int):
        try:
            conn = Utils.connect(dsn)
            cursor_indicador = conn.cursor()

            cursor_indicador.execute("""
                SELECT id_indicador, descricao, tipo, valor, ano
                FROM indicador_financeiro
                WHERE fk_empresa = :id_empresa
                ORDER BY id_indicador
            """, {"id_empresa": id_empresa})

            lista_indicadores = []

            for row in cursor_indicador:
                indicador = IndicadorFinanceiro(
                    id=row[0],
                    descricao=row[1],
                    tipo=row[2],
                    valor=row[3],
                    ano=int(row[4]),
                )

                lista_indicadores.append(indicador)

            return lista_indicadores

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR OS INDICADORES POR EMPRESA: {str(e)}")
            return []

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR OS INDICADORES POR EMPRESA NO BANCO DE DADOS: {str(e)}")
            return []

        finally:
            Utils.disconnect(conn, cursor_indicador)
from pydantic import BaseModel
from Utils import Utils
import oracledb

class PessoaGovernanca(BaseModel):
    id: int
    nome: str
    cargo: str

    @classmethod
    def listar_pessoas_por_governanca(cls, dsn: str, id_governanca: int):
        try:
            conn = Utils.connect(dsn)
            cursor = conn.cursor()

            cursor.execute("""
                SELECT pg.id_pessoa_governanca, pg.nome, pg.cargo
                FROM pessoa_governanca pg
                JOIN possui p ON pg.id_pessoa_governanca = p.fk_pessoa_governanca
                WHERE p.fk_id_governanca = :id_governanca
                ORDER BY pg.id_pessoa_governanca
            """, {"id_governanca": id_governanca})

            lista_pessoas = []
            for row in cursor:
                pessoa = PessoaGovernanca(
                    id=row[0],
                    nome=row[1],
                    cargo=row[2]
                )
                lista_pessoas.append(pessoa)

            return lista_pessoas

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR AS PESSOAS POR GOVERNANÇA: {str(e)}")
            return []

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR AS PESSOAS POR GOVERNANÇA NO BANCO DE DADOS: {str(e)}")
            return []

        finally:
            Utils.disconnect(conn, cursor)

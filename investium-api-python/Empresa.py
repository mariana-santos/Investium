from datetime import date
import oracledb
from pydantic import BaseModel
from Setor import Setor

from Utils import Utils

class Empresa(BaseModel):
    id: int
    nome: str
    cor: str
    ativoIpo: bool
    valorInicialIpo: float
    imagem: str
    setor: Setor
    dataInicioIPO: date

    def listar_empresas(dsn):
        try:
            conn = Utils.connect(dsn)
            cursor_empresa = conn.cursor()

            cursor_empresa.execute("""SELECT id_empresa, nome_empresa, cor, 
                                      ativo_ipo, valor_inicial_ipo, img_empresa, 
                                      fk_setor, dt_inicio_ipo 
                                      FROM empresa 
                                      ORDER BY id_empresa""")

            empresas = []
            for row in cursor_empresa:
                empresa = Empresa(
                    id=row[0],
                    nome=row[1],
                    cor=row[2],
                    ativoIpo=True if row[3] == 'S' else False,
                    valorInicialIpo=row[4],
                    imagem=row[5],
                    setor=Setor.buscar_setor_por_id(dsn, row[6]), 
                    dataInicioIPO=row[7],
                )

                empresas.append(empresa)

            return empresas

        except Exception as e:
            print(f"Erro ao exibir as empresas: {str(e)}")
            return []
        finally:
            conn.close()

    @classmethod
    def buscar_empresas_por_usuario(cls, email: str, dsn):
        try:
            conn = Utils.connect(dsn)
            cursor_empresa = conn.cursor()

            query = """
                SELECT e.id_empresa, e.nome_empresa, e.cor, e.ativo_ipo, e.valor_inicial_ipo,
                       e.img_empresa, e.fk_setor, e.dt_inicio_ipo
                FROM empresa e
                JOIN explora ex ON ex.fk_usuario = :email AND ex.fk_empresa = e.id_empresa
                ORDER BY e.id_empresa
            """

            cursor_empresa.execute(query, {"email": email})

            empresas = []
            for row in cursor_empresa:
                empresa = Empresa(
                    id=row[0],
                    nome=row[1],
                    cor=row[2],
                    ativoIpo=True if row[3] == 'S' else False,
                    valorInicialIpo=row[4],
                    imagem=row[5],
                    setor=Setor.buscar_setor_por_id(dsn, row[6]),
                    dataInicioIPO=row[7],
                )

                empresas.append(empresa)

            return empresas

        except oracledb.DatabaseError as e:
            print(f"OCORREU UM ERRO DE BANCO DE DADOS AO BUSCAR AS EMPRESAS POR USUÁRIO: {str(e)}")
            return []

        except Exception as e:
            print(f"OCORREU UM ERRO INESPERADO AO BUSCAR AS EMPRESAS POR USUÁRIO NO BANCO DE DADOS: {str(e)}")
            return []

        finally:
            if cursor_empresa is not None:
                cursor_empresa.close()
            if conn is not None:
                conn.close()
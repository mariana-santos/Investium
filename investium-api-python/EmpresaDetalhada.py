from datetime import date
from typing import List
from pydantic import BaseModel
from IndicadorFinanceiro import IndicadorFinanceiro
from Balanco import Balanco
from Governanca import Governanca
from Setor import Setor

from Utils import Utils

class EmpresaDetalhada(BaseModel):
    id: int
    nome: str
    descricao: str
    cor: str
    ativoIpo: bool
    valorInicialIpo: float
    descricaoIpo: str
    linkEmpresa: str
    linkProspecto: str
    imagem: str
    setor: Setor
    dataInicioIPO: date
    cnpj: str
    indicadoresFinanceiros: List[IndicadorFinanceiro] = []
    balancos: List[Balanco] = []
    governanca: List[Governanca] = []

    def buscar_empresa(dsn, id_empresa: int):
        try:
            conn = Utils.connect(dsn)
            cursor_empresa = conn.cursor()

            cursor_empresa.execute("""SELECT * FROM empresa 
                                        WHERE id_empresa = :id_empresa""",
                                        {"id_empresa": id_empresa})

            row = cursor_empresa.fetchone()
            if row is not None:
                empresa = EmpresaDetalhada(
                    id=row[0],
                    nome=row[1],
                    descricao=row[2],
                    ativoIpo=True if row[3] == 'S' else False,
                    valorInicialIpo=row[4],
                    descricaoIpo=row[5],
                    linkEmpresa=row[6],
                    linkProspecto=row[7],
                    imagem=row[8],
                    setor=Setor.buscar_setor_por_id(dsn, row[9]), 
                    cor=row[10],
                    dataInicioIPO=row[11],
                    cnpj=row[12],
                )

                # Buscar os indicadores financeiros da empresa
                indicadores = IndicadorFinanceiro.listar_indicadores_por_empresa(row[0]) 
                empresa.indicadoresFinanceiros = indicadores

                # Buscar os balanços da empresa
                balancos = Balanco.listar_balancos_por_empresa(dsn, row[0])  
                empresa.balancos = balancos

                # Buscar as governanças da empresa
                governancas = Governanca.listar_governancas_por_empresa(dsn, row[0]) 
                empresa.governanca = governancas

            return empresa

        except Exception as e:
            print(f"Erro ao exibir as empresas: {str(e)}")
            return []
        finally:
            conn.close()
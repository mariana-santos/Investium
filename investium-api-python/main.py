from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from Categoria import Categoria
from Postagem import Postagem
from Comentario import Comentario
from Setor import Setor
from Balanco import Balanco
from Empresa import Empresa
from EmpresaDetalhada import EmpresaDetalhada
from Usuario import Usuario

# CRIANDO CONEXÃO COM O BANCO
dsn = "oracle.fiap.com.br/ORCL"

# INSTANCIANDO FASTAPI
app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "https://repo-challenge-j1bp.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def main():
    return {"message": "Hello World"}

#-----------------------------------------------------------------
# APIS - CATEGORIA

# CATEGORIA (LISTAR TODOS)
@app.get("/categoria", tags=["Categorias"])
def listar_categorias():
    try:
        return Categoria.buscar_categorias_banco(dsn)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR TODAS AS CATEGORIAS: {str(e)}")
        return Response(content="Erro ao listar categorias.", media_type="text/plain", status_code=500)


# CATEGORIA (BUSCAR POR ID)
@app.get("/categoria/{id}", tags=["Categorias"])
def categoria_por_id(id: int):
    try:
        return Categoria.buscar_categoria_por_id(dsn, id)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR CATEGORIA: {str(e)}")
        return Response(content="Erro ao listar a categoria.", media_type="text/plain", status_code=500)


#-----------------------------------------------------------------
# APIS - POSTAGEM  

# POSTAGEM (LISTAR TODOS)
@app.get("/postagem", tags=["Postagens"])
def listar_postagens():
    try:
        return Postagem.buscar_todas_postagens(dsn)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR TODAS AS POSTAGENS: {str(e)}")
        return Response(content="Erro ao listar postagens.", media_type="text/plain", status_code=500)


# POSTAGEM (BUSCAR POR ID)
@app.get("/postagem/{id}", tags=["Postagens"])
def postagem_por_id(id: int):
    try:
        return Postagem.buscar_postagem_por_id(dsn, id)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR A POSTAGEM: {str(e)}")
        return Response(content="Erro ao listar postagem.", media_type="text/plain", status_code=500)
    

#-----------------------------------------------------------------
# APIS - COMENTÁRIO  

# COMENTÁRIO (LISTAR TODOS)
@app.get("/comentario", tags=["Comentarios"])
def listar_comentarios():
    try:
        return Comentario.buscar_todos_comentarios(dsn)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR TODOS OS COMENTÁRIOS: {str(e)}")
        return Response(content="Erro ao listar comentários.", media_type="text/plain", status_code=500)


# COMENTÁRIO (BUSCAR POR ID)
@app.get("/comentario/{id}", tags=["Comentarios"])
def comentarios_por_id(id: int):
    try:
        return Comentario.buscar_comentarios_por_id(dsn, id)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR O COMENTÁRIO: {str(e)}")
        return Response(content="Erro ao listar comentário.", media_type="text/plain", status_code=500)
    

# COMENTÁRIOS (BUSCAR POR POST)
@app.get("/comentario/by_post/{id}", tags=["Comentarios"])
def comentarios_por_post(id: int):
    try:
        return Comentario.buscar_comentarios_por_post(dsn, id)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR COMENTÁRIOS POR POST: {str(e)}")
        return Response(content="Erro ao listar comentários.", media_type="text/plain", status_code=500)
    

#-----------------------------------------------------------------
# APIS - SETOR  

# SETORES (LISTAR TODOS)
@app.get("/setor", tags=["Setores"])
def listar_setores():
    try:
        return Setor.buscar_setores_banco(dsn)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR TODOS OS SETORES: {str(e)}")
        return Response(content="Erro ao listar setores.", media_type="text/plain", status_code=500)


# SETOR (BUSCAR POR ID)
@app.get("/setor/{id}", tags=["Setores"])
def setor_por_id(id: int):
    try:
        return Setor.buscar_setor_por_id(dsn, id)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR SETOR: {str(e)}")
        return Response(content="Erro ao listar setor.", media_type="text/plain", status_code=500)
  

#-----------------------------------------------------------------
# APIS - BALANÇO  

# BALANÇO (LISTAR POR EMPRESA)
@app.get("/balanco/por_empresa/{id_empresa}", tags=["Balanco"])
def listar_balancos(id_empresa: int):
    try:
        return Balanco.listar_balancos_por_empresa(dsn, id_empresa)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR OS BALANÇOS: {str(e)}")
        return Response(content="Erro ao listar balanços.", media_type="text/plain", status_code=500)


#-----------------------------------------------------------------
# APIS - EMPRESA  

# EMPRESA (LISTAR TODAS)
@app.get("/empresa", tags=["Empresas"])
def listar_empresas():
    try:
        return Empresa.listar_empresas(dsn)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR TODAS AS EMPRESAS: {str(e)}")
        return Response(content="Erro ao listar empresas.", media_type="text/plain", status_code=500)


# EMPRESA (BUSCAR POR ID)
@app.get("/empresa/{id}", tags=["Empresas"])
def empresa_por_id(id: int):
    try:
        return EmpresaDetalhada.buscar_empresa(dsn, id)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO LISTAR EMPRESA: {str(e)}")
        return Response(content="Erro ao listar empresa.", media_type="text/plain", status_code=500)
  


#-----------------------------------------------------------------
# APIS - USUÁRIO

# APIS - USUÁRIO (FAZER LOGIN)
@app.get("/login/{email}/{senha}", tags=["Usuario"])
def fazer_login(email: str, senha: str):

    try:
        return Usuario.fazer_login(email, senha, dsn)
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO FAZER LOGIN: {str(e)}")
        return Response(content="Erro ao fazer login.", media_type="text/plain", status_code=500)


# APIS - USUÁRIO (ADICIONAR USUARIO)
@app.post("/usuario", tags=["Usuario"])
def incluir_usuario(novo_usuario: Usuario):
    try:
        return Usuario.inserir_usuario(novo_usuario, dsn) 
    
    except Exception as e:
        print(f"OCORREU UM ERRO INESPERADO AO CADASTRAR NOVO USUÁRIO: {str(e)}")
        return Response(content="Erro inesperado ao cadastrar novo usuário.", media_type="text/plain", status_code=500)
    

# APIS - USUÁRIO (SALVAR POSTAGEM)
@app.post("/usuario/{email}/postagem/{id_post}", tags=["Usuario"])
def salvar_postagem(email: str, id_post: int):
    try:
        Usuario.salvar_postagem(email, id_post, dsn)
        return {"message": "Postagem salva com sucesso!"}
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO SALVAR A POSTAGEM: {str(e)}")
        return Response(content="Erro ao salvar postagem.", media_type="text/plain", status_code=500)
    

# APIS - USUÁRIO (REMOVER POSTAGEM)
@app.delete("/usuario/{email}/postagem/{id_post}", tags=["Usuario"])
def remover_salva_postagem(email: str, id_post: int):
    try:
        Usuario.remover_salva_postagem(email, id_post, dsn)
        return {"message": "Postagem removida dos salvos com sucesso!"}
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO REMOVER A POSTAGEM DOS SALVOS: {str(e)}")
        return Response(content="Erro ao remover postagem.", media_type="text/plain", status_code=500)
    
# APIS - USUÁRIO (SALVAR EMPRESA)
@app.post("/usuario/{email}/empresa/{id_empresa}", tags=["Usuario"])
def salvar_empresa(email: str, id_empresa: int):
    try:
        Usuario.salvar_empresa(email, id_empresa, dsn)
        return {"message": "Empresa/IPO salva com sucesso!"}
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO SALVAR A EMPRESA/IPO: {str(e)}")
        return Response(content="Erro ao salvar empresa.", media_type="text/plain", status_code=500)
    

# APIS - USUÁRIO (REMOVER EMPRESA)
@app.delete("/usuario/{email}/empresa/{id_empresa}", tags=["Usuario"])
def remover_salva_empresa(email: str, id_empresa: int):
    try:
        Usuario.remover_salvos_empresa(email, id_empresa, dsn)
        return {"message": "Empresa/IPO removida dos salvos com sucesso!"}
    
    except Exception as e:
        print(f"OCORREU UM ERRO AO REMOVER A EMPRESA/IPO DOS SALVOS: {str(e)}")
        return Response(content="Erro ao remover empresa.", media_type="text/plain", status_code=500)
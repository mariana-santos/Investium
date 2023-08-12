import oracledb

class Utils:

    def connect(dsn):
            try:
                user = ""
                password = ""
                dsn = "oracle.fiap.com.br/ORCL"
                
                conn = oracledb.connect(
                                            user = user,
                                            password = password,
                                            dsn = dsn
                                        )
                return conn
            
            except oracledb.Error as e:
                print(f"ERRO AO CONECTAR COM O BANCO DE DADOS: {e}")

    def disconnect(conn, cursor):
        try:
            if not conn.close:
                conn.close()
            if not cursor.close:
                cursor.close()

        except oracledb.Error as e:
            print(f"ERRO AO DESCONECTAR DO BANCO DE DADOS: {e}")
package br.com.fiap.connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionFactory {

	private static Connection connection;
	
	 public static Connection getConnection() throws SQLException{
		 
		 try {
		 
		 		String url = "jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL";
		        String user = "";
		        String password = "";
		        Class.forName("oracle.jdbc.driver.OracleDriver");
		        connection = DriverManager.getConnection(url, user, password);
		        
		        if(connection!=null)
	               System.out.println("Conexão estabelecida com sucesso!");
	           else
	               System.out.println("Falha na conexão com o Banco de Dados!");
		 }
		 catch (Exception e) {
	            e.printStackTrace(); 
		}
		 
		 return connection;

	        
	    }
}

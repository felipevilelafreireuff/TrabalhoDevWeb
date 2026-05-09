package com.devshop.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.Connection;
import java.sql.SQLException;
import io.github.cdimascio.dotenv.Dotenv;

public class ConnectionPool {
    private static HikariDataSource dataSource;

    static {
        try {
            Class.forName("org.postgresql.Driver");

            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(dotenv.get("DB_URL"));
            config.setUsername(dotenv.get("DB_USER"));
            config.setPassword(dotenv.get("DB_PASS"));

            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setIdleTimeout(30000);
            config.setMaxLifetime(1800000);
            config.setConnectionTimeout(30000);

            dataSource = new HikariDataSource(config);
            System.out.println("HikariCP DataSource inicializado com sucesso para PostgreSQL.");
        } catch (Exception e) {
            System.err.println("Erro crítico ao inicializar o ConnectionPool: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public static Connection getConnection() throws SQLException {
        if (dataSource == null) {
            throw new SQLException("DataSource não foi inicializado.");
        }
        return dataSource.getConnection();
    }

    public static void close() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
            System.out.println("HikariCP DataSource encerrado.");
        }
    }
}

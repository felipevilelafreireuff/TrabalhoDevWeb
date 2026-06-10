package com.devshop.filter;

import com.devshop.model.bean.Usuario;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebFilter(urlPatterns = {"/admin", "/admin/*"})
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpSession session = httpRequest.getSession(false);

        boolean loggedIn = (session != null && session.getAttribute("usuarioLogado") != null);
        
        if (loggedIn) {
            Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
            if ("ADMIN".equals(usuario.getPapel())) {
                chain.doFilter(request, response);
            } else {
                writeJson(httpResponse, HttpServletResponse.SC_FORBIDDEN,
                        "{\"success\":false,\"message\":\"Acesso restrito a administradores.\"}");
            }
        } else {
            writeJson(httpResponse, HttpServletResponse.SC_UNAUTHORIZED,
                    "{\"success\":false,\"message\":\"Autenticacao obrigatoria.\"}");
        }
    }

    private void writeJson(HttpServletResponse response, int status, String body) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(body);
    }
}

package com.devshop.controller;

import com.devshop.model.bean.Usuario;
import com.devshop.model.dao.UsuarioDAO;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.Map;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private final Gson gson = new Gson();
    private UsuarioDAO usuarioDAO;

    @Override
    public void init() {
        usuarioDAO = new UsuarioDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("usuarioLogado") != null) {
            Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
            writeJson(response, HttpServletResponse.SC_OK, Map.of(
                    "authenticated", true,
                    "usuario", toUsuarioResponse(usuario)
            ));
            return;
        }

        writeJson(response, HttpServletResponse.SC_OK, Map.of(
                "authenticated", false,
                "message", "Nenhum usuario autenticado."
        ));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        if (!isJsonRequest(request)) {
            writeJson(response, HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, Map.of(
                    "success", false,
                    "message", "Content-Type deve ser application/json."
            ));
            return;
        }

        LoginRequest loginRequest;
        try {
            loginRequest = readLoginRequest(request);
        } catch (JsonSyntaxException e) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                    "success", false,
                    "message", "JSON invalido."
            ));
            return;
        }

        if (isBlank(loginRequest.email()) || isBlank(loginRequest.senha())) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                    "success", false,
                    "message", "Email e senha sao obrigatorios."
            ));
            return;
        }

        Usuario usuario = usuarioDAO.autenticar(loginRequest.email(), loginRequest.senha());

        if (usuario != null) {
            HttpSession session = request.getSession();
            session.setAttribute("usuarioLogado", usuario);

            writeJson(response, HttpServletResponse.SC_OK, Map.of(
                    "success", true,
                    "message", "Login realizado com sucesso.",
                    "usuario", toUsuarioResponse(usuario)
            ));
        } else {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of(
                    "success", false,
                    "message", "Email ou senha invalidos."
            ));
        }
    }

    private LoginRequest readLoginRequest(HttpServletRequest request) throws IOException {
        JsonObject json = gson.fromJson(request.getReader(), JsonObject.class);
        if (json == null) {
            return new LoginRequest(null, null);
        }

        return new LoginRequest(getString(json, "email"), getString(json, "senha"));
    }

    private boolean isJsonRequest(HttpServletRequest request) {
        return request.getContentType() != null && request.getContentType().contains("application/json");
    }

    private String getString(JsonObject json, String field) {
        return json.has(field) && !json.get(field).isJsonNull() ? json.get(field).getAsString() : null;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private Map<String, Object> toUsuarioResponse(Usuario usuario) {
        return Map.of(
                "id", usuario.getId(),
                "nome", usuario.getNome(),
                "email", usuario.getEmail(),
                "papel", usuario.getPapel()
        );
    }

    private void writeJson(HttpServletResponse response, int status, Object body) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        gson.toJson(body, response.getWriter());
    }

    private record LoginRequest(String email, String senha) {
    }
}

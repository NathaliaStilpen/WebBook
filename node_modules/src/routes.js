const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Caminho para o arquivo users.json
const usersFile = path.join(__dirname, "users.json");

// Login
router.post("/login", (req, res) => {
    const { name, password } = req.body;

    // Lê o arquivo users.json
    fs.readFile(usersFile, (err, data) => {
        if (err) {
            console.error("Erro ao ler o arquivo users.json:", err);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }

        const users = JSON.parse(data);

        // Verifica se o usuário existe e se a senha está correta
        const user = users.find(
            (u) => u.name === name && u.password === password
        );

        if (!user) {
            return res.status(401).json({ message: "Nome ou senha inválidos" });
        }

        // Retorna os dados do usuário sem a senha
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    });
});

// Cadastro
router.post("/cadastro", (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }
  
    fs.readFile(usersFile, (err, data) => {
      if (err) {
        console.error("Erro ao ler o arquivo users.json:", err);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
  
      const users = JSON.parse(data);
  
      // Verifica se o email já está cadastrado
      const userExists = users.some((user) => user.email === email);
      if (userExists) {
        return res.status(400).json({ message: "Este email já está cadastrado" });
      }
  
      // Adiciona o novo usuário
      users.push({ name, email, password });
  
      // Salva o arquivo atualizado
      fs.writeFile(usersFile, JSON.stringify(users, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Erro ao salvar no arquivo users.json:", writeErr);
          return res.status(500).json({ message: "Erro ao salvar os dados" });
        }
  
        res.status(201).json({ message: "Usuário cadastrado com sucesso" });
      });
    });
  });

module.exports = router;

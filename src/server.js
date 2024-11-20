const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const app = express();

app.use(express.json());

// Configura o CORS para aceitar requisições do frontend na porta 3001
app.use(cors({ origin: "http://localhost:3001" }));

app.use(routes);

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(3000, () => {
    console.log('Backend listening on port 3000');
});

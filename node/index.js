const express = require('express');
const mysql = require('mysql');
const faker = require('faker');

const app = express()
const port = 3000
const config = {
    host: 'challenge-mysql',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const connection = mysql.createConnection(config);
createTable();

app.get('/', (req, res) => {
    if (!connection) {
        return res
            .status(500)
            .send('Erro de conexão com o banco de dados.');
    }

    try {
        insertRandomPerson();

        listPeople((err, people) => {
            if (err) {
                console.error('Erro ao listar pessoas:', err);
                return res.status(500).send('Erro ao listar pessoas.');
            }

            res.send(`
                <h1>Full Cycle Rocks!</h1>
                <h2>Lista de nomes cadastrados:</h2>
                <ul>
                    ${people.map(person => `<li>${person.name}</li>`).join('')}
                </ul>
            `);
        });
    } catch (err) {
        console.error('Erro ao processar a requisição:', err);
        res
            .status(500)
            .send('Erro interno do servidor.');
    }
})

app.listen(port, () => {
    console.log('Rodando na porta: ' + port)
})

function insertRandomPerson() {
    const randomName = faker.name.findName();
    const sql = "INSERT INTO people (name) VALUES (?)";
    
    connection.query(sql, [randomName]);
    console.log(`Pessoa inserida: ${randomName}`);
}

function listPeople(callback) {
    const sql = "SELECT name FROM people";
    
    connection.query(sql, (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
    });
}

function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `;

    connection.query(sql);
    console.log('Tabela criada ou já existe.');
}
const { Client } = require('pg');
const express = require('express');

(async () => {
    const app = express()
    const port = process.env.API_PORT || 3000
    let i = 0

    app.listen(port, () => {
        console.log(`API iniciada. Escutando PORT ${port}`)
    })

    app.use((req, res, next) => {
        i++;
        next();
    })

    app.get('/', async (req, res) => {
        res.send({ 'message': "API OK!", 'request_id': i })
    })

    app.get('/connect', async (req, res) => {
        try {
            const client = new Client({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 5432,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
            })
            await client.connect()

            const result = await client.query('SELECT version()')
            const version = result.rows[0].version

            await client.end()

            const response = { 'message': "Conectado ao banco", 'version': version, 'request_id': i }
            console.log(response)
            res.send(response)
        } catch (e) {
            const error = { 'message': 'Erro ao se conectar ao banco', 'request_id': i }
            console.log(error)
            console.log(e)

            res.status(500);
            res.send(error)
        }
    })
})()
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3001;

const openDb = () => {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'Nipuni',
        port: 5432,
    });
    return pool;
};

app.get('/', (req, res) => {
    const pool = openDb()

    pool.query('SELECT * FROM task', (error, results) => {
        if (error) {
            res.status(500).json({error: error.message})
        }

        res.status(200).json(results.rows);
    });
});

app.delete('/delete/:id', async(req, res) => {
    const pool = openDb()
    const id = parseInt(req.params.id);
    pool.query('DELETE FROM task WHERE id = $1', [id], (error, results) => {
        if(error){
            res.status(500).json({error: error.message})
        }else{
            res.status(200).json({id: id})
        }
    } )
})

app.listen(port);
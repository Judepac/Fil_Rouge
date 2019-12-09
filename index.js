const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-Parser');

const connection = require('./config.js');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//GET ALL
app.get('/api/city', (req, res) =>{
    connection.query('SELECT * FROM city', (err, results) =>{
        if(err) {
            res.status(500).send('Erreur');
        } else {
            res.json(results);
        }
    });
});
// GET by Id
app.get('/api/city/:id(\\d+)', (req, res) =>{
    const idCity = req.params.id;

    connection.query('SELECT name FROM city WHERE id = ?', idCity, (err, results) => {
        if(err) {
            res.status(500).send('Erreur server');
        } else {
            res.json(results);
        }
    });
});
//GET avec filtre population>20 000 et avec un aeroport
app.get('/api/city/airport', (req, res) =>{

    connection.query('SELECT * from city WHERE population > 2000 AND airport = 1', (err, results) => {
        if (err) {
            res.status(500).send('Bad erreur');
        } else {
            res.json(results);
        }
    });
});
//GET avec filtre Nom commencant par A
app.get('/api/city/name', (req, res) =>{

    connection.query('SELECT name from city WHERE name like "A%"', (err, results) => {
        if (err) {
            res.status(500).send('Bad request');
        } else {
            res.json(results);
        }
    });
});
//GET nombre villes avec aéroport
app.get('/api/city/nb_ville', (req, res) =>{

    connection.query('SELECT COUNT(*) as Ville_avec_aeroport from city WHERE airport', (err, results) => {
        if (err) {
            res.status(500).send('Bad request');
        } else {
            res.json(results);
        }
    });
});
//GET en ordre
app.get('/api/city/classements/:ordre', (req, res) =>{
    const ok = req.params.ordre
    connection.query( 'SELECT * FROM city ORDER BY population ?', ok,  (err,results) =>{
        res.json(results);
    });
});
//POST  
app.post('/api/city', (req, res) => {
    const newCity = req.body

    connection.query('INSERT INTO city (name, population, airport) VALUES (?, ?, ?)', [newCity.name, newCity.population, newCity.airport], (err,results)=>{
        if(err) {
            res.status(500).send('Mauvaise requete')
        } else {
            res.json(newCity);
        }
    })
})
//PUT d'1 entité
app.put('/api/city/:id', (req,res)=>{
    const id = req.params.id;
    const all =req.body;

    connection.query('UPDATE city SET ? WHERE id = ?', [all, id], (err, results) =>{
        if(err) {
            res.status(500).send('Mauvaise manipulation')
        }else{
            res.json(results);
        }
    })
})
// PUT toggle boolean
app.put('/api/city/change/:id', (req,res)=>{
    const id = req.params.id;

    connection.query('UPDATE city SET airport = !airport WHERE id = ?', [id], (err, results) =>{
        if(err) {
            res.status(500).send('Mauvaise manipulation')
        }else{
            res.json(results);
        }
    })
})
//DELETE 1 entité
app.delete('/api/city/:id', (req,res)=>{
    const id = req.params.id;

    connection.query('DELETE FROM city WHERE id = ?', [id], (err, results) =>{
        if(err) {
            res.status(500).send('Mauvaise manipulation')
        }else{
            res.json(results);
        }
    })
})
//DELETE quand FALSE
app.delete('/api/city', (req,res)=>{

    connection.query('DELETE FROM city WHERE airport = "0"', (err, results) =>{
        if(err) {
            res.status(500).send('Mauvaise manipulation')
        }else{
            res.json(results);
        }
    })
})
app.listen(port);
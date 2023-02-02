const { Router } = require('express');
const router = Router();
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

// Leyendo los datos que tiene almacenados el archivo .json
const json_users = fs.readFileSync('src/books.json', 'utf-8')
let fichero = JSON.parse(json_users);
let arrayUsers = fichero.users;

router.get('/users', (req, res) => {
    res.render('new-users');
})

// Agregando un nuevo usuario al json
router.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    if ( !name || !email || !password ) {
        res.status(400).send('Debe llenar todos los campos');
        return;
    }
    let newUser = {
        id: uuidv4(),
        name,
        email,
        password
    }

    arrayUsers.push(newUser);
    
    const json_users = JSON.stringify(fichero)
    fs.writeFileSync('src/books.json', json_users, 'utf-8')
    res.send('Usuario Agregado correctamente')
    // res.redirect('/');
})

module.exports = router
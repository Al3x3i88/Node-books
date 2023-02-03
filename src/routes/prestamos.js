const { Router } = require('express');
const router = Router();
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const json_db = fs.readFileSync('src/books.json', 'utf-8')
let fichero = JSON.parse(json_db);
let arrayPrestamos = fichero.prestamos;
const users = fichero.users;
const books = fichero.books;

router.get('/prestamos', (req, res) => {
    res.render('new-prestamo');
    console.log(users);
})

router.get('/prestamos/:id/:id', (req, res) => {
    const bookFound = books.find(book => book.id === req.params.id);
    const userFound = users.find(user => user.id === req.params.id);

    // if (!bookFound || !userFound)
    //     return res.status(404).json({
    //         message: "No se puede realiazr un prestamo",
    //     });
    console.log(userFound);
    console.log(bookFound);
})

module.exports = router;
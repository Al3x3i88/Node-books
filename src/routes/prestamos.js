const { Router } = require('express');
const router = Router();
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const nodemailer = require("nodemailer");

const json_db = fs.readFileSync('src/books.json', 'utf-8')
let fichero = JSON.parse(json_db);

let arrayPrestamos = fichero.prestamos;
const users = fichero.users;
const books = fichero.books;

router.get('/prestamos', (req, res) => {
    res.render('new-prestamo');
    console.log(users);
})

router.post('/prestamos/:idUser/:idBook', async(req, res) => {

    const bookFound = books.find(book => book.id === req.params.idBook);
    const userFound = users.find(user => user.id === req.params.idUser);

    let newPrestamo = {
        id: uuidv4(),
        idUser: req.params.idUser,
        book: [bookFound]
    };

    //Crear transporter para el envio de emails
    const transporter = nodemailer.createTransport ({
    host: 'smtp.gmail.com',
    port: '465',
    secure: 'true',
    auth: {
        user: 'alexeirmrz3@gmail.com',
        pass: 'mhrmjpxersnwgnhp'
    },
    tls: {
        rejectUnauthorized: false 
    }
})

    if (!bookFound || !userFound) {
        res.status(404).json({
            message: "No se puede realizar un prestamo",
        });
    }
    console.log(arrayPrestamos.length);
    if (arrayPrestamos.length !== 0) {
        let libro;
        let posicion = null;
        for (let i = 0; i < arrayPrestamos.length; i++) {

            if (arrayPrestamos[i].idUser === req.params.idUser) {

                libro = arrayPrestamos[i].book.filter(book => book.id === req.params.idBook)
                posicion = i;
            }
        }

        if (libro !== undefined && libro[0].id === req.params.idBook) {
            console.log('El libro ya esta prestado a este usuario');
        }
        else if (libro === undefined) {
            arrayPrestamos.push(newPrestamo)

        } else

            arrayPrestamos[posicion].book.push(bookFound);

    } else { arrayPrestamos.push(newPrestamo) }


const info = await transporter.sendMail({
    from: "'Admin Server' <alexeirmrz3@gmail.com>",
    to: 'alexeirmrz3@gmail.com',
    subject: 'Estoes nada mas un correo de pruebas',
    text: 'Me gusta este puto mundo'
})
console.log('Message sent', info.messageId);

    fichero = { ...fichero, "prestamos": arrayPrestamos }
    const json_users = JSON.stringify(fichero)
    fs.writeFileSync('src/books.json', json_users, 'utf-8')

    res.send('Prestamo agregado')

})


router.patch('/prestamos/:idUser/:idBook', (req, res) => {
    const bookFound = books.find(book => book.id === req.params.idBook);
    const userFound = users.find(user => user.id === req.params.idUser);
    if (!bookFound || !userFound) {
        res.status(404).json({
            message: "Informacion incorrecta",
        });
    }
    if (arrayPrestamos.length !== 0) {
        console.log(arrayPrestamos.length);
        let libro;
        let posicion = null;
        for (let i = 0; i < arrayPrestamos.length; i++) {
            if (arrayPrestamos[i].idUser === req.params.idUser) {
                libro = arrayPrestamos[i].book.filter(book => book.id !== req.params.idBook)
                posicion = i;
            }
        }
        console.log(libro);
        if (libro !== undefined ) {
            arrayPrestamos[posicion].book = libro;
            if(arrayPrestamos[posicion].book.length ===0){
                arrayPrestamos = arrayPrestamos.filter(prestam => prestam.idUser !== req.params.idUser);
            }
        } else {
            arrayPrestamos = arrayPrestamos.filter(prestam => prestam.idUser !== req.params.idUser);
            
        }
        // else{console.log('Arreglo de libros vacio');}
    }
    fichero = { ...fichero, "prestamos": arrayPrestamos }
    const json_users = JSON.stringify(fichero)
    fs.writeFileSync('src/books.json', json_users, 'utf-8')
    res.send('libro entregado ')
    // res.render('devoluciones');
})


module.exports = router;

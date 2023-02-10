const { Router } = require('express');
const router = Router();
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const nodemailer = require("nodemailer");

// Leyendo los datos que tiene almacenados el archivo .json
const json_users = fs.readFileSync('src/books.json', 'utf-8')
let fichero = JSON.parse(json_users);
let arrayUsers = fichero.users;
let arrayPrestamos = fichero.prestamos;

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

router.get('/users', (req, res) => {
    res.render('new-users');
})

//Obtener un libro solo libro seleccionado por el id
router.get('/users/:id', (req, res) => {

    const userFound = arrayUsers.find(user => user.id === req.params.id);

    if (!userFound)
        return res.status(404).json({
            message: "Usuario no encontrado",
        });
    res.json(userFound);
})

// Agregando un nuevo usuario al json
router.post('/users', async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).send('Debe llenar todos los campos');
        return;
    }
    let newUser = {
        id: uuidv4(),
        name,
        email,
        password, 
        validate: false
    }
   const mailRepeat = arrayUsers.map((user) => user.email === newUser.email )
    if(mailRepeat === undefined){

    arrayUsers.push(newUser)
 
 const info = await transporter.sendMail({
     from: "'Admin Server' <alexeirmrz3@gmail.com>",
     to: newUser.email,
     subject: 'Validacion de cuenta',
     text: `${name}, el codigo para validar su cuenta es: ${newUser.id}`
 })
 console.log('Message sent', info.messageId);

 const json_users = JSON.stringify(fichero)
 fs.writeFileSync('src/books.json', json_users, 'utf-8')
 res.send('Usuario Agregado correctamente')
 // res.redirect('/');
    }else res.send('Correo ya registrado');
    
})

// Eliminando un Usuario
router.delete('/deleteUser/:id', (req, res) => {
    let userExist;
    let position;
    if (arrayUsers.length !== 0) {
        for (let i = 0; i < arrayPrestamos.length; i++) {

            if (arrayPrestamos[i].idUser === req.params.id) {

                userExist = arrayPrestamos[i]
                position = i;
            }
        }
        if (userExist === undefined || arrayPrestamos[position].book.length === 0) {
            console.log('eliminar usuario');
            console.log(arrayPrestamos[2].book.length);

            arrayUsers = arrayUsers.filter(user => user.id !== req.params.id);
            console.log(arrayUsers);
            fichero = { ...fichero, "users": arrayUsers }
            const json_books = JSON.stringify(fichero)
            fs.writeFileSync('src/books.json', json_books, 'utf-8')
        } else {
            console.log("Este usuario no puede ser eliminado ya que tiene libros a prestamo");
        }
    } else { console.log('No hay usuarios para eliminar'); }

    res.redirect('/');
})

// Modificar los datos de un usuario
router.put('/users/:id', (req, res) => {
    
    const newData = req.query;
    const userFound = arrayUsers.find(user => user.id === req.params.id);
    console.log(userFound);
    if (!userFound)
        return res.status(404).json({
            message: "Usuario no encontrado",
        });

        arrayUsers = arrayUsers.map(b => b.id === req.params.id ? { ...b, ...newData } : b)
    console.log(arrayUsers);
    fichero = {...fichero, "users": arrayUsers}
    console.log(fichero.users);
    const json_books = JSON.stringify(fichero)
    fs.writeFileSync('src/books.json', json_books, 'utf-8')
  res.send('Datos del Usuario Actualizados')
             
})

module.exports = router


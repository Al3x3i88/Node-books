const { Router } = require('express');
const router = Router();
const fs = require('fs')

// Leyendo los datos que tiene almacenados el archivo .json
const json_users = fs.readFileSync('src/books.json', 'utf-8')
let fichero = JSON.parse(json_users);
let arrayUsers = fichero.users;

router.get('/validacion', (req, res) => {
    res.render('new-validacion');
})

router.patch('/validacion/:id', (req, res) => {
    console.log(req.body)
    const usuario = arrayUsers.find(user => user.id === req.body.id)
    if(usuario !== undefined) {
        usuario.validate = true
        
    }else console.log('Usuario no encontrado');
    arrayUsers = arrayUsers.map(b => b.id === req.body.id ? { ...b, ...usuario } : b)
    console.log(usuario);
    
    fichero = {...fichero, "users": arrayUsers}
    console.log(fichero.users);
    const json_books = JSON.stringify(fichero)
    fs.writeFileSync('src/books.json', json_books, 'utf-8')
    res.render('new-validacion');
  
})
    
    

module.exports = router
const { Router } = require('express');
const router = Router();
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

// Leyendo los datos que tiene almacenados el archivo .json
const json_books = fs.readFileSync('src/books.json', 'utf-8')
let fichero = JSON.parse(json_books);
let arrayBooks = fichero.books;

// router.get('/', (req, res) => {
//     res.render('index.ejs', {
//         books
//     })

// })

// Al solicitar la ruta /new-entry voy a renderizar la view new-entry
router.get('/new-entry', (req, res) => {
    res.render('new-entry');
})

// Agregando unnuevo libro al json
router.post('/new-entry', (req, res) => {
    const { title, author, image, description } = req.body;
    if (!title || !author || !image || !description) {
        res.status(400).send('Las entradas deberian tener un titulo y una descripcion');
        return;
    }
    let newBook = {
        id: uuidv4(),
        title,
        author,
        image,
        description
    }

    arrayBooks.push(newBook);
  
    const json_books = JSON.stringify(fichero)
    fs.writeFileSync('src/books.json', json_books, 'utf-8')
    res.send('Nuevo libro Agregado')
    // res.redirect('/');
})

// Eliminando un libro 
router.get('/delete/:id', (req, res) => {
    books = books.filter(book => book.id != req.params.id);
    const json_books = JSON.stringify(books)
    fs.writeFileSync('src/books.json', json_books, 'utf-8')

    res.redirect('/');
})

//Obtener un libro solo libro seleccionado por el id
router.get('/:id', (req, res) => {
    console.log(req.params.id);

    const bookFound = books.find(book => book.id === req.params.id);
    if (!bookFound)
        return res.status(404).json({
            message: "Libro no encontrado",
        });
    res.json(bookFound);
})

// Modificar un libro teniendo el id de este
router.put('/:id', (req, res) => {
    
    const newData = req.query;
    const bookFound = books.find(book => book.id === req.params.id);
    console.log(bookFound);
    if (!bookFound)
        return res.status(404).json({
            message: "Libro no encontrado",
        });

    books = books.map(b => b.id === req.params.id ? { ...b, ...newData } : b)
    console.log(books);
    const json_books = JSON.stringify(books)
    fs.writeFileSync('src/books.json', json_books, 'utf-8')
  res.send('Datos del libro Actualizados')
             
})

module.exports = router;
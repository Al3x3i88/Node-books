const {Router} = require('express');
const router = Router();
const fs = require('fs')
// const uuid = require('uuid/dist/v4')

const json_books = fs.readFileSync('src/books.json', 'utf-8')
let books = JSON.parse(json_books);

router.get('/',(req, res)=>{
    res.render('index.ejs')
    books
})

router.get('/new-entry', (req, res)=>{
    res.render('new-entry'); 
})

router.post('/new-entry', (req, res)=>{
   const {title, author, image, description} = req.body;
   if (!title || !author || !image || !description) {
    res.status(400).send('Las entradas deberian tener un titulo y una descripcion');
    return;
   }
   let newBook = {
    // id: parseInt(books.lenght + 1),
    title,
    author,
    image,
    description
   }

   books.push(newBook);
   const json_books = JSON.stringify(books)
   fs.writeFileSync('src/books.json', json_books, 'utf-8')
    res.send('recibido'); 
})

module.exports = router;
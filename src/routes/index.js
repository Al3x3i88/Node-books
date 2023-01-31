const {Router} = require('express');
const router = Router();

router.get('/',(req, res)=>{
    res.render('index.ejs')
})

router.get('/new-entry', (req, res)=>{
    res.render('new-entry'); 
})

module.exports = router;
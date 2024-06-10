const express = require('express')
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');
const ObjectID = dbo.ObjectID;

app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(bodyparser.urlencoded({ extended: true }))


app.get('/', async (req, res) => {
    let database = await dbo.getDatabase();
    const collection = database.collection('books')
    const cursor = collection.find({})
    let booksDetails = await cursor.toArray();

    let message = "";
    let edit_id, edit_book;

    //edit / update
    if (req.query.edit_id) {
        edit_id = req.query.edit_id;

        edit_book = await collection.findOne({ _id: new ObjectID(edit_id) })
    }

    //delete
    if (req.query.delete_id) {
        delete_id = req.query.delete_id;

        await collection.deleteOne({ _id: new ObjectID(delete_id) })
        return res.redirect('/?status=3');
    }

    switch (req.query.status) {
        case '1':
            message = "Inserted success!";
            break;
        case '2':
            message = "Update success!";
            break;
        case '3':
            message = "Delete success!";
            break;
        default:
            break;
    }
    res.render('main', { message, booksDetails, edit_id, edit_book })
})

//insert
app.post('/store_book', async (req, res) => {
    let book = { title: req.body.title, author: req.body.author };

    let database = await dbo.getDatabase();
    const collection = database.collection('books')
    await collection.insertOne(book)
    return res.redirect('/?status=1');
})

//update
app.post('/update_book/:edit_id', async (req, res) => {
    let book = { title: req.body.title, author: req.body.author };
    let edit_id = req.params.edit_id;

    let database = await dbo.getDatabase();
    const collection = database.collection('books')
    await collection.updateOne({ _id: new ObjectID(edit_id) }, { $set: book })
    return res.redirect('/?status=2');
})

app.listen(8080, () => { console.log("Listening to port:8080"); })

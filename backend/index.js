const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const parser = new XMLParser();

//function for loading books by parsing xml data from the xml file 
const loadBooks = () => {
    const xmlData = fs.readFileSync('./books.xml', 'utf-8');
    const jsonData = parser.parse(xmlData);
    return jsonData.books.book;
};

app.get('/api/books', (req, res) => {
    const books = loadBooks();
    res.json(books);
});

app.get('/api/books/search', (req, res) => {
    const { title, author, isbn } = req.query;
    const books = loadBooks();

    const filteredBooks = books.filter((book) => {
        return (
            (!title || book.title.toLowerCase().includes(title.toLowerCase())) &&
            (!author || book.author.toLowerCase().includes(author.toLowerCase())) &&
            (!isbn || book.isbn === isbn)
        );
    });

    res.json(filteredBooks);
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

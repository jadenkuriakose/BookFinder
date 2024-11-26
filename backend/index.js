const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const parser = new XMLParser();
const secretKey = 'your-secret-key';

const loadBooks = () => {
    const xmlData = fs.readFileSync('./books.xml', 'utf-8');
    const jsonData = parser.parse(xmlData);
    return jsonData.books.book;
};

const users = [];

const generateToken = (user) => {
    return jwt.sign({ id: user.username }, secretKey, { expiresIn: '1h' });
};

app.post('/api/register', (req, res) => {
    const { username, email } = req.body;
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({ message: 'User already registered' });
    }

    users.push({ username, email });
    const token = generateToken({ username, email });
    res.json({ message: 'User registered successfully', token });
});

app.post('/api/login', (req, res) => {
    const { email } = req.body;
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const token = generateToken(user);
    res.json({ message: 'Login successful', token });
});

app.get('/api/books', (req, res) => {
    const books = loadBooks();
    res.json(books);
});

app.get('/api/books/all', (req, res) => {
    const books = loadBooks();
    res.json(books);
});

app.get('/api/books/search', (req, res) => {
    const { title, author, isbn } = req.query;
    const books = loadBooks();

    const filteredBooks = books.filter((book) => {
        return (
            (!title || book.title.toString().trim().toLowerCase().includes(title.trim().toLowerCase())) &&
            (!author || book.author.toString().trim().toLowerCase().includes(author.trim().toLowerCase())) &&
            (!isbn || book.isbn.toString() === isbn.trim())
        );
    });

    res.json(filteredBooks);
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

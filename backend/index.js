const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = 'your-secret-key';
const parser = new XMLParser();
const users = [];

const loadBooks = () => {
    const xmlData = fs.readFileSync('./books.xml', 'utf-8');
    const jsonData = parser.parse(xmlData);
    return jsonData.books.book;
};

app.post('/api/register', (req, res) => {
    const { username, email } = req.body;

    if (users.find((user) => user.email === email)) {
        return res.status(400).json({ message: 'User already registered' });
    }

    const newUser = { id: users.length + 1, username, email };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token });
});

app.get('/api/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = users.find((user) => user.id === decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user });
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
});

app.get('/api/books', (req, res) => {
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


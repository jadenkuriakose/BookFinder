import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [query, setQuery] = useState({ title: '', author: '', isbn: '' });
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/books/search', {
                params: query,
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleChange = (event) => {
        setQuery({ ...query, [event.target.name]: event.target.value });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Book Search</h1>
            <div>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={query.title}
                    onChange={handleChange}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={query.author}
                    onChange={handleChange}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="text"
                    name="isbn"
                    placeholder="ISBN"
                    value={query.isbn}
                    onChange={handleChange}
                />
                <button onClick={handleSearch} style={{ marginLeft: '10px' }}>
                    Search
                </button>
            </div>
            <ul style={{ marginTop: '20px' }}>
                {results.map((book, index) => (
                    <li key={index}>
                        <strong>{book.title}</strong> by {book.author} (ISBN: {book.isbn})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

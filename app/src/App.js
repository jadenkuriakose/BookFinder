import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [query, setQuery] = useState({ title: '', author: '', isbn: '' });
    const [results, setResults] = useState([]);
    const [registerForm, setRegisterForm] = useState({ username: '', email: '' });
    const [loginForm, setLoginForm] = useState({ email: '' });
    const [message, setMessage] = useState('');

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

    const handleShowAllBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/books/all');
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching all books:', error);
        }
    };

    const handleChange = (event) => {
        setQuery({ ...query, [event.target.name]: event.target.value });
    };

    const handleRegisterChange = (event) => {
        setRegisterForm({ ...registerForm, [event.target.name]: event.target.value });
    };

    const handleLoginChange = (event) => {
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/register', registerForm);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error registering user');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/login', loginForm);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error logging in');
        }
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

            <div>
                <button onClick={handleShowAllBooks} style={{ marginTop: '20px' }}>
                    Show All Books
                </button>
            </div>

            <ul style={{ marginTop: '20px' }}>
                {results.length > 0 && results.map((book, index) => (
                    <li key={index}>
                        <strong>{book.title}</strong> by {book.author} (ISBN: {book.isbn})
                    </li>
                ))}
                {results.length === 0 && <p>No books found</p>}
            </ul>

            <div style={{ marginTop: '30px' }}>
                <h2>Register</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                />
                <button onClick={handleRegister}>Register</button>

                <h2>Login</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                />
                <button onClick={handleLogin}>Login</button>
            </div>

            {message && <p>{message}</p>}
        </div>
    );
}

export default App;

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [query, setQuery] = useState({ title: '', author: '', isbn: '' });
    const [results, setResults] = useState([]);
    const [registerForm, setRegisterForm] = useState({ username: '', email: '' });
    const [showRegister, setShowRegister] = useState(false);
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

    const handleChange = (event) => {
        setQuery({ ...query, [event.target.name]: event.target.value });
    };

    const handleRegisterChange = (event) => {
        setRegisterForm({ ...registerForm, [event.target.name]: event.target.value });
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/register', registerForm);
            if (response.data.message === 'User already registered') {
                setMessage('User already registered');
            } else {
                setMessage('User registered successfully');
                setShowRegister(false);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setMessage('Registration failed. You are probably already registered.');
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
            <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
                {results.map((book, index) => (
                    <li key={index} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                        <strong>{book.title}</strong> by {book.author} (ISBN: {book.isbn})
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: '40px' }}>
                <button onClick={() => setShowRegister(!showRegister)}>
                    {showRegister ? 'Cancel Registration' : 'Register'}
                </button>

                {showRegister && (
                    <div style={{ marginTop: '20px' }}>
                        <h2>Register</h2>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={registerForm.username}
                            onChange={handleRegisterChange}
                            style={{ marginRight: '10px' }}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={registerForm.email}
                            onChange={handleRegisterChange}
                        />
                        <button onClick={handleRegister} style={{ marginLeft: '10px' }}>
                            Submit
                        </button>
                    </div>
                )}
            </div>

            {message && (
                <div style={{ marginTop: '20px', color: message.includes('successfully') ? 'green' : 'red' }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default App;


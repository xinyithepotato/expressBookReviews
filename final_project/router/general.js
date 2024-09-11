const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Base URL for the external service
const baseURL = 'https://xinyi395-5003.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai';

// Function to get the list of books
const getBooks = async () => {
    try {
        const response = await axios.get(`${baseURL}/books`);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

// Function to get book details based on ISBN
const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(`${baseURL}/books/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw error;
    }
};

// Function to get book details based on Author
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`${baseURL}/books/author/${author}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching books by author:', error);
        throw error;
    }
};

// Function to get book details based on Title
const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`${baseURL}/books/title/${title}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching books by title:', error);
        throw error;
    }
};

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const booksList = await getBooks();
        return res.status(200).json(booksList);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch books' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await getBookByISBN(isbn);
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: 'Book not found' });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const booksByAuthor = await getBooksByAuthor(author);
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(404).json({ message: 'No books found by this author' });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const booksByTitle = await getBooksByTitle(title);
        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(404).json({ message: 'No books found with this title' });
    }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await getBookByISBN(isbn); // Assuming reviews are fetched with book details
        if (book && book.reviews) {
            return res.status(200).json(book.reviews);
        } else {
            return res.status(404).json({ message: 'No reviews found for this book' });
        }
    } catch (error) {
        return res.status(404).json({ message: 'No reviews found for this book' });
    }
});

module.exports.general = public_users;



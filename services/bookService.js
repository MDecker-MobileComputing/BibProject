import db from '../db.js';
import Book from '../models/book.js';
import { v4 as uuidv4 } from 'uuid';

const createBook = async (title, year, genre, authorId) => {
  await db.read();
  const book = new Book(uuidv4(), title, year, genre, true, authorId);
  db.data.books.push(book);
  await db.write();
  return book;
};

const getAllBooks = async () => {
  await db.read();
  return db.data.books;
};

const getBookByIsbn = async (isbn) => {
  await db.read();
  return db.data.books.find(book => book.isbn === isbn);
};

const updateBook = async (isbn, updates) => {
  await db.read();
  const bookIndex = db.data.books.findIndex(book => book.isbn === isbn);
  if (bookIndex === -1) return null;
  db.data.books[bookIndex] = { ...db.data.books[bookIndex], ...updates };
  await db.write();
  return db.data.books[bookIndex];
};

const deleteBook = async (isbn) => {
  await db.read();
  const bookIndex = db.data.books.findIndex(book => book.isbn === isbn);
  if (bookIndex === -1) return false;
  db.data.books.splice(bookIndex, 1);
  await db.write();
  return true;
};

const searchBooks = async (query) => {
  await db.read();
  return db.data.books.filter(book => 
    book.title.toLowerCase().includes(query.toLowerCase()) || 
    book.genre.toLowerCase().includes(query.toLowerCase())
  );
};

export default { createBook, getAllBooks, getBookByIsbn, updateBook, deleteBook, searchBooks };
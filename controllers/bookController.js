import express from 'express';
import bookService from '../services/bookService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:isbn', async (req, res) => {
  try {
    const book = await bookService.getBookByIsbn(req.params.isbn);
    if (!book) return res.status(404).send('Buch nicht gefunden');
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, year, genre, authorId } = req.body;
    if (!title || !year || !genre || !authorId) {
      return res.status(400).send('Alle Felder sind erforderlich');
    }
    const newBook = await bookService.createBook(title, parseInt(year), genre, authorId);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:isbn', async (req, res) => {
  try {
    const book = await bookService.updateBook(req.params.isbn, req.body);
    if (!book) return res.status(404).send('Buch nicht gefunden');
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:isbn', async (req, res) => {
  try {
    const success = await bookService.deleteBook(req.params.isbn);
    if (!success) return res.status(404).send('Buch nicht gefunden');
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const books = await bookService.searchBooks(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
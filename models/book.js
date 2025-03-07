class Book {
  constructor(isbn, title, year, genre, available, authorId) {
    this.isbn = isbn;
    this.title = title;
    this.year = year;
    this.genre = genre;
    this.available = available;
    this.authorId = authorId;
  }
}

export default Book;
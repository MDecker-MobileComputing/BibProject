const apiUrl = 'http://localhost:3000/books';
const mqttClient = mqtt.connect('wss://mqtt.zimolong.eu');

// MQTT Verbindung
mqttClient.on('connect', () => {
    console.log('Verbunden mit MQTT-Server');
    mqttClient.subscribe('kurs1234mueller/book');
});

mqttClient.on('message', (topic, message) => {
    const msg = JSON.parse(message.toString());
    console.log(`Echtzeit-Update: ${msg.action} - ${msg.url}`);
    fetchBooks();
});

// Bücher abrufen und anzeigen
async function fetchBooks(query = '') {
    const url = query ? `${apiUrl}/search?q=${query}` : apiUrl;
    const response = await fetch(url);
    const books = await response.json();
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card bg-white p-6 rounded-xl shadow-md';
        card.innerHTML = `
            <h3 class="text-xl font-semibold text-gray-800">${book.title}</h3>
            <p class="text-gray-600">Jahr: ${book.year}</p>
            <p class="text-gray-600">Genre: ${book.genre}</p>
            <p class="text-gray-600">Verfügbar: ${book.available ? 'Ja' : 'Nein'}</p>
            <p class="text-gray-600">Autor-ID: ${book.authorId}</p>
            <p class="text-gray-500 text-sm">ISBN: ${book.isbn}</p>
            <div class="mt-4 flex space-x-2">
                <button onclick="editBook('${book.isbn}')" class="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-200 flex-1">Bearbeiten</button>
                <button onclick="deleteBook('${book.isbn}')" class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200 flex-1">Löschen</button>
            </div>
        `;
        bookList.appendChild(card);
    });
}

// Buch hinzufügen
document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = document.getElementById('addFeedback');
    feedback.classList.remove('hidden');

    const book = {
        title: document.getElementById('title').value,
        year: document.getElementById('year').value,
        genre: document.getElementById('genre').value,
        authorId: document.getElementById('authorId').value
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });

        if (response.status === 201) {
            feedback.textContent = 'Buch erfolgreich hinzugefügt!';
            feedback.classList.remove('text-red-500');
            feedback.classList.add('text-green-500');
            e.target.reset();
            fetchBooks();
        } else {
            feedback.textContent = 'Fehler beim Hinzufügen des Buchs.';
            feedback.classList.remove('text-green-500');
            feedback.classList.add('text-red-500');
        }
    } catch (error) {
        feedback.textContent = 'Netzwerkfehler: ' + error.message;
        feedback.classList.remove('text-green-500');
        feedback.classList.add('text-red-500');
    }

    setTimeout(() => feedback.classList.add('hidden'), 3000); // Feedback nach 3 Sekunden ausblenden
});

// Buch bearbeiten
async function editBook(isbn) {
    const response = await fetch(`${apiUrl}/${isbn}`);
    const book = await response.json();
    document.getElementById('editIsbn').value = book.isbn;
    document.getElementById('editTitle').value = book.title;
    document.getElementById('editYear').value = book.year;
    document.getElementById('editGenre').value = book.genre;
    document.getElementById('editAuthorId').value = book.authorId;
    document.getElementById('editModal').classList.remove('hidden');
}

document.getElementById('editBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const isbn = document.getElementById('editIsbn').value;
    const updates = {
        title: document.getElementById('editTitle').value,
        year: document.getElementById('editYear').value,
        genre: document.getElementById('editGenre').value,
        authorId: document.getElementById('editAuthorId').value
    };
    await fetch(`${apiUrl}/${isbn}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    document.getElementById('editModal').classList.add('hidden');
    fetchBooks();
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('editModal').classList.add('hidden');
});

// Buch löschen
async function deleteBook(isbn) {
    if (confirm('Buch wirklich löschen?')) {
        await fetch(`${apiUrl}/${isbn}`, { method: 'DELETE' });
        fetchBooks();
    }
}

// Suche
document.getElementById('search').addEventListener('input', (e) => {
    fetchBooks(e.target.value);
});


fetchBooks();
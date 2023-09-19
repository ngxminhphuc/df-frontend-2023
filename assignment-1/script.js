'use strict';

const overlay = document.querySelector('.overlay');
const modalAdd = document.querySelector('.add-modal');
const modalDelete = document.querySelector('.delete-modal');

const formAdd = document.querySelector('.add-modal__form');
const booksContent = document.querySelector('.books__content');
const deleteBookName = document.querySelector('.delete-modal__name');

const searchInput = document.querySelector('.action__search');
const btnAddBook = document.querySelector('.action__add');
const btnDeleteConfirmed = document.querySelector('.delete-modal__delete');

// Data
const state = {
  books: [],
  query: '',
};

// Helper functions
const closeAllModals = function () {
  overlay.classList.toggle('hidden');
  modalAdd.classList.add('hidden');
  modalDelete.classList.add('hidden');
  formAdd.reset();
};

const toggleAddModal = function () {
  overlay.classList.toggle('hidden');
  modalAdd.classList.toggle('hidden');
  formAdd.reset();
};

const toggleDeleteModal = function () {
  overlay.classList.toggle('hidden');
  modalDelete.classList.toggle('hidden');
};

const generateTableMarkup = function (book) {
  return `
    <tr class="books__book">
      <td>${book.name}</td>
      <td>${book.author}</td>
      <td>${book.topic}</td>
      <td>
        <span class="books__delete" data-id=${book.id}>Delete</span>
      </td>
    </tr>
  `;
};

const renderBooksTable = function (books) {
  const tableMarkup =
    Array.isArray(books) && books.length
      ? books.map(book => generateTableMarkup(book)).join('')
      : '';

  booksContent.innerHTML = '';
  return booksContent.insertAdjacentHTML('afterbegin', tableMarkup);
};

const renderBooks = function () {
  if (state.query.length === 0) {
    renderBooksTable(state.books);
  } else {
    renderBooksTable(
      state.books.filter(book => book.name.toLowerCase().includes(state.query))
    );
  }
};

const persistBooks = function () {
  localStorage.setItem('allBooks', JSON.stringify(state.books));
};

const loadBooks = function () {
  const data = localStorage.getItem('allBooks');
  if (!data) return;
  state.books = JSON.parse(data);
};

// Initialize Application
const app = function () {
  btnAddBook.addEventListener('click', toggleAddModal);

  booksContent.addEventListener('click', e => {
    const clicked = e.target;

    if (clicked.closest('.books__delete')) {
      const bookID = clicked.dataset.id;

      deleteBookName.textContent = state.books.find(
        book => book.id === bookID
      ).name;

      toggleDeleteModal();
      btnDeleteConfirmed.setAttribute('data-id', bookID);
    }
  });

  overlay.addEventListener('click', closeAllModals);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals();
  });

  modalAdd.addEventListener('click', e => {
    const clicked = e.target;

    if (clicked.closest('.modal__close')) {
      toggleAddModal();
    }
  });

  modalDelete.addEventListener('click', e => {
    const clicked = e.target;

    if (
      clicked.closest('.delete-modal__cancel') ||
      clicked.closest('.modal__close')
    ) {
      toggleDeleteModal();
    } else if (clicked.closest('.delete-modal__delete')) {
      const idx = state.books.findIndex(book => book.id === clicked.dataset.id);

      state.books.splice(idx, 1);
      persistBooks(state.books);

      renderBooks();
      toggleDeleteModal();
    }
  });

  // Handler functionality
  formAdd.addEventListener('submit', e => {
    e.preventDefault();
    const entries = [['id', `${Date.now()}`], ...new FormData(formAdd)];
    const book = Object.fromEntries(entries);

    state.books.push(book);
    persistBooks(state.books);

    renderBooks();
    toggleAddModal();
  });

  searchInput.addEventListener('keyup', () => {
    const query = searchInput.value.trim().toLowerCase();

    state.query = query;
    renderBooks();
  });

  loadBooks();
  renderBooksTable(state.books);
};

app();

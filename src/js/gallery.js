import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.baseURL = 'https://books-backend.p.goit.global/books';

const booksSection = document.querySelector('.gallery');
const categoryList = document.querySelector('.category-list');
const categorySection = document.querySelector('.category-gallery');
const mainTitle = document.querySelector('.home-main-span')
const mainTitleLastWtord = document.querySelector('.home-main-span-lastword')

booksSection.addEventListener('click', onSeeMoreClick);

fetchBooks();

async function fetchBooks() {
    mainTitle.textContent = 'BEST SELLERS';
    mainTitleLastWtord.textContent = ' BOOKS';
  
  try {
    const { data } = await axios.get('/top-books');
    const markup = renderList(data);
    booksSection.innerHTML = markup;
  } catch (error) {
    console.log(error.message);
    Notiflix.Notify.failure('Something went wrong');
    console.log('Something went wrong:', error.message);
  }
}

async function fetchByCategory(category) {
  try {
     const { data } = await axios.get(`/category?category=${category}`);
    console.log(data)
    if (data.length === 0) {
      return Notiflix.Notify.info('Книги закінчились')
    }
    const markup = renderOneCategory(data);
    booksSection.style.display = 'none';
    categorySection.innerHTML = markup;
  } catch (error) {
    Notiflix.Notify.failure('Помилка: ', error.message)
  }
   
}

function renderList(data) {
  return data
    .map(({ list_name, books }) => {
      return `<li class="main-gallery-item">
        <h2 class="gallery-item-genre">${list_name}</h2>
        <ul class="gallery-category">
        ${renderCategories(books)}
        </ul>
        <button type="button" class="gallery-button">SEE MORE</button></li>
        </li>`;
    })
    .join('');
}


function renderCategories(books) {
  return books
    .map(({ book_image, title, author }) => {
      return `<li class="gallery-item">
        <div class="gallery-item-thumb">
        <img class="gallery-item-image" loading="lazy" src="${book_image}">
        </div>
        <p class="gallery-item-title">${title}</p>
        <p class="gallery-item-author">${author}</p>
        </li>
           `;
    })
    .join('');
}

function renderOneCategory(data) {
    return data.map(({ book_image, title, author }) => {
      return `<li class="gallery-item">
        <div class="gallery-item-thumb">
        <img class="gallery-item-image" loading="lazy" src="${book_image}">
        </div>
        <p class="gallery-item-title">${title}</p>
        <p class="gallery-item-author">${author}</p>
        </li>
           `;
    })
    .join('');
}

function onSeeMoreClick(e) {
    if (!e.target.classList.contains('gallery-button')) {
        return
    }

    const categoryQuery = e.target.parentNode.children[0].textContent;
    const categoryQueryArray = categoryQuery.split(' ');
    mainTitle.textContent = categoryQueryArray.slice(0, categoryQueryArray.length - 1).join(' ');
    mainTitleLastWtord.textContent = categoryQueryArray[categoryQueryArray.length - 1];
    for (const category of categoryList.children) {
        category.classList.remove('category-list-item-active')
        if (categoryQuery.toLowerCase() === category.textContent.toLowerCase()) {
            category.classList.add('category-list-item-active')
                   }
    }
    fetchByCategory(categoryQuery)
}


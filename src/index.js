import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const submitBtn = document.querySelector('[type="submit"]');
const loadBtn = document.querySelector('.load-more');

console.log(loadBtn);

submitBtn.addEventListener('click', submitHandler);

function submitHandler(evt) {
  evt.preventDefault();

  let q = form.searchQuery.value;
  console.log(q);
  fetchQuery(q)
    .then(data => console.log(data.hits))
    .then(data => (gallery.insertAdjacentHTML = createMarkup(data.hits)))
    .catch(() =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}

function fetchQuery(q) {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = new URLSearchParams({
    key: '39252796-33dd54a02d1582f089eb20416',
    // q: "",
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return fetch(`${BASE_URL}?${params}&q=${q}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function createMarkup(arr) {
  return arr
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views }) => `
    <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${likes}
      </p>
      <p class="info-item">
        <b>Views</b>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${downloads}
      </p>
    </div>
  </div>`
    )
    .join('');
}

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.

// async function getUser() {
//     try {
//       const response = await axios.get('/user?ID=12345');
//       console.log(response);
//     } catch (error) {
//       console.error(error);
//     }
//   }

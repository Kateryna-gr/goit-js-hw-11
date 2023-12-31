import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const submitBtn = document.querySelector('[type="submit"]');
const loadBtn = document.querySelector('.load-more');
loadBtn.style.display = 'none';

let pageNum = 1;
let perPage = 40;

submitBtn.addEventListener('click', submitHandler);
loadBtn.addEventListener('click', loadHandler);

async function fetchQuery(query) {
  const BASE_URL = 'https://pixabay.com/api/';
  const apiKey = '39252796-33dd54a02d1582f089eb20416';
  const params = new URLSearchParams({
    key: apiKey,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pageNum,
    per_page: perPage,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="photo-card">
    <a class="photo-link" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" height="200" loading="lazy" />
    </a>
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

function submitHandler(evt) {
  evt.preventDefault();

  loadBtn.style.display = 'none';
  gallery.innerHTML = '';
  pageNum = 1;
  let q = form.searchQuery.value;
  console.log(q, pageNum);
  fetchQuery(q)
    .then(data => {
      if (data.hits.length === 0) {
        throw new Error('No images found.');
      }
      return data;
    })
    .then(data => {
      gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      if (pageNum < data.totalHits / perPage) {
        loadBtn.style.display = 'block';
      } else
        Notiflix.Notify.warning(`All found ${data.totalHits} images are shown.`);
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function loadHandler() {
  pageNum += 1;

  let q = form.searchQuery.value;
  console.log(q, pageNum);
  fetchQuery(q)
    .then(data => {
      if (data.hits.length === 0) {
        throw new Error('No images found.');
      }
      return data;
    })
    .then(data => {
      if (pageNum > data.totalHits / perPage) {
        Notiflix.Notify.warning(`All found ${data.totalHits} images are shown.`);
        loadBtn.style.display = 'none';
      }
      gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    })
    .catch(error => console.error(error));
}

new SimpleLightbox('.photo-link', {
  captionsData: 'alt',
  captionPosition: 'top',
  close: true,
  closeText: '×',
});

import './css/styles.css';
import Notiflix from 'notiflix';

const axios = require('axios').default;

const pageForm = document.querySelector('form.search-form');
const pageInput = document.querySelector('input[name="searchQuery"]');
const searchButton = document.querySelector('button[type="submit"]');
const loadMoreButton = document.querySelector('button.load-more');

const galleryPlace = document.querySelector('div.gallery');

async function searchPictures(joinedInputValue) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=26513861-7ba7a860ef1b492cf85cf7d68&q=${joinedInputValue}&image_type=photo&orientation=horizontal&safesearch=true`,
    );
    return response;
  } catch (error) {
    return error;
  }
}


function createGalleryTags(backendObjects) {
  const markup = backendObjects
    .map(
      backendObj =>
        `<div class="photo-card">
          <img class="gallery__image" src="${backendObj.webformatURL}" alt="${backendObj.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>${backendObj.likes}
            </p>
            <p class="info-item">
              <b>Views</b>${backendObj.views}
            </p>
            <p class="info-item">
              <b>Comments</b>${backendObj.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>${backendObj.downloads}
            </p>
          </div>
        </div>`,
    )
    .join('');
  galleryPlace.innerHTML = markup;
}

const hideLoadButton = () => {
  if (loadMoreButton.classList.contains('load-more--visible')) {
    loadMoreButton.classList.replace('load-more--visible', 'load-more--hidden');
  }
};

const showLoadButton = () => {
  if (loadMoreButton.classList.contains('load-more--hidden')) {
    loadMoreButton.classList.replace('load-more--hidden', 'load-more--visible');
  }
};

const galleryGenerator = event => {
  event.preventDefault();

  hideLoadButton();

  const inputValue = pageInput.value;
  const joinedInputValue = inputValue.split(' ').join('+');
  searchPictures(joinedInputValue)
    .then(response => {
      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
        galleryPlace.innerHTML = '';
      } else {
        createGalleryTags(response.data.hits);
        showLoadButton();
      };
    })
    .catch(error => {
      console.log(error);
    });
};

searchButton.addEventListener('click', galleryGenerator);

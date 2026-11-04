// src/main.js - Main application logic
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let query = '';
let page = 1;
let totalHits = 0;
let imagesLoaded = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

iziToast.settings({
  position: 'topRight',
  timeout: 3000,
  close: true,
  closeOnClick: true,
  pauseOnHover: true,
  progressBar: true,
  transitionIn: 'fadeInLeft',
  transitionOut: 'fadeOutRight',
});

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  query = searchInput.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Помилка',
      message: 'Будь ласка, введіть пошуковий запит',
    });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.warning({
        title: 'Увага',
        message: 'Зображення за цим запитом не знайдені',
      });
    } else {
      totalHits = data.totalHits;
      imagesLoaded = 0;
      createGallery(data.hits);
      imagesLoaded = data.hits.length;

      if (data.hits.length < 15) {
        hideLoadMoreButton();
        iziToast.info({
          title: 'Повідомлення',
          message: "Ми засмучені, але you've reached the end of search results.",
        });
      } else {
        showLoadMoreButton();
      }
    }
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Сталася помилка при пошуку зображень',
    });
    console.error(error);
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  hideLoadMoreButton();
  showLoader();

  page += 1;

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (data.hits.length < 15 || page * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Повідомлення',
        message: "Ми засмучені, але you've reached the end of search results.",
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Сталася помилка при завантаженні додаткових зображень',
    });
    console.error(error);
  } finally {
    hideLoader();
  }
});

// Handle escape key for lightbox
export { lightbox, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton };

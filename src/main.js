import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery, clearGallery, showLoader, hideLoader,
  showLoadMoreButton, hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const input = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const moreButton = document.querySelector('.load-more');
const END_MESSAGE = "We're sorry, but you've reached the end of search results.";
const PAGE_SIZE = 15;
let query = '';
let page = 1;
let totalHits = 0;
let loaded = 0;
let loading = false;

function hasMore() {
  return loaded < Math.min(totalHits, 500);
}

function updateButton() {
  if (hasMore()) showLoadMoreButton();
  else {
    hideLoadMoreButton();
    if (loaded > 0) iziToast.info({ message: END_MESSAGE });
  }
}

async function fetchImages(nextPage, append) {
  if (loading) return;
  loading = true;
  hideLoadMoreButton();
  showLoader();
  try {
    const data = await getImagesByQuery(query, nextPage);
    if (!data.hits.length) {
      if (!append) iziToast.warning({
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      else iziToast.info({ message: END_MESSAGE });
      return;
    }
    createGallery(data.hits);
    totalHits = data.totalHits;
    loaded += data.hits.length;
    page = nextPage;
    updateButton();

    if (append && gallery.firstElementChild) {
      const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
    }
  } catch {
    iziToast.error({ message: 'Failed to load images. Please try again.' });
    if (append && hasMore()) showLoadMoreButton();
  } finally {
    loading = false;
    hideLoader();
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (loading) return;
  const value = input.value.trim();
  if (!value) {
    iziToast.warning({ message: 'Please enter a search query.' });
    return;
  }
  query = value;
  page = 1;
  totalHits = 0;
  loaded = 0;
  clearGallery();
  hideLoadMoreButton();
  await fetchImages(1, false);
});

moreButton.addEventListener('click', async () => {
  if (loading || !query || !hasMore()) return;
  await fetchImages(page + 1, true);
});

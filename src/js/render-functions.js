import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

function refreshLightbox() {
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

export function createGallery(images) {
  const markup = images.map(({
    webformatURL, largeImageURL, tags, likes, views, comments, downloads,
  }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${escapeHTML(largeImageURL)}">
        <img class="gallery-image" src="${escapeHTML(webformatURL)}" alt="${escapeHTML(tags)}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </li>
  `).join('');
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  gallery.insertAdjacentHTML('beforeend', markup);
  refreshLightbox();
}

export function clearGallery() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  gallery.innerHTML = '';
  lightbox?.refresh();
}
export function showLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  loader.classList.remove('hidden');
}

export function hideLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  loader.classList.add('hidden');
}

export function showLoadMoreButton() {
  const loadMoreButton = document.querySelector('.load-more');
  if (!loadMoreButton) return;
  loadMoreButton.classList.remove('hidden');
}

export function hideLoadMoreButton() {
  const loadMoreButton = document.querySelector('.load-more');
  if (!loadMoreButton) return;
  loadMoreButton.classList.add('hidden');
}

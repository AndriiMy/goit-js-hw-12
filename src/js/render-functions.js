import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

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
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
  lightbox.refresh();
}
export function showLoader() { loader.classList.remove('hidden'); }
export function hideLoader() { loader.classList.add('hidden'); }
export function showLoadMoreButton() { loadMoreButton.classList.remove('hidden'); }
export function hideLoadMoreButton() { loadMoreButton.classList.add('hidden'); }

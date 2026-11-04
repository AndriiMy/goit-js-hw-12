import axios from 'axios';

const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

export async function getImagesByQuery(query, page) {
  if (!API_KEY) throw new Error('Set VITE_PIXABAY_API_KEY in .env');
  const { data } = await axios.get('https://pixabay.com/api/', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 15,
    },
  });
  return data;
}

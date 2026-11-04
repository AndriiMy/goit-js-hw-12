// src/js/pixabay-api.js - Pixabay API module for image search
import axios from 'axios';

export async function getImagesByQuery(query, page) {
  const API_KEY = 'YOUR_API_KEY'; // Замените на ваш ключ API, не храните его в репозитории

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 15,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
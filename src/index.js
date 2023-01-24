const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const input = document.querySelector('.input')
const form = document.querySelector('.search-form')
const gallery = document.querySelector('.gallery')
const btnLoadMore = document.querySelector('.load-more')

const clickOnThePicture = new SimpleLightbox('.gallery .image-link', { captionDelay: 250 });

let pageNumber = null;
let searchQuery;
let numberOfImagesPerPage;
const perPage = 40;

form.addEventListener('submit', clickSerch)

async function clickSerch(e) {
  e.preventDefault();
  searchQuery = input.value.split(' ').join('+');
    try {
      const response = await axios.get(`https://pixabay.com/api/?key=33070730-25f95ed9e03123c99fcb559cb&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}`);
      if (response.data.hits.length === 0 || input.value.trim().length === 0) {
        gallery.innerHTML = "";
        btnLoadMore.style.display = "none";
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        input.value = "";
      } else {
        input.value = input.value.trim();
        Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
        gallery.innerHTML = markupGallery(response.data.hits);
        numberOfImagesPerPage = response.data.hits.length;
        clickOnThePicture.refresh();
        pageNumber = 2;
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        if (response.data.hits.length < perPage) {
          btnLoadMore.style.display = "none";
        } else {
          btnLoadMore.style.display = "block";
        };
      }
    } catch (error) {
    console.error(error);
  }
}


function markupGallery(arrey) {
  return arrey.map(object => `<div class="photo-card">
  <div class="thumb">
    <a class="image-link" href="${object.largeImageURL}">
      <img class="photo-card-img" src="${object.webformatURL}" alt="${object.tags}" loading="lazy"/>
    </a>
  </div>
  <div class="info">
        <div class="info-item">
          <p><b>Likes</b></p>
          <p class="value">${object.likes}</p>
        </div>
        <div class="info-item">
          <p><b>Views</b></p>
          <p class="value">${object.views}</p>
        </div>
        <div class="info-item">
          <p><b>Comments</b></p>
          <p class="value">${object.comments}</p>
        </div>
        <div class="info-item">
          <p><b>Downloads</b></p>
          <p class="value">${object.downloads}</p>
        </div>
       </div> 
</div>`).join('')
}



btnLoadMore.addEventListener('click', clickLoadMore);

async function clickLoadMore() {
  try {
      // const searchQuery = input.value.split(' ').join('+');
      const response = await axios.get(`https://pixabay.com/api/?key=33070730-25f95ed9e03123c99fcb559cb&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${pageNumber}`);
      gallery.insertAdjacentHTML('beforeend', markupGallery(response.data.hits));
      numberOfImagesPerPage += response.data.hits.length;
      clickOnThePicture.refresh();
      pageNumber += 1;
      if (numberOfImagesPerPage >= response.data.totalHits) {
        Notify.failure("We're sorry, but you've reached the end of search results.")
        btnLoadMore.style.display = "none"
      }
    } catch (error) {
      Notify.failure("We're sorry, but you've reached the end of search results.")
      btnLoadMore.style.display = "none"
      console.error(error);
  }
}

 

const textInput = document.querySelector(".search-bar__input");
const searchBtn = document.querySelector(".search-icon");
const searchResultText = document.querySelector(".search-result__text");
const searchResultContainer = document.querySelector(
  ".search-result__container"
);
const modalContainer = document.querySelector(".modal-container");
// Fetch search result//

const fetchSearch = async (artistName) => {
  try {
    const response =
      await fetch(`https://itunes.apple.com/search?term=${artistName}&media=music&entity=album&attribute=artistTerm&limit=100
  `);
    if (!response.ok) {
      throw new Error(`Bad request: ${result.status}, ${result.text}`);
    } else {
      const data = await response.json();
      const result = data.results;

      //Search Result Info
      const resultInfo = `${data.resultCount} results for "${textInput.value}" `;
      searchResultText.innerHTML = resultInfo;

      // MAP THE RESULT

      const renderAlbum =
        result &&
        result.map((album) => {
          return ` <div class="result-card" onclick="toggleModal(${album.collectionId})">
          <div class="card-media">
            <img class="card-picture" src=${album.artworkUrl60} alt="artist picture" />
          </div>
          <div class="card-title">
            <p class="card-album__title">${album.collectionName}</p>
          </div>
        </div>
          `;
        });

      // Render to the DOM
      searchResultContainer.innerHTML = renderAlbum.join("");
    }
  } catch (error) {
    console.log(error);
  }
};

// Event Handlers

searchBtn.addEventListener("click", () => {
  if (textInput.value) {
    const searchName = textInput.value;
    fetchSearch(searchName);
  }
});

// Debounce Method
const debounce = function (fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

textInput.addEventListener(
  "keyup",
  debounce(() => {
    fetchSearch(textInput.value);
  }, 500)
);

// Modal optional

const toggleModal = async (id) => {
  const responseData = await fetch(
    `https://itunes.apple.com/lookup?id=${id}&entity=song`
  );
  const albumData = await responseData.json();
  const albumInfo = albumData.results[0];
  console.log(albumInfo);
  const modalComponent = ` <div class="album-details__modal">
  <i onclick="onModalClose()" class="modal-close fas fa-close"></i>
  <div class="details-modal__media">
    <img class="modal-image" src=${albumInfo.artworkUrl100} />
  </div>
  <div class="details-modal__body">
    <p class="modal-artist_name">${albumInfo.artistName}</p>
    <h2 class="modal-album_title">${albumInfo.collectionName}</h2>
    <p class="modal-genre">Genre: ${albumInfo.primaryGenreName}</p>
    <p class="modal-release__date">Released: ${new Date(
      albumInfo.releaseDate
    ).toLocaleDateString()}</p>
    <p class="modal-label">${albumInfo.copyright}s</p>
  </div>
</div>`;
  // render to DOM

  modalContainer.classList.remove("hidden");
  modalContainer.innerHTML = modalComponent;
};

// Close Modal

const onModalClose = () => {
  modalContainer.classList.add("hidden");
};

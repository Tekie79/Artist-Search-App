const textInput = document.querySelector(".search-bar__input");
const searchBtn = document.querySelector(".search-icon");
const searchResultText = document.querySelector(".search-result__text");
const searchResultContainer = document.querySelector(
  ".search-result__container"
);

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
          return ` <div class="result-card">
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

document.addEventListener("keydown", (event) => {
  const keyName = event.key;

  if (keyName === "Enter") {
    if (textInput.value) {
      fetchSearch(textInput.value);
    }
  }
});

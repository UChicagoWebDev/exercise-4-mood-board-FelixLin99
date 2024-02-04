const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {
  // Clear previous search results
  document.querySelector("#resultsImageContainer").innerHTML = "";

  openResultsPane();

  // Build the query
  let query = document.querySelector(".search input").value.trim();

  if (query === "") {
    alert("Please enter a search term");
    return false;
  }

  let request = new XMLHttpRequest();

  request.open("GET", `${bing_api_endpoint}?q=${encodeURIComponent(query)}`, true);
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.responseType = "json";

  request.onload = function () {
    if (request.status === 200) {
      // Display image results
      displayImageResults(request.response.value);

      // Display related concepts
      displayRelatedConcepts(request.response.relatedSearches);
    } else {
      alert("Error fetching search results. Please try again.");
    }
  };

  request.send();

  return false;
}

function displayImageResults(images) {
  const resultsContainer = document.querySelector("#resultsImageContainer");

  images.forEach((image) => {
    const resultImage = document.createElement("div");
    resultImage.classList.add("resultImage");

    const imgElement = document.createElement("img");
    imgElement.src = image.thumbnailUrl;

    resultImage.appendChild(imgElement);

    // Clicking on a result image adds it to the user's mood board
    resultImage.addEventListener("click", function () {
      addToMoodBoard(image.contentUrl);
    });

    resultsContainer.appendChild(resultImage);
  });
}

function displayRelatedConcepts(relatedConcepts) {
  const suggestionsContainer = document.querySelector(".suggestions ul");
  suggestionsContainer.innerHTML = "";

  relatedConcepts.forEach((concept) => {
    const suggestion = document.createElement("li");
    suggestion.textContent = concept.displayText;

    // Clicking on a related concept runs a new search for that concept
    suggestion.addEventListener("click", function () {
      document.querySelector(".search input").value = concept.displayText;
      runSearch();
    });

    suggestionsContainer.appendChild(suggestion);
  });
}

function addToMoodBoard(imageUrl) {
  const moodBoardContainer = document.querySelector("#board");

  const savedImage = document.createElement("div");
  savedImage.classList.add("savedImage");

  const imgElement = document.createElement("img");
  imgElement.src = imageUrl;

  savedImage.appendChild(imgElement);
  moodBoardContainer.appendChild(savedImage);
}

function openResultsPane() {
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  document.querySelector("#resultsExpander").classList.remove("open");
}

document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    runSearch();
  }
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    closeResultsPane();
  }
});

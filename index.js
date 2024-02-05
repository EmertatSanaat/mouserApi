// Selecting Neccessary nodes
let panelContainer = document.querySelector(".panel");
let searchBox = document.querySelector(".search-box");
let searchError = document.querySelector("#search-error");
let searchResult = document.querySelector("#search-result");
let searchBtn = document.querySelector(".search-button");
let methodSelector = document.querySelector(".select-method");
let loadingEl = document.querySelector(".loading");
// Data Types
let data = [];
let inputValue;
let searchMethod = "nameSearch";
let isLoading = false;

// This is the starting animation of panel
searchBox.addEventListener(
  "focus",
  () => {
    if (window.innerWidth <= 520) {
      panelContainer.style.height = "100vh";
    } else {
      panelContainer.style.height = "80vh";
    }
  },
  { once: true }
);
searchBox.addEventListener("keyup", (e) => {
  inputValue = e.target.value;
});
// here first we check if the data is returned and then we add an elemnt to DOM based on the data

function checkResult() {
  if (data.length <= 0) {
    searchError.style.display = "block";
    searchResult.style.display = "none";
  } else {
    searchError.style.display = "none";
    searchResult.style.display = "flex";
  }
  for (let i = 0; i < data.length; i++) {
    // This is for the container item
    const newLi = document.createElement("li");
    newLi.classList.add("list-item");
    // This is for the image
    const newLiImg = document.createElement("img");
    newLiImg.classList.add("information-img");
    newLiImg.setAttribute("src", data[i].ImagePath);
    newLi.appendChild(newLiImg);
    // This is for partnumber area\
    const newLiPartNumber = document.createElement("div");
    newLiPartNumber.textContent = data[i].MouserPartNumber;
    newLiPartNumber.classList.add("information-part-number");
    newLi.appendChild(newLiPartNumber);

    // This is for manufacturer area
    const newLiManu = document.createElement("div");
    newLiManu.textContent = data[i].Manufacturer;
    newLiManu.classList.add("information-manu");
    newLi.appendChild(newLiManu);
    // This is for description
    const newLiDesc = document.createElement("div");
    newLiDesc.textContent = data[i].Description;
    newLiDesc.classList.add("information-desc");
    newLi.appendChild(newLiDesc);

    searchResult.append(newLi);
  }
}
// Magic happens here we send a POST request to mouser servers and the data gets returend
async function getData() {
  isLoading = true;
  if (isLoading == true) {
    loadingEl.style.display = "flex";
    searchError.style.display = "none";
  }
  if (searchMethod === "nameSearch") {
    await axios
      .post(
        "https://api.mouser.com/api/v1/search/keyword?apiKey=ffaf18f5-b5fb-4e14-a06f-518c1000e652",
        {
          SearchByKeywordRequest: {
            keyword: `${inputValue}`,
            records: 0,
            startingRecord: 0,
            searchOptions: "string",
            searchWithYourSignUpLanguage: "string",
          },
        }
      )
      .then((res) => {
        if (data.length > 0) {
          while (searchResult.childNodes.length >= 3) {
            searchResult.removeChild(searchResult.lastChild);
          }
          data.splice(0, data.length);
        }
        isLoading = false;
        if (isLoading == false) {
          loadingEl.style.display = "none";
        }
        data = res.data.SearchResults.Parts;
      })
      .then(() => {
        checkResult();
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (searchMethod === "partSearch") {
    isLoading = true;
    if (isLoading == true) {
      loadingEl.style.display = "flex";
      searchError.style.display = "none";
    }
    await axios
      .post(
        "https://api.mouser.com/api/v1/search/partnumber?apiKey=ffaf18f5-b5fb-4e14-a06f-518c1000e652",
        {
          SearchByPartRequest: {
            mouserPartNumber: `${inputValue}`,
            partSearchOptions: "string",
          },
        }
      )
      .then((res) => {
        if (data.length > 0) {
          while (searchResult.childNodes.length >= 3) {
            searchResult.removeChild(searchResult.lastChild);
          }
          data.splice(0, data.length);
        }
        isLoading = false;
        if (isLoading == false) {
          loadingEl.style.display = "none";
        }
        data = res.data.SearchResults.Parts;
      })
      .then(() => {
        checkResult();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

methodSelector.addEventListener("change", () => {
  searchMethod = methodSelector.value;
});
searchBtn.addEventListener("click", getData);
checkResult();

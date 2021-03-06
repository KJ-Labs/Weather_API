//Variables
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const list2 = document.querySelector(".ajax-section .weekforecast");
var clearbtn = document.getElementById(".clear");
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;
const apiKey = "4d8fb5b93d4af21d66a2948710284366";



//Local Storage for the Daily Forecast Cards - data is from the get weather function
let cardDataArray = [];
const retrievedData = JSON.parse(localStorage.getItem('cardDataArray')) || [];
for (let i = 0; i < retrievedData.length; i++) {
    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${retrievedData[i].weather[0]["icon"]}.svg`;

    const li = document.createElement("li");
    li.classList.add("city");
    const markup = `
        <h2 class="city-name" data-name="${retrievedData[i].name},${retrievedData[i].sys.country}">
        <span id = 'namething'>${retrievedData[i].name}</span>
        <sup>${retrievedData[i].sys.country}</sup>
        </h2>
        <div class="date-div">${today}</div>
        <div class="city-temp">${Math.round((retrievedData[i].main.temp * 1.80 + 32))}<sup>°F</sup></div>
        <div class="wind-speed">${retrievedData[i].wind.speed}<sup> MPH Wind Speed</sup></div>
        <div class="wind-speed">${retrievedData[i].main.humidity}<sup> % Humidity</sup></div>
        <div id = "uv" >${retrievedData[i].uv}<sup> UV Index</sup></div>
        <figure>
            <img class="city-icon" src="${icon}" alt="${retrievedData[i].weather[0]["description"]}">
            <figcaption>${retrievedData[i].weather[0]["description"]}</figcaption>
        </figure>`;

    li.innerHTML = markup;
    list.prepend(li);
    // This section changes the UV element to be a certain color depending on the UV index.
    var element = document.getElementById("uv")
    if (retrievedData[i].uv <= 4) {
        element.classList.add("wind-speedgreen")
    } else if (retrievedData[i].uv <= 9) {
        element.classList.add("wind-speedyellow")
    } else {
        element.classList.add("wind-speedred")
    }

    // This section is to push the city name back to the search bar,
    // so the user can see the most up to date forecast for the city.
    var cityname = document.getElementById('namething')
    cityname.onclick = function () {
        document.getElementById("searchbox").value = retrievedData[i].name;
    }
    cardDataArray.push(retrievedData[i])
}


// This section is to clear the local storage, so that the user can restart.
document.getElementById("clear").addEventListener("click", function () {
    localStorage.clear();
    location.reload();
    console.log('clear_button_working')
});


// This section is a listener for the submit form area which passes
// the city name down to weather and fiveDayForecast so that their cards are generated.
form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;
    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);

    if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
            let content = "";
            if (inputVal.includes(",")) {
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el
                        .querySelector(".city-name span")
                        .textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name").dataset.name.toLowerCase();
                }
            } else {
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == inputVal.toLowerCase();
        });


    }
    //This section gets the name from the listener, goes to open weather and gets the info needed.
    function getweather() {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const { main, name, sys, weather, wind } = data;

                fetch("https://api.openweathermap.org/data/2.5/uvi?appid=4d8fb5b93d4af21d66a2948710284366&lat=" + data.coord.lat + "&lon=" + data.coord.lon)
                    .then(response => response.json())
                    .then(data => {
                        var uv = data.value;
                        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
                            weather[0]["icon"]
                            }.svg`;
                        const li = document.createElement("li");
                        li.classList.add("city");
                        const markup = `
                            <h2 class="city-name" data-name="${name},${sys.country}">
                            <span id = 'namething'>${name}</span>
                            <sup>${sys.country}</sup>
                            </h2>
                            <div class="date-div">${today}</div>
                            <div class="city-temp">${Math.round((main.temp * 1.80 + 32))}<sup>°F</sup></div>
                            <div class="wind-speed">${wind.speed}<sup> MPH Wind Speed</sup></div>
                            <div class="wind-speed">${main.humidity}<sup> % Humidity</sup></div>
                            <div id = "uv">${uv}<sup> UV Index</sup></div>
                            <figure>
                            <img class="city-icon" src="${icon}" alt="${
                            weather[0]["description"]
                            }">
                            <figcaption>${weather[0]["description"]}</figcaption>
                            </figure>`;
                        //This section is to turn the card green/yellow/red depending on the UV index. This section is for it, before it enters local storage.
                        li.innerHTML = markup;
                        list.prepend(li);
                        var element = document.getElementById("uv")
                        if (uv <= 4) {
                            element.classList.add("wind-speedgreen")
                        } else if (uv <= 9) {
                            element.classList.add("wind-speedyellow")
                        } else {
                            element.classList.add("wind-speedred")
                        }
                        cardDataArray.push({ main, name, sys, weather, wind, uv, element })
                        localStorage.setItem('cardDataArray', JSON.stringify(cardDataArray))

                        //This section allows the user to select the card info into the search bar
                        // It is for when the data has not been committed to local storage, but the user still wants to see that city again
                        var cityname = document.getElementById('namething')
                        cityname.onclick = function () {
                            console.log(cityname);
                            document.getElementById("searchbox").value = name;
                        }
                    })
            })
            .catch(() => {
                msg.textContent = "Please search for a valid city";
            });
    };
    getweather()

    //This section gets the weekly forecast by using the city entered in the submit form box.
    function fiveDayForecast(data) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputVal}&appid=${apiKey}&units=metric`
        fetch(url)
            .then(response => response.json())
            .then(data => {


                for (let i = 0; i < data.list.length; i++) {
                    if (data.list[i].dt_txt.includes("12:00:00")) {
                        const div = document.createElement("div");
                        div.className = 'block';
                        div.classList.add("weekforecast2");
                        const uvURL = `https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=${apiKey}&lat=${data.city.coord.lat}&lon=${data.city.coord.lon}`

                        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.list[i].weather[0].icon}.svg`;
                        const markup = `
                  <div class="forecast5">${data.city.name}</div>
                  <div class="forecast5">${(data.list[i].dt_txt).split(' ')[0]}</div>
                  <div class="forecast5">${Math.round((data.list[i].main.temp * 1.80 + 32))}<sup>°F</sup></div>
                  <div class="forecast5">${data.list[i].wind.speed}<sup> Wind Speed</sup></div>
                  <div class="forecast5">${data.list[i].main.humidity}<sup>% Humidity</sup></div>
                  <div class="forecast5">${data.list[i].weather[0].description}</div>
                  <figure>
                  <img class="city-icon" src="${icon}" alt="${data.list[i].weather[0].description}">
                  <figcaption>${data.list[i].weather[0].description}</figcaption>
                </figure>`;
                        div.innerHTML = markup;
                        list2.prepend(div);
                    };
                };
            });
    };
    fiveDayForecast()

    //resets the form after you type in your city, so you can type in another quickly.
    form.reset();
});


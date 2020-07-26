/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

const apiKey = "4d8fb5b93d4af21d66a2948710284366";

form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;

    //check if there's already a city
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

        if (filteredArray.length > 0) {
            msg.textContent = `You already know the weather for ${
                filteredArray[0].querySelector(".city-name span").textContent
                } `;
            form.reset();
            input.focus();
            return;
        }
    }

    function getweather(data) {
        //ajax here
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {

                const { main, name, sys, weather, wind } = data;
                const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
                    weather[0]["icon"]
                    }.svg`;

                const li = document.createElement("li");
                li.classList.add("city");
                const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="date-div">${today}</div>
        <div class="city-temp">${Math.round((main.temp * 1.80 + 32))}<sup>°F</sup></div>
        <div class="wind-speed">${wind.speed}<sup> MPH Wind Speed</sup></div>
        <div class="wind-speed">${main.humidity}<sup> % Humidity</sup></div>
        <div class="wind-speed">${wind.speed}<sup> UV Rating</sup></div>

        <figure>
          <img class="city-icon" src="${icon}" alt="${
                    weather[0]["description"]


                    }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
                li.innerHTML = markup;
                list.appendChild(li);
            })
            .catch(() => {
                msg.textContent = "Please search for a valid city";
            });
    };

    getweather()

    function fiveDayForecast(data) {

        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputVal}&appid=${apiKey}&units=metric`
        fetch(url)
            .then(response => response.json())
            .then(data => {

                const { main, name, sys, weather, wind } = data;
                console.log("DATA: ", data);
                console.log("data.list[0].wind.speed: ", data.list[0].wind.speed);
                console.log("wind.speed: ", wind.speed);

                for (var i = 0; i <i<data.length;i+8) {
                    if (data.list[i].dt_txt.includes("12:00:00")) {
                        const li = document.createElement("li");
                        li.classList.add("5dayforecast");
        
                        const markup = `
                        <h2 class="city-name" data-name="${name},${sys.country}">
                          <span>${name}</span>
                          <sup>${sys.country}</sup>
                        </h2>
                        <div class="city-temp">${data.list[0].wind.speed}<sup>°F</sup></div>

                        <figure>
                          <img class="city-icon" src="${icon}" alt="${
                                    weather[0]["description"]
                
                
                                    }">
                          <figcaption>${weather[0]["description"]}</figcaption>
                        </figure>
                      `;
                                li.innerHTML = markup;
                                list.appendChild(li);
                        
                        //append the various html and information returned from the data object such as dataInfo.weather[0].description
                    };
                };
            });
        };

    
    


fiveDayForecast()

msg.textContent = "";
form.reset();
input.focus();
});

const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const list2 = document.querySelector(".ajax-section .weekforecast");
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;
const apiKey = "4d8fb5b93d4af21d66a2948710284366";
var uv; 

let cardDataArray = [];
const retrievedData = JSON.parse(localStorage.getItem('cardDataArray')) || [];
for (let i = 0; i < retrievedData.length; i++) {
    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        retrievedData[i].weather[0]["icon"]
                    }.svg`;
    const li = document.createElement("li");
                li.classList.add("city");
                const markup = `
        <h2 class="city-name" data-name="${retrievedData[i].name},${retrievedData[i].sys.country}">
          <span>${retrievedData[i].name}</span>
          <sup>${retrievedData[i].sys.country}</sup>
        </h2>
        <div class="date-div">${today}</div>
        <div class="city-temp">${Math.round((retrievedData[i].main.temp * 1.80 + 32))}<sup>°F</sup></div>
        <div class="wind-speed">${retrievedData[i].wind.speed}<sup> MPH Wind Speed</sup></div>
        <div class="wind-speed">${retrievedData[i].main.humidity}<sup> % Humidity</sup></div>
        <div class="wind-speed"><sup> UV Index</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
            retrievedData[i].weather[0]["description"]


                    }">
          <figcaption>${retrievedData[i].weather[0]["description"]}</figcaption>
        </figure>
      `;
                li.innerHTML = markup;
                list.prepend(li);
    cardDataArray.push(retrievedData[i])
}

//listener for button
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

        if (filteredArray.length > 0) {
            msg.textContent = `You already know the weather for ${
                filteredArray[0].querySelector(".city-name span").textContent
                } `;
            form.reset();
            input.focus();
            return;
        }
    }

    //current date api call 
    function getweather(data) {
       
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const { main, name, sys, weather, wind } = data;
                function uvindex(lat, lon) {
                    fetch("http://api.openweathermap.org/data/2.5/uvi?appid=4d8fb5b93d4af21d66a2948710284366&lat=" + lat + "&lon=" + lon)
                    .then(response => response.json())
                    .then(data => {console.log(data.value)
                        var uv = data.value;
                        console.log('your uv is ' + uv);
                    if (uv < 3){
                        console.log('mild');
                    } else if (uv <7 ){
                        console.log('normal');
                    } else {
                        console.log('dangerous')
                    }
                    return uv; 
                    })
                };
                uvindex(data.coord.lat, data.coord.lon);
                console.log(data); 
                console.log(uv);
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
        <div class="wind-speed">${uv}<sup> UV Index</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
                    weather[0]["description"]


                    }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
                li.innerHTML = markup;
                list.prepend(li);
                cardDataArray.push({ main, name, sys, weather, wind })
                localStorage.setItem('cardDataArray', JSON.stringify(cardDataArray))
       
            })
            .catch(() => {
                msg.textContent = "Please search for a valid city";
            });
    };
    getweather()

// weekly forecast api call
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
                        const uvURL =`https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=${apiKey}&lat=${data.city.coord.lat}&lon=${data.city.coord.lon}`
          
                        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.list[i].weather[0].icon}.svg`;
                        const markup = `
                  <div class="forecast5">${data.city.name}</div>
                  <div class="forecast5">${(data.list[i].dt_txt).split(' ')[0]}</div>
                  <div class="forecast5">${Math.round((data.list[i].main.temp * 1.80 + 32))}<sup>°F</sup></div>
                  <div class="forecast5">${data.list[i].wind.speed}<sup> Wind Speed</sup></div>
                  <div class="forecast5">${data.list[i].main.humidity}<sup>% Humidity</sup></div>
                  <div class="forecast5">${data.list[i].weather[0].description}</div>
                  <figure>
                  <img class="city-icon" src="${icon}" alt="${
                            data.list[i].weather[0].description


                            }">
                  <figcaption>${data.list[i].weather[0].description}</figcaption>
                </figure>
  
                      `;
                        div.innerHTML = markup;
                        list2.prepend(div);


                        };
                };
            });
    };
    fiveDayForecast()

    msg.textContent = "";
    form.reset();
    input.focus();
});



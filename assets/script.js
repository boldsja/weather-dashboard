var searchHistory = JSON.parse(localStorage.getItem('history')) ?? []
$(document).ready(function () {
    var searchBtn = $('#citySearch');
    var apiKey = "cf176a33f5b57077e7c0175e503848b7"

    searchHistory.reverse().forEach((item => {

    }))

    searchBtn.on("click", function (e) {
        e.preventDefault()
        var searchValue = $("#search").val()
        searchHistory.push(searchValue)
        localStorage.setItem("history", JSON.stringify(searchHistory))
        $("#currentWeather").empty()
        $("#fiveDayWeather").empty()
        getCurrentWeather(searchValue)
    })

    async function getCurrentWeather(searchValue) {
        var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${apiKey}&units=imperial`;
        console.log('requestUrl', requestUrl)
        let data = await (await fetch(requestUrl)).json()
        const coords = {
            lat: data.coord.lat,
            lon: data.coord.lon
        };

        const fiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=imperial`
        let data5Day = await (await fetch(fiveDayUrl)).json()

        console.log("data from api", data)

        let cityName = data.name;
        let temp = data.main.temp;
        let wind = data.wind.speed;
        let humiditiy = data.main.humidity;
        let uvi = data5Day.daily[0].uvi

        let card = $("<div class='card'>");
        let cardHeader = $("<div class='card-header'>");
        let cardBody = $("<div class='card-body'>");
        let currentIcon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        let tempEl = $("<p class='card-text'>").text("Temperature: " + temp)
        let windEl = $("<p class='card-text'>").text("Wind Speed: " + wind + " MPH")
        let humidEl = $("<p class='card-text'>").text("Humidity: " + humiditiy + "%")
        let nameEl = $("<p class='card-title'>").text(cityName)
        let bgColor = "green"
        if (uvi >= 6 && uvi <= 10) bgColor = "yellow"
        if (uvi >= 11) bgColor = "red"
        let uviEl = $("<p class='card-text'>")
            .text(`UV Index: ${uvi}`)
            .css({
                "color": bgColor,
                "background-color": "black"
            })
        cardHeader.append(nameEl);
        cardBody.append(tempEl, windEl, humidEl, currentIcon, uviEl)
        card.append(cardHeader, cardBody)
        $("#currentWeather").append(card)


        console.log("FIVEDAY DATA", data)

        data5Day.daily
            .slice(1, 6)
            .forEach((day) => {
                let temp = day.temp.day;
                let wind = day.wind_speed;
                let humiditiy = day.humidity;
                let date = new Date(day.dt * 1000)
                card = $("<div class='card'>");
                let cardHeader = $("<div class='card-header'>");
                let cardBody = $("<div class='card-body'>");
                let icon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`)
                let tempEl = $("<p class='card-text'>").text("Temperature: " + temp)
                let windEl = $("<p class='card-text'>").text("Wind Speed: " + wind + " MPH")
                let humidEl = $("<p class='card-text'>").text("Humidity: " + humiditiy + "%")
                let dayEl = $("<p class='card-text'>").text(date.toLocaleDateString())
                cardBody.append(tempEl, windEl, humidEl, dayEl, icon)
                card.append(cardBody)
                $("#fiveDayWeather").append(card)
            })

    }








})
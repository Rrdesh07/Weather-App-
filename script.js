const wrapper = document.querySelector(".wrapper");
let InputPart = wrapper.querySelector(".input-part");
let InfoText = InputPart.querySelector(".info-txt");
let InputField = InputPart.querySelector("input");
let ApiKey = "562f68236054263c80b2fe3bbeb12cf1";
let LocationBtn = InputPart.querySelector("button");
let wIcon = document.querySelector(".weather-part img");
let arrowBack = wrapper.querySelector("header i");
let api;

InputField.addEventListener("keyup", (e) => {
    // if user enter the button with non empty city value 
    if (e.key == "Enter" && InputField.value !="") {
        requestApi(InputField.value);
    }
});

LocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(OnSuccess, OnError);
    }
    else {
        alert("Your browser doesn't support geolocation api...");
    }
});

const OnSuccess = (position) => {
    console.log(position);
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${ApiKey}`;
    fetchData();
}

const OnError = (error) => {
    console.log(error);
}

const requestApi = (city) => {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${ApiKey}`;
    fetchData();  
};

const fetchData = () => {
    InfoText.innerText = "Getting weather details.........";
    InfoText.classList.add("pending");
    fetch(api).then((response) => {
        return response.json();
    }).then((result) => {
        weatherDetails(result);
    })
}
const weatherDetails = (info) => {
    InfoText.classList.replace("pending", "error");
    if (info.cod == "404") {
        InfoText.innerText = `${InputField.value} isn't a valid city`;
    }
    else {
        // lets get required properties
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        // lets fill it out all values
        wrapper.querySelector(".temp .numb").innerText =Math.floor(temp);
        wrapper.querySelector(".weather").innerText =description;
        wrapper.querySelector(".location span").innerText = `${city},${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText =`${humidity}`;

        // using custom icon according to the id which api return as 
        if (id == 800) {
            wIcon.src = "icons/clear.svg";
        }
        else if (id >= 200 && id <= 232) {
            wIcon.src = "icons/strom.svg";
        }
        else if (id >= 600 && id <= 622) {
            wIcon.src = "icons/snow.svg";
        } 
        else if (id >= 701 && id <= 781) {
            wIcon.src = "icons/storm.svg";
        }
        else if (id >= 801 && id <= 804) {
            wIcon.src = "icons/haze.svg";
        }
        else if( (id >= 300 && id <= 321) ||(id>=500 && id<=531)){
            wIcon.src = "icons/rain.svg";
        }

        InfoText.classList.remove("pending", "error");
        wrapper.classList.add("active");
        console.log(info);
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
})
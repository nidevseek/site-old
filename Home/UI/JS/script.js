function updateMoscowTime() {
  const now = new Date();
  const moscowTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
  const formattedTime = moscowTime.toLocaleTimeString('en-US', { hour12: true });
  const code = 'UTC +3'
  document.getElementById('current_time').textContent = formattedTime;
  document.getElementById('text_utc').textContent = code;
}

updateMoscowTime();
setInterval(updateMoscowTime, 1000);

function updateDate() {
const now = new Date();
const options = { day: 'numeric', month: 'long' };
const formattedDate = now.toLocaleDateString('en-US', options);
const year = now.getFullYear();

document.getElementById('current_date').textContent = formattedDate;
document.getElementById('text_date').textContent = year;
}

updateDate();

const cityId = '463343';
const apiKey = '58b6621bb195443d09b4ae5ad7b282f1';

function updateWeather() {
const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric&lang=en`;

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка при запросе данных: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    if (data && data.weather && data.weather[0]) {
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp.toFixed(1);

      document.getElementById('current_weather').textContent = weatherDescription;
      document.getElementById('text_deheree').textContent = `${temperature}°C`;
    } else {
      throw new Error('Нет данных о погоде');
    }
  })
  .catch(error => {
    console.error('Ошибка получения погоды:', error);
    document.getElementById('current_weather').textContent = 'loading...';
    document.getElementById('text_deheree').textContent = 'loading...';
  });
}

function openModal() {
  const modal = document.getElementById("weatherModal");
  modal.style.display = "block";

  const url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&units=metric&lang=en`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при запросе прогноза: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.list && data.list.length > 0) {
        let forecastHTML = '<ul>';
        for (let i = 0; i < 5; i++) {
          const forecast = data.list[i * 8];

          if (forecast) {
            const dateTime = new Date(forecast.dt * 1000).toLocaleString('en-US', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit'
            });
            const temp = forecast.main.temp.toFixed(1);
            const description = forecast.weather[0].description;

            forecastHTML += `<li><strong>${dateTime}</strong> ${description}, ${temp}°C</li>`;
          } else {
            forecastHTML += `<li>Данные для ${i + 1}-го дня недоступны</li>`;
          }
        }

        forecastHTML += '</ul>';
        document.getElementById('forecast').innerHTML = forecastHTML;
      } else {
        throw new Error('Нет данных прогноза');
      }
    })
    .catch(error => {
      console.error('Ошибка получения прогноза:', error);
      document.getElementById('forecast').innerHTML = 'Ошибка загрузки прогноза';
    });
}


function closeModal() {
const modal = document.getElementById("weatherModal");
modal.style.display = "none";
}

window.onclick = function(event) {
const modal = document.getElementById("weatherModal");
if (event.target == modal) {
  modal.style.display = "none";
}
}

updateWeather();
setInterval(updateWeather, 60000);


function toggleGiftOverlay() {
const overlay = document.getElementById('giftOverlay');
overlay.classList.toggle('active');
overlay.classList.toggle('hidden');
}

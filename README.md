# Simple Weather app

Made with Next.js with Typescript

## .env configuration

```.env
BASE_API=https://jsonplaceholder.typicode.com/api
KEY=APIKEYHERE
APICONFIG_EXCLUDE=minutely
APICONFIG_UNITS=metric
APICONFIG_LANG=en
```

- `BASE_API` api route to request

- `KEY` your api key

- `APICONFIG_EXCLUDE` Based on OpenWeatherMap api docs: part of the data you exclude

- `APICONFIG_UNITS` Based on OpenWeatherMap api docs: Units you want to receive

- `APICONFIG_LANG` Based on OpenWeatherMap api docs: Language you want to receive

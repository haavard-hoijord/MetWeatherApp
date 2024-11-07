# MetWeatherApp
 A internal practice project for making a full solution of backend and frontend for a weather app.

 The backend is made with C# using Asp.Net which uses the Met.no api to retrieve json and plain text data.
 
The frontend is made using React + Vite.js and uses the backend to retrieve the weather data, the frontend also uses google maps api for location search and reverse geocoding. The frontend is written in Typescript.

# Examples
Preview of the webapp
![Website preview](https://github.com/haavard-hoijord/MetWeatherApp/blob/main/examples/img.png?raw=true)
![Website preview](https://github.com/haavard-hoijord/MetWeatherApp/blob/main/examples/img2.png?raw=true)

[Swagger definition file](examples/swagger.json)

# Libraries
- Backend
  - Asp.Net
  - Newtonsoft.Json
  - Swashbuckle.AspNetCore
  

- Frontend
  - React
  - Vite.js
  - Axios
  - Google Maps API
    - Google Maps React (@vis.gl/react-google-maps)
    - Google Maps Geocoding
    - Google Maps Places
    - @googlemaps/extended-component-library
  - Material-UI
  - Typescript
  - Recharts
  - Styled-components
  - Sortablejs
  - react-sortablejs
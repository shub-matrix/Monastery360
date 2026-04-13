# Monastery360

Monastery360 is a digital heritage platform dedicated to showcasing the monasteries of Sikkim. This application provides users with immersive experiences through virtual tours, an interactive map, and a cultural calendar that highlights events and festivals related to the monasteries.

## Features

- **Virtual Tours**: Explore 360° panoramic views of monastery interiors and surroundings.
- **Interactive Map**: Navigate through a geo-tagged map of monasteries, integrated with Google Maps API.
- **Cultural Calendar**: Stay updated with a schedule of events, festivals, and rituals associated with the monasteries.

## Project Structure

```
monastery360
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── VirtualTour
│   │   │   └── VirtualTour.jsx
│   │   ├── InteractiveMap
│   │   │   └── InteractiveMap.jsx
│   │   ├── CulturalCalendar
│   │   │   └── CulturalCalendar.jsx
│   │   └── common
│   │       ├── Header.jsx
│   │       └── Footer.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   ├── Monasteries.jsx
│   │   └── About.jsx
│   ├── hooks
│   │   └── useMonasteryData.js
│   ├── services
│   │   └── api.js
│   ├── styles
│   │   └── global.css
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## Getting Started

To get started with the Monastery360 project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd monastery360
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000` to view the application.

 

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
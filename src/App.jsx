import React, { useEffect, useState } from "react";
import Snowfall from "react-snowfall";
import RainEffect from "./components/rainEffect";
import DesertEffect from "./components/desertEffect";

const App = () => {
  const ApiKey = "da5d9ee6369049959ae112934240508";
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("mumbai");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${ApiKey}&q=${city}&aqi=no`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Fetch error:", error.message); // Improved error logging
      }
    };

    fetchData();
  }, [city]);

  const handleChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleSubmit = () => {
    setCity(search);
    setSearch("");
  };

  const temperature = Math.ceil(data?.current?.temp_c);
  const condition = data?.current?.condition?.text?.toLowerCase() || "";

  const isRainy =
    condition.includes("patchy rain nearby") ||
    condition.includes("partly cloudy") ||
    condition.includes("thundery outbreaks in nearby");
  condition.includes("light rain shower");
  const isSnowy = condition.includes("fog");
  const isSunny = condition.includes("sunny");

  return (
    <div
      className={`relative h-screen w-full flex flex-col items-center ${
        temperature > 24 ? "bg-blue-300" : "bg-gray-900"
      } transition-all duration-500 ease-in-out overflow-hidden`}
    >
      <h1 className="text-[32px] sm:text-[62px] text-yellow-500 text-center z-10">
        Weather App
      </h1>
      <div className="flex flex-col items-center mt-10 z-10">
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 animate-fadeIn">
          <input
            type="text"
            placeholder="Enter a city"
            value={search}
            className="w-60 px-4 py-2 sm:px-10 sm:py-4 rounded-xl border-2 border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
            onChange={handleChange}
          />
          <button
            className="mt-4 sm:mt-0 px-8 py-2 sm:px-10 sm:py-4 text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-800 transform hover:scale-105 transition-all duration-300"
            onClick={handleSubmit}
          >
            Get
          </button>
        </div>
        {data && (
          <div className="w-full animate-fadeIn gap-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center bg-white rounded-xl shadow-2xl p-4 sm:p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-center border-b sm:border-r-2 sm:pr-6 mb-4 sm:mb-0">
                <h2 className="text-[32px] sm:text-[46px] font-bold text-indigo-600">
                  {data?.location?.name}
                </h2>
                <h3 className="text-gray-900 text-xl sm:text-3xl">
                  {data?.location?.country}
                </h3>
                <img
                  src={data?.current?.condition.icon}
                  className="h-24 sm:h-40 w-24 sm:w-40 mt-4"
                  alt={data?.current?.condition.text}
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl mt-6 text-indigo-600">
                  {temperature} &deg;
                </span>
                <span className="text-lg sm:text-2xl mt-2 text-gray-600">
                  {data?.current?.condition.text}
                </span>
                <span className="text-base sm:text-xl mt-2 text-gray-600">
                  Last update: {data?.current?.last_updated}
                </span>
                <span className="text-base sm:text-xl mt-2 text-gray-600">
                  Humidity: {data?.current?.humidity}%
                </span>
                <span className="text-base sm:text-xl mt-2 text-gray-600">
                  Wind Speed: {data?.current?.wind_kph} kph
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {isRainy && <RainEffect />}
      {isSnowy && (
        <>
          <Snowfall
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          />
        </>
      )}
      {isSunny && <DesertEffect />}
    </div>
  );
};

export default App;

import { useState } from "react";
import data from "./data.json";

const api = {
  getData: () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(data);
      }, 2000);
    }),
};

const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const getChartData = () => {
    setIsLoading(true);
    api
      .getData()
      .then((response) => setChartData(response))
      .finally(() => setIsLoading(false));
  };
  return { getChartData, isLoading, chartData };
};

export default useApi;

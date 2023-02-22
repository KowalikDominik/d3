import "./App.css";
import LineChart from "./LineChart";
import Button from "./Button";
import useApi from "./useApi";

function App() {
  const { getChartData, chartData, isLoading } = useApi();
  return (
    <div className="App">
      <Button
        onClick={getChartData}
        text="Load data to chart"
        loading={isLoading}
      />
      <LineChart data={chartData} />
    </div>
  );
}

export default App;

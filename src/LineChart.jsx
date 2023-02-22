import React, { useEffect, useState } from "react";

import * as d3 from "d3";
import Button from "./Button";

const MARGIN = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};
const DIMMESIONS = {
  width: 600,
  height: 600,
  margin: MARGIN,
};
const CHART_BACKGROUNDS = ["#cecece", "#76a260", "#878ae2", "#87c7e2"];

const LineChart = ({ data, dimensions = DIMMESIONS }) => {
  const svgRef = React.useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const [chartBg, setChartBg] = useState(CHART_BACKGROUNDS[0]);

  const changeBg = () => {
    const idx = CHART_BACKGROUNDS.findIndex((x) => x === chartBg);
    setChartBg(CHART_BACKGROUNDS?.[idx + 1] || CHART_BACKGROUNDS[0]);
  };
  
  useEffect(() => {
    if (!data?.length) {
      return;
    }
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x))
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.y;
        }),
      ])
      .range([height, 0]);
    // Create root container where we will append all other chart elements
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    // Add X grid lines with labels

    const xAxis = d3.axisBottom(xScale).tickSize(-height);
    svg.append("g").attr("transform", `translate(0,${+height} )`).call(xAxis);
    // Add Y grid lines with labels
    const yAxis = d3.axisLeft(yScale).tickSize(-width);
    svg.append("g").call(yAxis);

    // Draw the lines
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("d", (d) => line(d));
  }, [data, height, margin.bottom, margin.left, margin.top, width]); // Redraw chart if data changes

  return (
    <>
      <Button onClick={changeBg} text="Change chart background" />
      <svg
        ref={svgRef}
        width={svgWidth}
        height={svgHeight}
        style={{ background: chartBg }}
      />
    </>
  );
};

export default LineChart;

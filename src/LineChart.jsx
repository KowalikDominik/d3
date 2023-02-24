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
const INITIAL_BACKGROUND = CHART_BACKGROUNDS[0];

const NoDataMessage = ({ show }) => {
  return show ? (
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
      No data
    </text>
  ) : null;
};

const LineChart = ({ data, dimensions = DIMMESIONS }) => {
  const svgRef = React.useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const [chartBg, setChartBg] = useState(INITIAL_BACKGROUND);

  const changeBg = () => {
    const idx = CHART_BACKGROUNDS.findIndex((x) => x === chartBg);
    setChartBg(CHART_BACKGROUNDS?.[idx + 1] || INITIAL_BACKGROUND);
  };

  const isData = data?.length;

  useEffect(() => {
    if (!isData) {
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

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xAxis = d3.axisBottom(xScale).tickSize(-height);
    svg.append("g").attr("transform", `translate(0,${+height} )`).call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickSize(-width);
    svg.append("g").call(yAxis);

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

    const auxiliarylineX = svg.append("line").attr("stroke-width", 2);
    const auxiliarylineY = svg.append("line").attr("stroke-width", 2);

    const drawAuxiliaryLines = (point) => {
      const y = point.getAttribute("cy");
      const x = point.getAttribute("cx");
      auxiliarylineX
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "red");
      auxiliarylineY
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", x)
        .attr("y2", height)
        .attr("stroke", "red");
    };

    const removeAuxiliaryLines = () => {
      auxiliarylineY.attr("stroke", "transparent");
      auxiliarylineX.attr("stroke", "transparent");
    };

    svg
      .selectAll(".line-points")
      .data(data)
      .join("circle")
      .attr("r", "4")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .on("mouseenter", ({ target }) => drawAuxiliaryLines(target))
      .on("mouseleave", removeAuxiliaryLines);

    const handleZoom = (e) => {
      d3.select("svg g").attr("transform", e.transform);
    };

    const zoom = d3.zoom().on("zoom", handleZoom);

    svgEl.call(zoom);
  }, [data, height, isData, margin.bottom, margin.left, margin.top, width]);

  return (
    <>
      <Button onClick={changeBg} text="Change chart background" />
      <svg
        ref={svgRef}
        width={svgWidth}
        height={svgHeight}
        style={{ background: chartBg }}
      >
        <NoDataMessage show={!isData} />
      </svg>
    </>
  );
};

export default LineChart;

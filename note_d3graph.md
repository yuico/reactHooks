# D3 _ circle and line graph

##basic code

```js
import React, { useRef, useEffect, useState } from 'react';
import { select, line, curveCardinal } from 'd3';
import './App.css';

// const data = [13, 30, 40, 29, 20];

function App() {
  const [ data, setData ] = useState([13, 30, 40, 29, 20, 70, 40]);
  const svgRef = useRef();
  //console.log(svgRef);
  
  useEffect(() => {
    //console.log(svgRef);
    const svg = select(svgRef.current);  
    const myLine = line()
      .x((value, index) => index * 50)
      .y(value => 150 - value)
      .curve(curveCardinal);
    // svg.selectAll("circle").data(data).join("circle")
    //    .attr("r", value => value).attr("cx", value => value * 2).attr("cy", value => value * 2).attr("stroke", "red")
      svg
      .selectAll("path")
      .data([data])
      .join("path")
      .attr("d", value => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "blue")
  }, [data]);

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        {/* <path d="M0, 150 100, 100 150, 120" stroke="blue" fill="none" /> */}
      </svg>
      <br/>
      <button onClick={() => setData(data.map( value => value + 5 ))}>
        Update data
      </button>
      <button onClick={() => setData(data.filter( value => value <= 30 ))}>
        Filter data
      </button>
    </React.Fragment>
  );
}

export default App;

```

## How to add axis and scale


```js
import { select, line, curveCardinal, axisBottom, scaleLinear, axisRight } from 'd3';
```

```js
                                            
function App() {
  const [ data, setData ] = useState([13, 30, 40, 29, 20, 70, 40]);
  const svgRef = useRef();
  //console.log(svgRef);
  
  useEffect(() => {
    //console.log(svgRef);
    const svg = select(svgRef.current);  
    const xScale = scaleLinear()
      .domain([0, data.length-1])
      .range([0, 300]);

    const yScale = scaleLinear()
      .domain([0, 150])
      .range([150, 0]);

    //start xscale from 1 => tickFormat(index => index + 1)
    const xAxis = axisBottom(xScale).ticks(data.length).tickFormat(index => index + 1);
    svg
      .select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis);

    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", "translateX(300px)")
      .call(yAxis);

    //xAxis(svg.select(".x-axis"))

    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

      //the 'd' attr from line generator above
    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue")
  }, [data]);

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <br/>
      <button onClick={() => setData(data.map( value => value + 5 ))}>
        Update data
      </button>
      <button onClick={() => setData(data.filter( value => value <= 30 ))}>
        Filter data
      </button>
    </React.Fragment>
  );
}
```

## transition and bar charts


```js
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3';
```

```js
function App() {
  const [ data, setData ] = useState([13, 30, 80, 100, 60, 120, 150]);
  const svgRef = useRef();
  
  // wiil be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);  
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, 300])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, 150])
      .range([150, 0]);
      
    const colorScale = scaleLinear()
      .domain([45, 100, 150])
      .range(["green", "orange", "red"]);

    const xAxis = axisBottom(xScale).ticks(data.length).tickFormat(index => index + 1);
    svg
      .select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis);

    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", "translateX(300px)")
      .call(yAxis);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -150)
      //-150
      .attr("width", xScale.bandwidth())
      .transition()
      .attr("fill", colorScale)
      .attr("height", value => 150 - yScale(value));
  }, [data]);

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <br/>
      <button onClick={() => setData(data.map( value => value + 5 ))}>
        Update data
      </button>
      <br/>
      <button onClick={() => setData(data.filter( value => value <= 30 ))}>
        Filter data
      </button>
    </React.Fragment>
  );
}
```
 ## Interactivity (adding numerical value of each bar)   
 
 ```js
 ...
 function App() {
  const [ data, setData ] = useState([13, 30, 80, 100, 60, 120, 150]);
  const svgRef = useRef();
  
  // wiil be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current); 

    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, 300])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, 150])
      .range([150, 0]);
      
    const colorScale = scaleLinear()
      .domain([45, 100, 150])
      .range(["green", "orange", "red"])
      .clamp(true);

    const xAxis = axisBottom(xScale).ticks(data.length);
    svg
      .select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis);

    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", "translateX(300px)")
      .call(yAxis);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -150)
      //-150
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (value, index) => {
        svg
          .selectAll(".tooltip")
          .data([value])
          .join(enter => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth()/2)
          .transition()
          .attr("y", yScale(value)-8) 
          .attr("text-anchor", "middle")
          //put text in the middle of left-edge of bar 
          .attr("opacity", 1);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", value => 150 - yScale(value));
  }, [data]);
...
 ```

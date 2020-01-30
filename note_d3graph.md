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
    // svg
    //   .selectAll("circle")
    //   .data(data)
    //   .join("circle")
    //   .attr("r", value => value)
    //   .attr("cx", value => value * 2)
    //   .attr("cy", value => value * 2)
    //   .attr("stroke", "red")
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

##import
```js
import { select, line, curveCardinal, axisBottom, scaleLinear, axisRight } from 'd3';
```

###code
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

export default App;
```

## D3 _ circle and line graph

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

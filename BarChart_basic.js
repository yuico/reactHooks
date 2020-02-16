import React, { useRef, useEffect, useState } from 'react';
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3';
import ResizeObserver from 'resize-observer-polyfill'; // for supporting Internet Explorer 8 and earlier versions

const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
       const observeTarget = ref.current; 
       const resizeObserver = new ResizeObserver((entries) => {
           //console.log(entries);
           //set resized dimensions  
           entries.forEach(entry => {
               setDimensions(entry.contentRect);
           })    
       });  
       resizeObserver.observe(observeTarget);
       return () => {
           resizeObserver.unobserve(observeTarget);
       };                                 
    }, [ref]);

    return dimensions;
}


function BarChart({data}) {
    
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
  
    // wiil be called initially and on every data change
    useEffect(() => {
        const svg = select(svgRef.current); 
        console.log(dimensions);

        if(!dimensions) return;
        
        // scales
        const xScale = scaleBand()
        .domain(data.map((value, index) => index))
        .range([0, dimensions.width]) // change for responsive width
        .padding(0.5);

        const yScale = scaleLinear()
        .domain([0, 150]) // todo
        .range([dimensions.height, 0]); // change
        
        const colorScale = scaleLinear()
        .domain([45, 100, 150])
        .range(["green", "orange", "red"])
        .clamp(true);

        // create x-axis
        const xAxis = axisBottom(xScale).ticks(data.length);
        svg
        .select(".x-axis")
        .style("transform", `translateY(${dimensions.height}px)`)
        .call(xAxis);

        // create y-axis
        const yAxis = axisRight(yScale);
        svg
        .select(".y-axis")
        .style("transform", `translateX(${dimensions.width}px)`)
        .call(yAxis);

        // draw the bars
        svg
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        
        .style("transform", "scale(1, -1)")
        .attr("x", (value, index) => xScale(index))
        .attr("y", -dimensions.height)
        //-150 => -dimensions.height
        .attr("width", xScale.bandwidth())
        .on("mouseenter", (value, index) => {
            svg
            .selectAll(".tooltip")
            .data([value])
            .join(enter => enter.append("text").attr("y", yScale(value)-4))
            .attr("class", "tooltip")
            .text(value)
            .attr("x", xScale(index) + xScale.bandwidth() / 2)
            .transition()
            .attr("y", yScale(value)-8) 
            .attr("text-anchor", "middle")
            //put text in the middle of left-edge of bar 
            .attr("opacity", 1);
        })
        .on("mouseleave", () => svg.select(".tooltip").remove())
        .transition()
        .attr("fill", colorScale)
        .attr("height", value => dimensions.height - yScale(value));
        // 150 => dimensions.height
    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
        
    );
}

export default BarChart; 

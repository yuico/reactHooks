import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import useResizeObserver from './useResizeObserver';
import moment from 'moment';
import momentbd from 'moment-business-days';

var version = [
  { version: 'R1A-dev', id: 10301, date: 'Sep 15 2021' },
  { version: 'R1A', id: 10301, date: 'Feb 15 2022'}
];

function Barcharthorizontal({data}) {

    // console.log(version);

    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const _color = ['#35495e','#347474', '#63b7af', 'red', 'blue'];
                                                                                   
    useEffect(() => {

        const svg = d3.select(svgRef.current);
        const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

        if(!dimensions) return;

        const stack = d3.stack()
            .keys(['R1', 'R2', 'R3'])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        const _series = stack(data);
        //console.log(_series);

        

        //x scale
        const x = d3.scaleLinear()                 
            //.domain(extend)
            .domain([0, 100])
            .range([0, width]);

        const xAxis = d3.axisBottom(x).ticks(width/100);

        svg
            .select('.x-axis')
            .attr("transform", `translate(0, ${height})`)
            .attr('opacity', 0)
            .call(xAxis);       

        //yscale
        const y = d3.scaleBand()
            .domain(data.map(d => d.Short_Name))
            .range([height, 0])
            .padding(0.3);

        const yAxis = d3.axisLeft(y);

        svg
            .select('.y-axis')
            .attr('transform', `-translate(${width}, 0)`)
            .style('font', '0.8rem arial')
            .call(yAxis);

        

        //grid line

        //extends the width-lang to longest one
        // const extend = [0, 
        //     d3.max(_series, e => d3.max(e, seq => seq[1]))
        // ];
        // console.log(_series);
        // console.log(extend);

        //**calculate dates**

        //year of maxdate
        // const maxDate = d3.max(ver, d=>d.date.split(' ').slice(-1));
        // console.log(maxDate);

        // const convertDate = new Date(ver[1].date.replace(',', ''));
        // console.log(convertDate);
        
        const maxLeng = Math.max(data.map(d => d.R1+d.R2+d.R3));  
        //const minLeng = Math.min(data.map(d => d.R1+d.R2+d.R3));
        const addOneMonth = 
            moment(version[1].date).add(1, 'M').calendar();
        // const addOneMonth = 
        //     Math.max(calDataToPercent) > maxLeng ? 
        //         moment(version[1].date).add(1, 'M').calendar() : 
        //         moment();
        //console.log(ver);
        console.log(addOneMonth);

         //tips : math.floor(num) === ~~num

         const calDateToPercent = version.map( d => (moment(d.date).diff(moment(new Date()), 'days')) * 100 / (moment(addOneMonth).diff(moment(new Date()), 'days')));
         const calWorkDaysToPercent = version.map( d => (moment(d.date).businessDiff(moment(new Date())) * 100 / (moment(addOneMonth).businessDiff(moment(new Date())))));

         console.log(`compare days: calDatePercent_${calDateToPercent}, calWorkDaysToPercent_${calWorkDaysToPercent}`);
                    
         const calWorkDays = version.map(d => moment(d.date).businessDiff(moment(new Date())));
         const calRegularDays = version.map(d => (moment(d.date).diff(moment(new Date()), 'days')));
         console.log(`${calWorkDays}, ${calRegularDays}`);
        
        //date cal end!

        const dateFormat = 
            (width < 800) ? d3.timeMonth.every(2): d3.timeMonth.every(1);

        //add month
        const xGridMon = d3.axisBottom (
                d3.scaleTime()
                // .domain([moment(new Date()), new Date(maxDate, 0, 1)])
                .domain([moment(new Date()), //from today
                    moment(addOneMonth)]) //till releaseDate+3months
                .range([0, width])
            ).tickSize(height).ticks(dateFormat)
                .tickFormat(d3.timeFormat('%b'));
        
        svg.selectAll('.xGrid')                                               
            .attr('class', 'xGrid')
            .call(xGridMon);
            

        //add year
        const xGridYear = d3.axisBottom (
            d3.scaleTime()
            // .domain([moment(new Date()), new Date(maxDate, 0, 1)])
            .domain([moment(new Date()), //from today
                moment(addOneMonth)]) //till releaseDate+3months
            .range([0, width])
        ).tickSize(height).ticks(d3.timeMonth.every(12))
            .tickFormat(d3.timeFormat('%Y'));
    
        svg.selectAll('.xGridYear')                                               
            .attr('class', 'xGridYear')
            .call(xGridYear)
            .selectAll('text')    
                .attr("dy", "2em");


        //fixed-devDate and fixed-relDate line
       
 
        svg.select('.devDate')
            .attr('x1', width*calDateToPercent[0]*0.01 )
            .attr('x2', width*calDateToPercent[0]*0.01 )
            .attr('y1', height)
            .attr('y2', 0)
            .attr('stroke', 'red');

        svg.select('.reDate')
            .attr('x1', width*calDateToPercent[1]*0.01 )
            .attr('x2', width*calDateToPercent[1]*0.01 )
            .attr('y1', height)
            .attr('y2', 0)
            .attr('stroke', 'blue');

        //draw bars
        svg.selectAll('.bars')
            .data(_series)
            .join('g')
            // .style('z-index', '-10')
            .attr('transform', `translate(0, 0)`)
            .attr('class', 'bars')
                .attr('fill', (d, i) => _color[i])      
            .selectAll('rect')
            .data( d => d )
            .join('rect')//.enter().append('rect)
                .attr('y', d => y(d.data.Short_Name))
                .attr('height', y.bandwidth())
                .attr('x', d => x(d[0]))
                .transition()
                .duration(400)
                .attr('opacity', 1)                  
                .attr('width', d => x(d[1])-x(d[0]));
    

    }, [data, dimensions]);

    return (
        <React.Fragment>        
            <h3 className='gHeader' style={{color:_color[0]}}>Consolidated JIRA Team Release</h3>
            <h4>Total: {data.length} teams</h4>
            <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>    
            <svg ref={svgRef}>
                <line className='devDate' strokeWidth='1.9'/>
                <line className='reDate' strokeWidth='1.9'/>
                <g className='x-axis' />
                <g className='y-axis' />
                <g className='xGrid' strokeOpacity='0.2'/>
                <g className='xGridYear' strokeOpacity='0'/>
                <g className='bars' />
                
            </svg> 
            </div>
            <div className='labelSet'>
                <div className='label' style={{backgroundColor:_color[0]}} /><p>R1</p>
                <div className='label' style={{backgroundColor:_color[1]}} /><p>R2</p>
                <div className='label' style={{backgroundColor:_color[2]}} /><p>R3</p>
                <div className='labelLine' style={{backgroundColor:_color[3]}}/><p>Code Freege Date</p>
                <div className='labelLine' style={{backgroundColor:_color[4]}}/><p>Release Date</p>
            </div>
        </React.Fragment>
    );
}


export default Barcharthorizontal;
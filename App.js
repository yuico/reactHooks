import React, { useState, useEffect } from 'react';
import './App.css';
import * as d3 from 'd3';
import NavBar from './pages/NavBar';    
import Barcharthorizontal from './pages/BarChart_horizontal';   
import datas from './datas/data.csv';
import versions from './datas/ver.csv';
import moment from 'moment';
import JiraClient from 'jira-connector';
// import RfileOne from './datas/Cities.csv';


// const data =[
//   {key: 'CDTNFR', name:'CDT-CST Architecture', compDate: 50, dDate: 40, devDate: 'Jun 08 2019', relDate: 'Jun 15 2021'},
//   {key: 'CDTCTR', name:'CST Training Readiness', compDate: 60, dDate: 30, devDate: 'Jun 15 2019', relDate: 'Mar 15 2021'},
//   {key: 'CDTBDVI', name:'BST-DIL V3 Interfaces', compDate: 50, dDate: 30, devDate: 'Jun 15 2019', relDate: 'Mar 15 2021'},
//   {key: 'CDTAHWV', name:'Aff-NetFix HD', compDate: 30, dDate: 40, devDate: 'Jun 15 2019', relDate: 'Mar 15 2021'},
//   {key: 'CDTCMM', name:'CST-Member Messaging', compDate: 16, dDate: 70, devDate: 'Jun 15 2019', relDate: 'Mar 15 2021'}
// ];

// const version = [
//   { version: 'R1A-dev', id: 10301, date: 'Sep 15 2021' },
//   { version: 'R1A', id: 10301, date: 'Feb 15 2022'}
// ];

const App = () => {
  const [ data, setData ] = useState([]);
  const [ version, setVersion ] = useState([]);

  useEffect(() => {
    d3.csv(datas).then(data => {
        data.forEach( d => {
          d.R1 = +d.R1;
          d.R2 = +d.R2;
          d.R3 = +d.R3;
        });
        setData(data);
    });
  },[]);

  // console.log(data);
  
  useEffect(() => {
    d3.csv(versions).then(version => {
        version.forEach( d => {
          d.id = +d.id;
          d.date = moment(d.date).format('MMM DD YYYY');
          console.log(d.date);   
        });
        setVersion(version);
    });
  },[]);


  // console.log(d3.csv(versions));

  return (
    <div>
      <NavBar/>
      <div className="chart">      
        <Barcharthorizontal data={data} version={version}/>
       </div>
    </div>

  );
}

export default App;

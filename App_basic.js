import React, { useState } from 'react';
import BarChart from "./BarChart"
import './App.css';

// const data = [13, 30, 40, 29, 20];

function App() {
  const [ data, setData ] = useState([13, 30, 80, 100, 60, 120, 150]);
  
  return (
    <React.Fragment>
      <BarChart data={data} />
      <button onClick={() => setData(data.map( value => value + 5 ))}>
        Update data
      </button>
      <button onClick={() => setData(data.filter( value => value <= 30 ))}>
        Filter data
      </button>
      <button onClick={() => setData([...data, Math.round(Math.random() * 100)])}>
        Add data
      </button>
    </React.Fragment>
  );
}

export default App;

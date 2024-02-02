import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExcelReader from './excelReader'; 
import Index from './indexScreen';
import Item from './ItemScreen';
import Help from './HelpScreen';

function App() {
  const [index, setIndex] = useState(null);
  const [sheets, setSheets] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const excelReader = new ExcelReader();

  useEffect(() => {
      const fetchData = async () => {
      await excelReader.fetchExcelData();
      setSheets(excelReader.getSheets());
      setIndex(excelReader.getIndex());
      setDataLoaded(true);
    };
    fetchData();
  }, []);

  if (!dataLoaded) {
    return (
      <div>
        <h1>Aun no se carga!</h1>
      </div>
    )
  }


  return (
    <Router>
      <Routes>
          <Route path="/" element={<Index indexOptions={index} />}>
          </Route>
          <Route path="/:category/:name" element={<Item itemsList={sheets}/>}>
          </Route>
          <Route path='/ayuda' element={<Help helpTables={sheets['Interpretación']}/>}></Route>
        </Routes>
    </Router>
  );
}

export default App;

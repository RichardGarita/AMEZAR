import React from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';

// Constants for percentage and weight units
const percentages = ['N', 'P', 'Ca', 'Mg', 'K', 'S'];
const weigth = ['Fe', 'Cu', 'Zn', 'Mn', 'B', 'Mo'];

// Reusable component for rendering a table row
function TableRow({ rowData, rowIndex, name, unit }) {
  return (
    <tr className='table-row' key={`${name} - ${rowIndex}`}>
      <td>{unit[rowIndex+1]}</td>
      {rowData.map((cellData, cellIndex) => (
        <td key={`${name} - ${rowIndex} - ${cellIndex}`}>{cellData}</td>
      ))}
    </tr>
  );
}

// Function to find a table in the list of items
function findTable(itemsList, categoryName, tableName) {

  if (itemsList[categoryName]) {
    const categorySection = itemsList[categoryName];
    const tables = categorySection.tables;

    for (let i = 0; i < tables.length; i++) {
      if (tables[i].tableName.toLowerCase() === tableName.toLowerCase()) {
        return tables[i];
      }
    }
  }

  return null;
}

// Main Item component
function Item ({itemsList}) {
    const navigate = useNavigate();
    const { category, name } = useParams();

    window.scrollTo(0, 0);

    const table = findTable(itemsList, category, name);

    // Function to dynamically render table rows
    const renderTableRows = (start, end, unit) => (
      table.tableRows.slice(start, end).map((tableRow, tableRowIndex) => (
        <TableRow
          key={`${name} - ${tableRowIndex}`}
          rowData={tableRow}
          rowIndex={tableRowIndex}
          name={name}
          unit={unit}
        />
      ))
    );

    return (
        <div >
            <nav className="item-nav">
              <img className="back-icon" src='../backIcon.png' alt="Atrás" onClick={() => navigate(-1)}></img>
              <h3 className="item-name">{category} - {name}</h3>
              <Link to={'/ayuda'} className='help-link'><img className='help-icon' src='../helpIcon.png'></img></Link> 
            </nav>
            {table ? 
            <div key={name} className="item-content">
                <h3 className="item-header">{name}</h3>
                <table  className="item-table" key={`${category} - ${name}`}>
                  <tbody>
                    <tr className='table-row' key={`${name} - 0`}>
                      <td className="table-header" colSpan={3}>Época de muestreo</td>
                      {table.tableRows[0].map((cellData, cellIndex) => {
                        return <td key={`${name} - 0 - ${cellIndex}`}>{cellData}</td>
                      })}
                    </tr>
                    <tr className='table-row' key={`${name} - 1`}>
                      <td className="table-header" colSpan={3}>Parte de la planta</td>
                      {table.tableRows[1].map((cellData, cellIndex) => {
                        return <td key={`${name} - 1 - ${cellIndex}`}>{cellData}</td>
                      })}
                    </tr>
                    <tr className='table-row' key={`${name} - 2`}>
                      <td className="table-header" colSpan={3}>Cantidad</td>
                      {table.tableRows[2].map((cellData, cellIndex) => {
                        return <td key={`${name} - 2 - ${cellIndex}`}>{cellData}</td>
                      })}
                    </tr>
                    <tr className='table-row' key={`${name} - 3`}>
                      <td className="table-header" rowSpan={12}>Contenido óptimo de nutrientes </td>
                      <td className="table-header" rowSpan={6}>Porcentaje (%)</td>
                      <td>{percentages[0]}</td>
                      {table.tableRows[3].map((cellData, cellIndex) => {
                        return <td key={`${name} - 3 - ${cellIndex}`}>{cellData}</td>
                      })}
                    </tr>
                    
                    {renderTableRows(4, 9, percentages)}
                    <tr className='table-row' key={`${name} - 9`}>
                      <td className="table-header" rowSpan={6}>mg/kg</td>
                      <td>{weigth[0]}</td>
                      {table.tableRows[9].map((cellData, cellIndex) => {
                        return <td key={`${name} - 9 - ${cellIndex}`}>{cellData}</td>
                      })}
                    </tr>
                    {renderTableRows(10, 15, weigth)}
                    <tr className='table-row' key={`${name} - 4`}>
                      <td className="table-header" colSpan={3}>Referencia</td>
                      {table.tableRows[15].map((cellData, cellIndex) => {
                        return <td key={`${name} - ${cellIndex}`}>{cellData}</td>
                      })}
                    </tr>
                  </tbody>
                </table>
            </div>
            :
            <h3>No se encontro {name}</h3>
            }
        </div>
    )
}

export default Item;
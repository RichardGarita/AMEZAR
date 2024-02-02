import React from "react";
import { useNavigate } from "react-router-dom";

const headers = [<tr className='table-row table-help-row'>
    <td colSpan={3}></td>
    <td></td>
    <td colSpan={6}>masa</td>
    <td colSpan={5}>mg</td>
</tr>,
<tr className='table-row table-help-row'>
    <td colSpan={4}>Solución Extractora:</td>
    <td>ph</td>
    <td colSpan={5}>cmol(+)/L</td>
    <td>%</td>
    <td colSpan={5}>mg/L</td>
    <td>mS/cm</td>
</tr>]

function Help({helpTables}){
    const navigate = useNavigate();
    const helpData = helpTables;
    return (
        <div>
            <nav className="item-nav">
              <img className="back-icon" src='../backIcon.png' alt="Atrás" onClick={() => navigate(-1)}></img>
              <h3 className="item-name">Interpretación</h3>
            </nav>
            {helpData ?
                <div key={'help'} className="item-content">
                    <h2 className="item-header">Interpretación</h2>
                    {helpData.tables.map((helpTable, helpTableIndex) => {
                        const tableData = helpTable.tableRows.slice(helpTableIndex !== 2 ? 1 : 0).map((tableRow, tableRowIndex) => {
                            return <tr className='table-row table-help-row' key={`help - ${tableRowIndex}`}>
                                {tableRow.map((cellData, cellIndex) => {
                                    return <td key={`help - ${tableRowIndex} - ${cellIndex}`}>{cellData}</td>
                                })}
                            </tr>
                        })
                        return <div key={`help - section - ${helpTable.tableName}`}>
                            <h3 className="item-header">{helpTable.tableName}</h3>
                            <table className="item-table table-help" key={`help - ${helpTable.tableName}`}>
                                <tbody>
                                    {helpTableIndex !== 2 ?
                                            headers[helpTableIndex]
                                        :
                                        <></>
                                    }
                                    {tableData}
                                </tbody>
                            </table>
                        </div>
                    })}
                </div>
                : <h3 style={{marginTop: '5em'}}>No Hay Ayuda</h3>

            }
        </div>
    )
}

export default Help;
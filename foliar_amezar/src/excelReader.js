import React, { Component } from 'react';
import * as XLSX from 'xlsx';

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: {},
      sheets: {},
    };
  }

  getSheets() {
    return this.state.sheets;
  }

  getIndex() {
    return this.state.index;
  }

  setSheets(newSheets) {
    this.state.sheets = newSheets;
  }

  setIndex(newIndex) {
    this.state.index = newIndex;
  }

  /**
   * Busca y devuelve una tabla específica dentro de las hojas cargadas.
   * @param {string} sheetName - El nombre de la hoja en la que buscar la tabla.
   * @param {string} tableName - El nombre de la tabla que se está buscando.
   * @returns {Object|null} - La tabla encontrada o null si no se encuentra.
   */
  findTable(sheetName, tableName) {
    const sheets = this.getSheets();

    if (sheets.hasOwnProperty(sheetName)) {
      const sheet = sheets[sheetName];
      const tables = sheet.tables;

      for (let i = 0; i < tables.length; i++) {
        if (tables[i].tableName === tableName) {
          return tables[i];
        }
      }
    }

    return null; // Devuelve null si la hoja o la tabla no se encuentran
  }

  formatTable(table) {
    var maxLength = 0;

    // Delete the empty cells at the end
    const trimmedTable = table.slice(1).map((tableRow) => {
      const trimmedRow = this.removeTrailingEmptyCells(tableRow);
      // Get the max length of the table
      if(trimmedRow.length > maxLength)
        maxLength = trimmedRow.length;
      return trimmedRow;
    })

    return this.equalizeRows(trimmedTable, maxLength);
  }

  equalizeRows(table, maxLength) {
    const equalizedTable = table.map((tableRow) => {
      // All the rows get the same lenth
      if (tableRow.length < maxLength) {
        for (var col = tableRow.length; col < maxLength; col++) {
          // An empty data
          tableRow.push('');
        }
      }
      return tableRow;
    });
  
    return equalizedTable;
  }
  

  removeTrailingEmptyCells(row) {
    const entries = Object.entries(row);
    let endIndex = entries.length - 2;

    // Remove the empty cells from the end to the start
    while (endIndex >= 0 && !entries[endIndex][1]) {
      endIndex--;
    }

    return entries.slice(0, endIndex + 1);
  }

  async fetchExcelData() {
    try {
      const response = await fetch('foliarData.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array', raw: true });
  
      const sheetComponents = {};
  
      workbook.SheetNames.forEach((sheetName, sheetIndex) => {

        // Extract data from the current sheet
        const sheetData = this.readSheetData(workbook, sheetName);

        if (sheetIndex < 1) {
          this.setIndex(sheetData.slice(1).map((row) => {
            return {
              name: row[0],
              category: row[1],
            };
          }))
          return;
        }

        // Create table components based on the extracted sheet data
        const tableComponents = this.createTableComponents(sheetData, sheetIndex);
        // Store the sheet data and table components in the sheetComponents object
        sheetComponents[sheetName] = { sheetData, tables: tableComponents };
      });
  
      this.setSheets(sheetComponents);
    } catch (error) {
      console.error('Error al cargar el archivo Excel', error);
    }
  }
  
  readSheetData(workbook, sheetName) {
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: null,
      raw: true,
      header: 1,
    });
  }

  /**
   * Processes sheet data and extracts table components based on specified end markers.
   * Each table is identified by the presence of an end marker in the sheet data.
   * The method iterates through the sheet data and creates table components accordingly.
   * @param {Array} sheetData - The data extracted from a sheet in the Excel workbook.
   * @param {string} sheetName - The name of the current sheet being processed.
   * @returns {Array} - An array of table components extracted from the sheet data.
  */
  createTableComponents(sheetData, sheetIndex) {
    const tableComponents = [];
    let currentTable = [];
  
    sheetData.forEach((rowData) => {
      // Check if the row contains an end marker (case-insensitive)
      const isEndMarker = Object.values(rowData).some(
        (cell) => typeof cell === 'string' && cell.toUpperCase().includes('FINALIZADA')
      );
  
      // If an end marker is found and there are rows in the current table, create a table component
      if (isEndMarker && currentTable.length > 0) {
        tableComponents.push(this.createTableComponent(currentTable, sheetIndex));
        currentTable = [];
      } else {
        // If no end marker, add the row (with added header property) to the current table
        currentTable.push({ ...rowData, header: rowData[0] });
      }
    });
  
    // If there are remaining rows in the current table, create a table component for it
    if (currentTable.length > 0) {
      tableComponents.push(this.createTableComponent(currentTable));
    }
  
    return tableComponents;
  }
  
  /**
   * Creates a table component from the provided table data and sheet name.
   * Formats the table data, generates table rows, and encapsulates them in a JSX structure.
   * @param {Array} table - The data representing a table extracted from the sheet.
   * @param {string} sheetName - The name of the sheet from which the table data is extracted.
   * @returns {Object} - An object representing the table component with its name and JSX structure.
  */
  createTableComponent(table, sheetIndex) {
    // Format the raw table data to ensure consistent row lengths
    const formatedTable = this.formatTable(table);
    const tableRows = formatedTable.map((tableRow) => {
      // Map each cell in the row to a cellData array, excluding the 'header' cell
      const cells = tableRow.slice(sheetIndex !== 1 ? 3 : 0).map(([cellKey, cellData]) => {
        if (cellKey !== 'header') {
          return cellData;
        }
        return null;
      });
  
      return cells;
    });
  
    return {
      tableName: table[0]?.header,
      tableRows: tableRows,
    };
  }
  
}

export default ExcelReader;

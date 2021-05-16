import { Injectable } from '@angular/core';
import { ParsedCsv } from '../model/parsed-csv.model';

@Injectable()
export class FormatConvertService {
  constructor() {}

  parseCsv(csvData: string): ParsedCsv {
    let parsedCsv: ParsedCsv = { name: '', headerRow: [], contentRows: []  };

    const csvByLine: string[] = csvData.split('\n');

    parsedCsv.contentRows = csvByLine.map(row => row.split(','));

    return parsedCsv;
  }

  normalizeCsvHeaders(
    parsedCsvRows: string[][],
    isFirstRowHeaders = false
  ): ParsedCsv {
    let parsedCsv: ParsedCsv = { name: '', headerRow: [], contentRows: []  };
    const longestRowLength = this.getLongestRowLength(parsedCsvRows);    
    if (isFirstRowHeaders && parsedCsvRows.length > 0) {
      parsedCsv.headerRow = parsedCsvRows[0];      
      parsedCsvRows = parsedCsvRows.slice(1, parsedCsvRows.length);
    }

    if (longestRowLength > parsedCsv.headerRow.length) {
      parsedCsv.headerRow = parsedCsv.headerRow.concat(
        new Array(longestRowLength - parsedCsv.headerRow.length).fill('noName')
      );      
    }
    console.log('Header Row', parsedCsv.headerRow);

    parsedCsv.contentRows = parsedCsvRows;

    return parsedCsv;
  }

  getLongestRowLength(row: string[][]): number {
    return row.reduce(
      (accumulator, currentItem) =>
        accumulator < currentItem.length ? currentItem.length : accumulator,
      0
    );
  }

  csvToJson(parsedCsv: ParsedCsv): string {

    const jsonData = parsedCsv.contentRows      
      .reduce(
        (jsonArrayAccumulator, currentRow) => {
          const jsonRow = currentRow.reduce(
            (rowAccumulator, currentCellValue, currentCellIndex) => {
              const propertyName = !!parsedCsv.headerRow[currentCellIndex].length
                ? parsedCsv.headerRow[currentCellIndex]
                : `${currentCellIndex}-column-no-name`;
              rowAccumulator[propertyName] = currentCellValue;
              return rowAccumulator;
            },
            {}
          );
          jsonArrayAccumulator.push(jsonRow);
          return jsonArrayAccumulator;
        },
        [{}]
      ).slice(1);

    return JSON.stringify(jsonData);
  }
}

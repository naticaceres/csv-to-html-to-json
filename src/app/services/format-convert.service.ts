import { Injectable } from '@angular/core';
import { ParsedCsv } from '../model/parsed-csv.model';

@Injectable()
export class FormatConvertService {
  constructor() {}

  parseCsv(csvData: string): ParsedCsv {
    let parsedCsv: ParsedCsv = { name: '', contentRows: [] };

    const csvByLine: string[] = csvData.split('\n');

    parsedCsv.contentRows = csvByLine.map(row => row.split(','));

    return parsedCsv;
  }

  normalizeCsvHeaders(
    parsedCsvRows: string[][],
    isFirstRowHeaders = false
  ): string[][] {
    const longestRowLength = this.getLongestRowLength(parsedCsvRows);
    let headersRow = [];

    if (isFirstRowHeaders) {
      headersRow = parsedCsvRows.pop();
    }

    if (longestRowLength > headersRow.length) {
      headersRow = headersRow.concat(
        new Array(longestRowLength - headersRow.length).fill('')
      );
    }

    parsedCsvRows.unshift(headersRow);
    return parsedCsvRows;
  }

  getLongestRowLength(row: string[][]): number {
    return row.reduce(
      (accumulator, currentItem) =>
        accumulator < currentItem.length ? currentItem.length : accumulator,
      0
    );
  }

  csvToJson(contentRows: string[][]): string {
    const headersRow = contentRows[0];

    const jsonData = contentRows
      .slice(1)
      .reduce(
        (jsonArrayAccumulator, currentRow) => {
          const jsonRow = currentRow.reduce(
            (rowAccumulator, currentCellValue, currentCellIndex) => {
              const propertyName = !!headersRow[currentCellIndex].length
                ? headersRow[currentCellIndex]
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
      )
      .slice(1);

    return JSON.stringify(jsonData);
  }
}

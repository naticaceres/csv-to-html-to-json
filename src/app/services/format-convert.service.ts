import { Injectable } from '@angular/core';
import { ParsedCsv } from '../model/parsed-csv.model';

@Injectable()
export class FormatConvertService {
  constructor() {}

  parseCsv(csvData: string): ParsedCsv {
    let parsedCsv: ParsedCsv = {
      name: '',
      headerRow: [],
      contentRows: [],
    };

    // Convert data into string area looking for new lines
    const csvByLine: string[] = csvData.split('\n');

    // Loop through all the lines and split by comma.  One enhancement could be to have the user choose the delimiter
    parsedCsv.contentRows = csvByLine.map((row) => row.split(','));

    return parsedCsv;
  }

  normalizeCsvHeaders(
    parsedCsvRows: string[][],
    isFirstRowHeaders = false
  ): ParsedCsv {
    let parsedCsv: ParsedCsv = {
      name: '',
      headerRow: [],
      contentRows: [],
    };
    const longestRowLength = this.getLongestRowLength(parsedCsvRows);
    // Check if user said the first row was header data, and that the CSV has data
    if (isFirstRowHeaders && parsedCsvRows.length > 0) {
      // First row becomes the header data
      parsedCsv.headerRow = parsedCsvRows[0];
      // Slice the rest of the data and put into the row data
      parsedCsvRows = parsedCsvRows.slice(1, parsedCsvRows.length);
    }

    // Need to account for the chance that some rows didn't have headers, so fill them with something
    if (longestRowLength > parsedCsv.headerRow.length) {
      parsedCsv.headerRow = parsedCsv.headerRow.concat(
        new Array(longestRowLength - parsedCsv.headerRow.length)
          .fill('')
          .map((header, index) =>
            !header || header.trim().length === 0
              ? `${index}-column-no-name`
              : header
          )
      );
    }    

    parsedCsv.contentRows = parsedCsvRows;

    return parsedCsv;
  }

  getLongestRowLength(row: string[][]): number {
    return row.reduce(
      (accumulator, currentItem) =>
        accumulator < currentItem.length
          ? currentItem.length
          : accumulator,
      0
    );
  }

  csvToJson(parsedCsv: ParsedCsv): string {
    const jsonData = parsedCsv.contentRows
      .reduce(
        (jsonArrayAccumulator, currentRow) => {
          const jsonRow = currentRow.reduce(
            (rowAccumulator, currentCellValue, currentCellIndex) => {
              const propertyName = !!parsedCsv.headerRow[currentCellIndex]
                ?.length
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
      )
      .slice(1);

    return JSON.stringify(jsonData);
  }
}

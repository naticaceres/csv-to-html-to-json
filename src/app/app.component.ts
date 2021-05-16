import { Component, ViewChild } from '@angular/core';
import { ParsedCsv } from './model/parsed-csv.model';
import { FormatConvertService } from './services/format-convert.service';
import { ColumnNameDTO } from './simple-table/column-name-dto.model';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('csvUpload') fileData;
  public csvFile: File;
  name = 'Angular';
  public fileName: string;
  public csvData: string;
  public hasHeader = false;
  public headerData: string[];
  public rowData: string[][] = null;
  public jsonStringData: string;
  public jsonData: object[];
  public showJson = false;

  public parsedCsv: ParsedCsv;

  constructor(private formatConvertService: FormatConvertService) {}

  uploadCSV() {
    this.csvFile = this.fileData.nativeElement.files[0];
    console.log(this.csvFile);
    this.fileName = this.csvFile.name;
    var csvReader = new FileReader();

    csvReader.onload = evt => {
      console.log('File read complete');
      console.log(evt);
      this.csvData = evt.currentTarget.result;
      this.parsedCsv = this.formatConvertService.parseCsv(this.csvData);
      this.parsedCsv.contentRows = this.formatConvertService.normalizeCsvHeaders(
        this.parsedCsv.contentRows,
        this.hasHeader
      );
      this.jsonStringData = this.formatConvertService.csvToJson(
        this.parsedCsv.contentRows
      );
    };
    csvReader.readAsText(this.csvFile);
  }

  columnNameChange(columnName: ColumnNameDTO) {
    const headerRow = this.parsedCsv.contentRows[0];
    headerRow[columnName.index] = columnName.name;
    this.jsonStringData = this.formatConvertService.csvToJson(
      this.parsedCsv.contentRows
    );
    console.log(headerRow);
  }
}

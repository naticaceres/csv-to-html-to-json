import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ParsedCsv } from './model/parsed-csv.model';
import { CsvStateFacadeService } from './services/csv-state-facade.service';
import { ColumnNameDTO } from './simple-table/column-name-dto.model';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('csvUpload') fileData;
  name = 'Angular';

  public hasHeader = false;
  public showJson = false;

  public jsonStringData$: Observable<string>;
  public parsedCsv$: Observable<ParsedCsv>;
  
  constructor(private csvState: CsvStateFacadeService) {
    // uncomment to test without uploading a csv file
    // this.parsedCsv = JSON.parse(
    //   `{"name":"","headerRow":["noName1","noName2","noName3"],
    //   "contentRows":[["1"," first"," record"],["2"," second","record"]]}`
    // );
  }

  ngOnInit() {
    this.parsedCsv$ = this.csvState.parsedCsv$;
    this.jsonStringData$ = this.csvState.jsonCsvString$;
  }

  uploadCsv() {
    const file = this.fileData.nativeElement.files[0];
    this.csvState.uploadCsv(file, this.hasHeader);
  }

  columnNameChange(columnName: ColumnNameDTO) {
    console.log('Column name changed: ', columnName);
    this.csvState.changeColumnName(columnName);
  }
}

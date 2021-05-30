import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ParsedCsv } from './model/parsed-csv.model';
import { CsvStateFacadeService } from './services/csv-state-facade.service';
import { ColumnNameDTO } from './model/column-name-dto.model';

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
    this.csvState.changeColumnName(columnName);
  }
}

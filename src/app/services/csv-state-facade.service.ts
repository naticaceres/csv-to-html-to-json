import { Injectable } from '@angular/core';
import { BehaviorSubject, noop, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ParsedCsv } from '../model/parsed-csv.model';
import { ColumnNameDTO } from '../model/column-name-dto.model';
import { FormatConvertService } from './format-convert.service';
import { UploadCsvService } from './upload-csv.service';

@Injectable({
  providedIn: 'root',
})
export class CsvStateFacadeService {
  private parsedCsvBehaviorSubject = new BehaviorSubject<ParsedCsv>(null);
  public parsedCsv$ = this.parsedCsvBehaviorSubject.asObservable();
  public jsonCsvString$ = this.parsedCsv$.pipe(
    map((parsedCsv) => this.formatConvertService.csvToJson(parsedCsv))
  );

  constructor(
    private formatConvertService: FormatConvertService,
    private uploadCsvService: UploadCsvService
  ) {}

  uploadCsv(file: File, hasHeader: boolean) {
    this.uploadCsvService
      .uploadCSV(file, hasHeader)
      .pipe(
        take(1),
        tap((parsedCsv) => this.parsedCsvBehaviorSubject.next(parsedCsv))
      )
      .subscribe(noop);
  }

  changeColumnName(columnName: ColumnNameDTO) {
    let newHeaderRow = [...this.parsedCsvBehaviorSubject.value.headerRow];
    newHeaderRow.splice(columnName.index, 1, columnName.name);

    this.parsedCsvBehaviorSubject.next({
      ...this.parsedCsvBehaviorSubject.value,
      headerRow: newHeaderRow,
    });
  }
}

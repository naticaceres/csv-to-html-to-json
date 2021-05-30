import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { ParsedCsv } from '../model/parsed-csv.model';
import { FormatConvertService } from './format-convert.service';

@Injectable({
  providedIn: 'root',
})
export class UploadCsvService {
  constructor(private formatConvertService: FormatConvertService) {}

  uploadCSV(csvFile: File, hasHeaders: boolean): Observable<ParsedCsv> {
    let csvReader = new FileReader();

    csvReader.readAsText(csvFile);

    return new Observable((observer: Subscriber<ParsedCsv>): void => {
      // success
      csvReader.onload = (evt) => {
        console.log('File read complete');
        console.log(evt);
        const csvStringData = evt.currentTarget['result'];
        const rawCsv = this.formatConvertService.parseCsv(csvStringData);
        const parsedCsv = this.formatConvertService.normalizeCsvHeaders(
          rawCsv.contentRows,
          hasHeaders
        );
        parsedCsv.name = csvFile.name;

        observer.next(parsedCsv);
        observer.complete();
      };

      //failure
      csvReader.onerror = (error): void => {
        observer.error(error);
      };
    });
  }
}

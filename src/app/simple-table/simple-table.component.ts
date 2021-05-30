import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { ParsedCsv } from '../model/parsed-csv.model';
import { ColumnNameDTO } from './column-name-dto.model';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.css']
})
export class SimpleTableComponent implements OnChanges {
  @Input() rows: string[][];
  @Input() columnNames: string[];
  @Input() parsedData: ParsedCsv;
  
  @Output() columnNameChange = new EventEmitter<ColumnNameDTO>();  

  constructor() {}

  columnNameChanged(index: number, name: string) {
    //this.columnNameChange.emit({ name, index });
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('Changes', changes);
    console.log('Display header row', this.parsedData.headerRow);
  }
}

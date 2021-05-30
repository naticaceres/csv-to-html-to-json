import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnNameDTO } from './column-name-dto.model';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.css'],
})
export class SimpleTableComponent {
  @Input() rows: string[][];
  @Input() columnNames: string[];

  @Output() columnNameChange = new EventEmitter<ColumnNameDTO>();

  constructor() {}

  columnNameChanged(index: number, name: string) {
    this.columnNameChange.emit({ name, index });
  }

  trackByIndex = (index: number, item: any) => index;
}

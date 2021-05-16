import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SimpleTableComponent } from './simple-table/simple-table.component';
import { FormatConvertService } from './services/format-convert.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent,  SimpleTableComponent ],
  bootstrap:    [ AppComponent ],
  providers: [FormatConvertService]
})
export class AppModule { }

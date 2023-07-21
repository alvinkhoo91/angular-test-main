import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppService } from './app.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import the AppService
import {MatPaginatorModule} from '@angular/material/paginator';


@NgModule({
    declarations: [AppComponent],
    imports: [
        CommonModule, 
        FormsModule,
        BrowserModule, 
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        MatPaginatorModule
    ],
    providers: [AppService],//check
    bootstrap: [AppComponent],
})
export class AppModule {}
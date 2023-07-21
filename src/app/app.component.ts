import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import axios from 'axios';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { PageEvent } from '@angular/material/paginator';

// set the display date format originally from MM/DD/YYYY TO MMM DD YYYY
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// define array task should contain what field of attribute
type Task = {
    id: number; // id of each task , randomly assign value
    description: string; // description of task
    date: string | Date; // date to store, use string because Date will assign time zone
    completed: boolean; // condition if completed
};

// TypeScript decorator, metadata of component, template, style, providers
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    
    // configure DateAdapter provider to use MomentDateAdapter
    // DataAdapater is abstract class in Angular to used for date handling
    // MAT_DATE_FORMATS used for configuring date format in Angular Material Components
    providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
    
})



export class AppComponent {
  @ViewChild('picker', { static: false }) picker: MatDatepicker<any>; // Adjust the type as per your needs
  open() {
    this.picker.open();
  }
    // declaration of variable
    id?: string | null | number;
    editingTask?: Task;
    editedTask?:Task;
    title = 'To Do';
    emoji: string='';
    taskDesc?:string; //optional property,store description
    taskDate?: Date; //optional property, store  date
    searchTerm: string = '';
    taskList:Task[]=[];

    
    // Paginator properties
    totalTasks = 100; // Total number of tasks (you can set this dynamically based on your data)
    pageSize = 10; // Number of tasks to be displayed per page
    pageSizeOptions: number[] = [5, 10, 25, 100]; // Options for the number of tasks per page
    currentPage = 0; // Current page index

    //called when component is initialized, setup tasks
    ngOnInit(){

      //get random emoji for header
      this.getRandomEmoji();
      //load existing task created earlier
      this.loadTasksFromLocalStorage();

    }

    // asynchronous function to fetches a random emoji from external API 
    // using axois library
    // asyn to return result, await keyword to pause execution until api call done
    async getRandomEmoji() {
      try {
        const response = await axios.get('https://emoji-api.com/emojis?access_key=e567bebf68909a652fd5b58df12aa018ca90d00c');
        const emojis = response.data; // Array of emoji objects
        const randomIndex = Math.floor(Math.random() * emojis.length); // Generate a random index
        const randomEmoji = emojis[randomIndex]?.character;
        this.emoji = randomEmoji || '🤔'; // Default emoji if API call fails or response is empty
      } catch (error) {
        console.error('Error fetching emoji:', error);
        this.emoji = '🤔'; // Default emoji if API call fails
      }
    }

    //default constructor
    constructor() {}
    
    //load task from storage if any task create earlier
    loadTasksFromLocalStorage() {
        const savedTaskList = localStorage.getItem('taskList');
        if (savedTaskList) {
          this.taskList = JSON.parse(savedTaskList);
        } else {
          this.taskList = [
            {
              id: this.random1234(),
              description: 'Hello World',
              date: '',
              completed: false,
            },
          ];
        }
      }
    
    // filter the task based on searchTerm
    filterTasks() {
        return this.taskList.filter(task =>
          task.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

   //
    addTask() {
        
      // check input if not empty
        if (this.taskDesc && this.taskDesc.trim() !== '') {
          
          //format the date to desire saving format
          // convert date object 
          const formattedDate = moment(this.taskDate).format('DD/MM/YYYY');
          
          // assign value to the array
          const newTask: Task = {
              id: this.random1234(),
              description: this.taskDesc.trim(),
              date: formattedDate, // Use selected date or current date
              completed: false,
            };

      
          // insertion
          this.taskList.push(newTask);
            
          // store in browser loal storage
          localStorage.setItem('taskList', JSON.stringify(this.taskList));
            
          // set value back to default
          this.taskDesc = '';
          this.taskDate = undefined;
        }
      }
    //delete to do task based on id
    deleteToDo(id:number){
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            this.taskList = this.taskList.filter((task)=>task.id!==id);

            //Update the task list in storage after del
            localStorage.setItem('taskList',JSON.stringify(this.taskList));
        }
       
    }
    
    /// random id between 0 and 99999 inclusively 
    random1234() {
        return Math.floor(Math.random() * 100000);
    }
  
    // open the editor tab and fetch the content to the input field
    // to fetch to show user what is the default and going to be edited
    Open_Editor(id: number) {
        this.editingTask = this.taskList.find((task) => task.id === id);

        // Deep copy of editingTask]
        // if no copy, the editing will simultaneously update the to do list
        this.editedTask = JSON.parse(JSON.stringify(this.editingTask)); 
        this.editingTask=this.editedTask;

        //convert the object to store  
        if(this.editingTask){
        this.editingTask.date = moment(this.editingTask.date, 'DD/MM/YYYY').toDate();
       }

    }

    // function to update task after edit
    update_Task() {
      if (this.editingTask && this.editedTask) {
        // Update the editingTask with the values from editedTask
        this.editingTask.description = this.editedTask.description;
        this.editingTask.date = moment(this.editedTask.date).format('DD/MM/YYYY');
  
        // Find the index of the editingTask in the taskList
        const index = this.taskList.findIndex((task) => task.id === this.editingTask?.id);
  
        if (index !== -1) {
          // Update the taskList
          this.taskList[index] = this.editingTask;
  
          // Clear the editingTask and editedTask after updating
          this.editingTask = undefined;
          this.editedTask = undefined;
  
          // Save the updated taskList to local storage
          localStorage.setItem('taskList', JSON.stringify(this.taskList));
        }
      }
    }

    
    // function to check task passed based on date
    // return boolean to highlight html 
    isTaskPassed(formattedDate: string|Date): boolean {
      const currentDate = new Date(); // Get the current date with time
        // Convert formattedDate string to Date object
        const taskDate = moment(formattedDate, 'DD/MM/YYYY').toDate();
        // Compare only the date parts (day, month, and year)
        if (
          taskDate.getFullYear() === currentDate.getFullYear() &&
          taskDate.getMonth() === currentDate.getMonth() &&
          taskDate.getDate() === currentDate.getDate()
        ) {
          return false; // If the task date is equal to today, return false (not passed)
        }
        
        else{
        return taskDate < currentDate; // Compare with today's date
        }
    }


    // Paginator event handler
    handlePageEvent(event: PageEvent) {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
    }
    
}

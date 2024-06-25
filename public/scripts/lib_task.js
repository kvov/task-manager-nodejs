"use strict";

class Task {
    constructor({id, description, priority, responsible, startDate, dueDate}) {  // uses destructuring
        const createId = () => `${Math.floor(Math.random() * 10000)}${new Date().getTime()}`;

        this.id = createId();
        
        this.description = description;

        this.responsible = responsible;

        if (startDate) {
            this.startDate = new Date(startDate);
        } else {
            this.startDate = new Date();
        };

        if (dueDate) {
            this.dueDate = new Date(dueDate);
        } else {
            this.dueDate = new Date();
            this.dueDate.setMonth(this.dueDate.getMonth() + 1);
        };

        //setting priorities for tasks
        if ((this.dueDate.getTime() - new Date().getTime()) <= 7 * 60 * 60 * 1000) {
            this.priority = "High";
        
        } else if ((this.dueDate.getTime() - new Date().getTime()) >= 24 * 24 * 60 * 60 * 1000) {
            this.priority = "Low";
        }
        else  {
            this.priority = "Medium";
        };
    };

    //method for validation of inputs
    get isValid() {
        if (this.description === "" || !isNaN(this.description)) {
            return false;
        }

        if (this.responsible === "" || !isNaN(this.responsible)) {
            return false;
        }

        if (this.dueDate.getTime() < this.startDate.getTime() ) { 
            return false;
        }
        if (this.dueDate.getTime() < new Date().getTime() ) { 
            return false;
        }
        if (this.dueDate == "Invalid Date" || this.startDate == "Invalid Date") {
            return false;
        }

        return true;
    };
    
}
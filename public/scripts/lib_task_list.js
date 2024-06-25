"use strict";

const tasks = Symbol("tasks");

const taskList = {
    [tasks]: [],
    load() {
        $.ajax({
            url: '/tasks',
            method: 'GET',
            success: (data) => {
                this[tasks] = data;
            },
            async: false,
        });
        return this;
    },

    save() {
        $.ajax({
            url: '/tasks',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(this[tasks]),
            success: () => {},
        });
        return this;
    },
    sort() {
        this[tasks].sort((task1, task2) => {
            if (task1.dueDate < task2.dueDate) {
                return -1;
            } else if (task1.dueDate > task2.dueDate) {
                return 1;
            } else {
                return 0;
            }
        });
        return this;
    },
    add(task) {
        this[tasks].push(task);
        this.save(); // Save after adding a task
        return this;
    },
    delete(i) {
        this[tasks].splice(i, 1);
        this.save(); // Save after deleting a task
        return this;
    },
    edit(i, task) {
        this[tasks].splice(i, 1, task);
        this.save(); // Save after editing a task
        return this;
    },
    clear() {
        this[tasks] = [];
        this.save(); // Save after clearing tasks
        return this;
    },
    *[Symbol.iterator]() {
        for (let task of this[tasks]) {
            yield task;
        }
    },
};

// Load tasks on initialization
// taskList.load();

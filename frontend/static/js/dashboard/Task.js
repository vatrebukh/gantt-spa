import { formatDate, getDaysCount, addDays } from "../utility.js";

export default class Task {
    constructor(name, startDate, endDate, assignee) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.assignee = assignee;
    }
}

export function getTaskHtml(task, globalDays) {
    return `
        <div class="dashboard-task">
            <div class="task-assignee">${task.assignee}</div>
            <div class="task-name">${task.name}</div>
            <div class="task-timeline">${getSpansHtml(task.startDate, task.endDate, globalDays)}</div>
            <div class="task-controls">
                <img class="dnmark arrow" src="static/img/down.svg">
                <img class="upmark arrow" src="static/img/up.svg">
                <img class="rmmark" src="static/img/del.svg">
            </div>
        </div>
    `;
}

function getSpansHtml(startDate, endDate, globalDays) {
    let taskDays = getFormattedDays(startDate, endDate);
    let spans = '';
    for (let i = 0; i < globalDays.length; i++) {
        if (taskDays.includes(globalDays[i])) {
            spans += `<span class="day-span marked"> - </span>`;
        } else { 
            spans += `<span class="day-span"></span>`;
        }
    }

    return spans;
}

function getFormattedDays(startDate, endDate) {
    let days = getDaysCount(startDate, endDate);
    let result = [];
    for (let i = 0; i < days; i++) {
        result.push(formatDate(addDays(startDate, i)));
    }

    return result;
}

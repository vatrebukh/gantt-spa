import { getFormattedDays } from "../utility.js";

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
            <span class="task-assignee">${task.assignee}</span>
            <span class="task-name">${task.name}</span>
            <span class="task-timeline">${getSpansHtml(task.startDate, task.endDate, globalDays)}</span>
            <span class="task-controls">
                <img class="dnmark arrow" src="static/img/down.svg">
                <img class="upmark arrow" src="static/img/up.svg">
                <img class="rmmark" src="static/img/del.svg">
            </span>
        </div>
    `;
}

function getSpansHtml(startDate, endDate, globalDays) {
    let taskDays = getFormattedDays(startDate, endDate);
    let spans = '';
    for (let i = 0; i < globalDays.length; i++) {
        let marked = taskDays.includes(globalDays[i]) ? 'marked' : '';
        spans += `<span class="day-span ${marked}">&nbsp</span>`;
    }

    return spans;
}



import { getFormattedDays  } from "../utility.js";

export class Task {
    constructor(id, name, startDate, endDate, assignee) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.assignee = assignee;
    }
}

export function getTaskHtml(task, globalDays) {
    return `
        <li class="dashboard-task">
            <span class="task-assignee">${task.assignee}</span>
            <span class="task-name">${task.name}</span>
            <span class="task-timeline">${getSpansHtml(task.startDate, task.endDate, globalDays)}</span>
            <span class="task-controls">
                <span><img class="dnmark" src="static/img/down.svg"></span>
                <span><img class="upmark" src="static/img/up.svg"></span>
                <span><img class="rmmark" src="static/img/del.svg"></span>
            </span>
        </li>
    `;
}

function getSpansHtml(startDate, endDate, globalDays) {
    let taskDays = getFormattedDays(startDate, endDate);
    let spans = '';
    for (let i = 0; i < globalDays.length; i++) {
        let marked = taskDays.includes(globalDays[i]) ? 'marked' : '';
        spans += `<span class="day-span ${marked}"></span>`;
    }

    return spans;
}



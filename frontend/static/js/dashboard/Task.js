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
            <label hidden>${task.id}</label>
            <span class="task-assignee">${task.assignee}</span>
            <span class="task-name">${getShortName(task.name)}</span>
            <span class="hidden task-name-long">${task.name}</span>
            <span class="task-timeline">${getSpansHtml(task.startDate, task.endDate, globalDays)}</span>
            <span class="task-controls">
                <span><img class="dnmark" src="/static/img/down.svg"></span>
                <span><img class="upmark" src="/static/img/up.svg"></span>
                <span><img class="rmmark" src="/static/img/del.svg"></span>
            </span>
        </li>
    `;
}

function getShortName(taskName) {
    return taskName.length > 35 ? taskName.slice(0, 32) + '...' : taskName;
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



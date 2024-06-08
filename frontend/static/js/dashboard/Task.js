import { formatDate, getDaysCount, addDays } from "../utility.js";

export default class Task {
    constructor(name, startDate, endDate, assignee) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.assignee = assignee;
    }
}

export function getTaskHtml(task) {
    return `
        <div class="dashboard-task">
            <div class="task-assignee">${task.assignee}</div>
            <div class="task-name">${task.name}</div>
            <div class="task-timeline">${getSpansHtml(task.startDate, task.endDate)}</div>
            <div class="task-controls"></div>
        </div>
    `;
}

function getSpansHtml(startDate, endDate) {
    let days = getDaysCount(startDate, endDate);
    let spans = '';
    for (let i = 0; i < days; i++) {
        //spans += `<span class="day-span">${formatDate(addDays(startDate, i))}</span>`;
    }

    return spans;
}

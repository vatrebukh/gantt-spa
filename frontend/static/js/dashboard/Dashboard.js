import { getTaskHtml } from "./Task.js";
import { getDaysCount, formatDate, addDays } from "../utility.js";

export class Dashboard {
    constructor(name, tasks, startDate, endDate) {
        this.name = name;
        this.tasks = tasks;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getDashboardHtml() {
        return `
            <div class="dashboard">
                <h1>${this.name}</h1>
                <h2>${this.startDate} - ${this.endDate}</h2>
                <div class="dashboard-header">
                    <div class="task-assignee">Assigned to</div>
                    <div class="task-name">Task name</div>
                    <div class="task-timeline">${this.getTimelineSpansHtml(this.startDate, this.endDate)}</div>
                    <div class="task-controls">Controls</div>
                </div>
                <div class="dashboard-tasks">
                    ${this.tasks.map(task => getTaskHtml(task)).join('')}
                </div>
            </div>
        `;
    }

    getTimelineSpansHtml(startDate, endDate) {
        let days = getDaysCount(startDate, endDate);
        let spans = '';
        for (let i = 0; i < days; i++) {
            spans = spans + `<span class="day-span">${formatDate(addDays(startDate, i))}</span>`;
        }
    
        return spans;
    }
}

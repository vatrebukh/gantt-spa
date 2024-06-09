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
        let arrayDays = this.getFormattedDays(this.startDate, this.endDate);
        return `
            <div class="dashboard">
                <h1>${this.name}</h1>
                <h2>${this.startDate} - ${this.endDate}</h2>
                <div class="dashboard-header">
                    <div class="task-assignee">Assigned to</div>
                    <div class="task-name">Task name</div>
                    <div class="task-timeline">
                        ${arrayDays.map(day => `<span class="day-span">${day}</span>`).join('')}
                    </div>
                    <div class="task-controls">Controls</div>
                </div>
                <div class="dashboard-tasks">
                    ${this.tasks.map(task => getTaskHtml(task, arrayDays)).join('')}
                </div>
            </div>
        `;
    }

    getFormattedDays(startDate, endDate) {
        let days = getDaysCount(startDate, endDate);
        let result = [];
        for (let i = 0; i < days; i++) {
            result.push(formatDate(addDays(startDate, i)));
        }
    
        return result;
    }
}

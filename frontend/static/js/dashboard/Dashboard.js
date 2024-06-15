import { getTaskHtml } from "./Task.js";
import { getFormattedDays } from "../utility.js";

export class Dashboard {
    constructor(name, tasks, startDate, endDate) {
        this.name = name;
        this.tasks = tasks;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getDashboardHtml() {
        let arrayDays = getFormattedDays(this.startDate, this.endDate);
        return `
            <div class="dashboard">
                <h1>${this.name}</h1>
                <h2>${this.startDate} - ${this.endDate}</h2>
                <div class="dashboard-content">
                    <div class="dashboard-header">
                        <span class="task-assignee"><br>Assignee</span>
                        <span class="task-name"><br>Task name</span>
                        <span class="task-timeline">
                            ${arrayDays.map(day => `<span class="day-span">${day}</span>`).join('')}
                        </span>
                        <span class="task-controls"><br>Controls</span>
                    </div>
                    <ul class="dashboard-tasks">
                        ${this.tasks.map(task => getTaskHtml(task, arrayDays)).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

}

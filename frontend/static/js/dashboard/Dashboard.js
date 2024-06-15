import { getTaskHtml } from "./Task.js";
import { formatDate, getTimelineDays, getFormattedDays, isHoliday } from "../utility.js";

export class Dashboard {
    constructor(name, tasks, startDate, endDate) {
        this.name = name;
        this.tasks = tasks;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getDashboardHtml() {
        let arrayDays = getTimelineDays(this.startDate, this.endDate);
        let formattedDays = getFormattedDays(this.startDate, this.endDate);
        let today = new Date();
        return `
            <div class="dashboard">
                <h1>${this.name}</h1>
                <h2>${this.startDate} - ${this.endDate}</h2>
                <div class="dashboard-content">
                    <div class="dashboard-header">
                        <span class="task-assignee">Assignee</span>
                        <span class="task-name">Task name</span>
                        <span class="task-timeline">
                            ${arrayDays.map(day => `<span class="day-span ${isHoliday(day) ? 'holiday' : ''} ${formatDate(day) == formatDate(today) ? 'today' : ''}">${formatDate(day)}</span>`).join('')}
                        </span>
                        <span class="task-controls">Controls</span>
                    </div>
                    <ul class="dashboard-tasks">
                        ${this.tasks.map(task => getTaskHtml(task, formattedDays)).join('')}
                    </ul>
                </div>
            </div>
        `;
    }


}

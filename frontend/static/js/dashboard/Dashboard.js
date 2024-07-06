import { getTaskHtml } from "./Task.js";
import { formatDate, getTimelineDays, getFormattedDays, isHoliday } from "../utility.js";

export class Dashboard {
    constructor({id, name, tasks, startDate, endDate, status}) {
        this.id = id;
        this.name = name;
        this.tasks = tasks;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    moveDown(name) {
        let task = this.tasks.find(task => task.name == name);
        let idx = this.tasks.indexOf(task);
        this.tasks[idx] = this.tasks[idx + 1];
        this.tasks[idx + 1] = task;
    }

    moveUp(name) {
        let task = this.tasks.find(task => task.name == name);
        let idx = this.tasks.indexOf(task);
        this.tasks[idx] = this.tasks[idx - 1];
        this.tasks[idx - 1] = task;
    }

    getDashboardHtml() {
        let arrayDays = getTimelineDays(this.startDate, this.endDate);
        let formattedDays = getFormattedDays(this.startDate, this.endDate);
        let today = new Date();
        return `
            <div class="dashboard">
                <h1>${this.name} (${this.status})</h1>
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
                <div id="dashboard-btns">
                    <button id="new-task-btn" class="board-img-btn"><span><img src="/static/img/plus.svg"></span>New task</button>
                    <button id="chng-sts-btn" class="board-img-btn"><span><img src="/static/img/right.svg"></span>Change status</button>
                </div>
                <div id="new-task-plc"></div>
            </div>
        `;
    }

    getTaskListHtml() {
        let formattedDays = getFormattedDays(this.startDate, this.endDate);
        return this.tasks.map(task => getTaskHtml(task, formattedDays)).join('');
    }

    getNewTaskHtml() {
        return `
            <div id="new-task">
                <input type="text" id="new-task-assignee" class="task-assignee" placeholder="Assigned to"></input>
                <input type="text" id="new-task-name" class="task-name" placeholder="Task name"></input>
                <label for="task-timeline">Start date</label>
                <input type="date" id="new-task-start" class="task-timeline" min="${this.startDate}"></input>
                <label for="task-timeline">End date</label>
                <input type="date" id="new-task-end" class="task-timeline" max="${this.endDate}"></input>
                
                <div>                
                    <button class="add-task-btn" id="add-task-btn"><span>Create task</span></button>
                    <button class="add-task-btn" id="cncl-task-btn"><span>Cancel</span></button>
                </div>
            </div>
        `;
    }

    getBoardInfoHtml() {
        if (this.id) {
            return this.getFullBoardInfoHtml();
        } else {
            return this.getEmptyBoardInfoHtml();
        }
    }

    getFullBoardInfoHtml() {
        return `
            <div class="board-info status-${this.status}">
                <label hidden>${this.id}</label>
                <div>${this.name}</div>
                <div>${this.startDate} - ${this.endDate}</div>
                <div>${this.status}</div>
            </div>
        `;
    }

    getEmptyBoardInfoHtml() {
        return `
            <div id="new-board">
                <input type="text" id="new-board-name" placeholder="Dashboard name"></input>
                <label for="board-start-date">Start date</label>
                <input type="date" id="new-board-start" class="board-start-date"></input>
                <label for="board-end-date">End date</label>
                <input type="date" id="new-board-end" class="board-end-date"></input>

                <div>                
                    <button class="add-board-btn" id="add-board-btn"><span>Create</span></button>
                    <button class="add-board-btn" id="cncl-board-btn"><span>Cancel</span></button>
                </div>
            </div>
        `;
    }
}


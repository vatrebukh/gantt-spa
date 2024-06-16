import { Dashboard } from "./Dashboard.js";
import { Task, getTaskHtml } from "./Task.js";
import { getDaysCount, getFormattedDays } from "../utility.js";

export class DashboardService {
    
    async loadDashboard() {
        let board = await this.getDashboard();
        this.renderDashboard(board);
    }

    renderDashboard(board) {
        document.getElementById('root').innerHTML = board.getDashboardHtml();
        document.querySelector('div.dashboard-header span.task-timeline').addEventListener('scroll', this.syncScroll);
        this.setBoardMaxWidth(board);
        this.assignControllEvents();
        this.addNewTaskEvent(board);
        this.assignEditEvents(board);
    }

    setBoardMaxWidth(board) {
        let timeSpanWidth = getDaysCount(board.startDate, board.endDate) * 25 + 1;
        document.querySelectorAll('span.task-timeline').forEach(element => {
            element.style.maxWidth = `${timeSpanWidth}px`;
        });
        let assigneeWidth = document.querySelector('span.task-assignee').offsetWidth;
        let nameWidth = document.querySelector('span.task-name').offsetWidth;
        let controlsWidth = document.querySelector('span.task-controls').offsetWidth;

        document.querySelector('div.dashboard-content').style.maxWidth = assigneeWidth + nameWidth + timeSpanWidth + controlsWidth - 4 + 'px';
    }

    assignEditEvents(board) {
        document.querySelectorAll('li.dashboard-task').forEach(element => this.assignEditEvent(board, element));
    }

    assignEditEvent(board, element) {
        element.addEventListener('dblclick', () => {
            let newTaskBtn = document.getElementById('new-task-btn');
            newTaskBtn.style.display = 'none';
            let newTaskEl = document.getElementById('new-task-plc');
            newTaskEl.innerHTML = board.getNewTaskHtml();

            document.getElementById('new-task-assignee').value = element.querySelector('span.task-assignee').textContent;
            document.getElementById('new-task-name').value = element.querySelector('span.task-name').textContent;

            document.getElementById('add-task-btn').textContent = 'Save task';
            document.getElementById('add-task-btn').addEventListener('click', () => {
                element.querySelector('span.task-assignee').textContent = document.getElementById('new-task-assignee').value;
                element.querySelector('span.task-name').textContent = document.getElementById('new-task-name').value ;
                newTaskEl.innerHTML = '';
                newTaskBtn.style.display = 'block';
            });

            document.getElementById('cncl-task-btn').addEventListener('click', () => {
                newTaskEl.innerHTML = '';
                newTaskBtn.style.display = 'block';
            });
        });
    }

    addNewTaskEvent(board) {
        let newTaskBtn = document.getElementById('new-task-btn');
        newTaskBtn.addEventListener('click', () => {
            let newTaskEl = document.getElementById('new-task-plc');
            newTaskEl.innerHTML = board.getNewTaskHtml();
            newTaskBtn.style.display = 'none';

            document.getElementById('add-task-btn').addEventListener('click', () => {
                this.appendNewTask(board);
                newTaskEl.innerHTML = '';
                newTaskBtn.style.display = 'block';
            });

            document.getElementById('cncl-task-btn').addEventListener('click', () => {
                newTaskEl.innerHTML = '';
                newTaskBtn.style.display = 'block';
            });
        });
    }

    appendNewTask(board) {
        let assignee = document.getElementById('new-task-assignee').value;
        let name = document.getElementById('new-task-name').value;
        let start = document.getElementById('new-task-start').value;
        let end = document.getElementById('new-task-end').value;
        let newTask = new Task(name, start, end, assignee);
        if (!assignee || !name || !start || !end) {
            console.warn('All fields are required');
            return;
        }
        
        let newTaskHtml = getTaskHtml(newTask, getFormattedDays(board.startDate, board.endDate));
        document.querySelector('ul.dashboard-tasks').insertAdjacentHTML('beforeend', newTaskHtml);
        this.assignControllEventsToTask();
        let element = this.querySelectorLast('li.dashboard-task');
        this.assignEditEvent(board, element);
    }

    assignControllEventsToTask() { 
        let rmIcon = this.querySelectorLast('img.rmmark');
        rmIcon.addEventListener('click', () => rmIcon.parentElement.parentElement.parentElement.remove());

        let dnIcon = this.querySelectorLast('img.dnmark');
        dnIcon.addEventListener('click', () => this.moveDown(dnIcon.parentElement.parentElement.parentElement));

        let upIcon = this.querySelectorLast('img.upmark');
        upIcon.addEventListener('click', () => this.moveUp(upIcon.parentElement.parentElement.parentElement));
    }

    querySelectorLast(prop) {
        let arr = document.querySelectorAll(prop);
        return arr[arr.length-1];
    }

    assignControllEvents() { 
        document.querySelectorAll('img.rmmark').forEach(element => {
            element.addEventListener('click', () => {
                element.parentElement.parentElement.parentElement.remove();
            });
        });

        document.querySelectorAll('img.dnmark').forEach(element => {
            element.addEventListener('click', () => this.moveDown(element.parentElement.parentElement.parentElement));
        });

        document.querySelectorAll('img.upmark').forEach(element => {
            element.addEventListener('click', () => this.moveUp(element.parentElement.parentElement.parentElement));
        });
    }

    syncScroll() {
        const masterSpan = document.querySelector('div.dashboard-header span.task-timeline');
        const taskSpans = document.querySelectorAll('ul.dashboard-tasks span.task-timeline');
        taskSpans.forEach((span) => {
            span.scrollLeft = masterSpan.scrollLeft;
          });
      }

    moveDown(parent) {
        let next = parent.nextElementSibling;
        if (next) {
            parent.parentElement.insertBefore(next, parent);
            this.syncScroll();
        }
    }

    moveUp(parent) {
        let prev = parent.previousElementSibling;
        if (prev) {
            parent.parentElement.insertBefore(parent, prev);
            this.syncScroll();
        }
    }

    async getDashboard() {
        return fetch('/static/data/board-one.json')
            .then(response => response.json())
            .then(data => new Dashboard(data.name, data.tasks, data.startDate, data.endDate));
    }
}

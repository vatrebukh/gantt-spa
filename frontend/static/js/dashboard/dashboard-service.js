import { Dashboard } from "./Dashboard.js";
import { Task } from "./Task.js";
import { getDaysCount } from "../utility.js";

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

    addNewTaskEvent(board) {
        let newTaskBtn = document.getElementById('new-task-btn');
        newTaskBtn.addEventListener('click', () => {
            let newTaskEl = document.getElementById('new-task')
            newTaskEl.innerHTML = board.getNewTaskHtml();
            newTaskEl.style.display = 'block';
            newTaskBtn.style.display = 'none';

            document.getElementById('add-task-btn').addEventListener('click', () => {
                let assignee = document.getElementById('new-task-assignee').value;
                let name = document.getElementById('new-task-name').value;
                let start = document.getElementById('new-task-start').value;
                let end = document.getElementById('new-task-end').value;
                let newTask = new Task(name, start, end, assignee);
                board.tasks.push(newTask);
                newTaskBtn.style.display = 'block';
                newTaskEl.innerHTML = '';
                newTaskEl.style.display = 'none';

                this.renderDashboard(board);
            });
        });
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

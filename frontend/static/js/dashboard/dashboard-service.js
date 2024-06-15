import { Dashboard } from "./Dashboard.js";
import { getDaysCount } from "../utility.js";

export class DashboardService {
    
    async renderDashboard() {
        let board = await this.loadDashboard();
        let numberDays = getDaysCount(board.startDate, board.endDate);
        let timeSpanWidth = numberDays * 25 + 1;
        document.getElementById('root').innerHTML = board.getDashboardHtml();
        
        document.querySelectorAll('span.task-timeline').forEach(element => {
            element.style.maxWidth = `${timeSpanWidth}px`;
        });

        this.setBoardMaxWidth(timeSpanWidth);

        this.assignControllEvents();
    }

    setBoardMaxWidth(timeSpanWidth) {
        let assigneeWidth = document.querySelector('span.task-assignee').offsetWidth;
        let nameWidth = document.querySelector('span.task-name').offsetWidth;
        let controlsWidth = document.querySelector('span.task-controls').offsetWidth;

        document.querySelector('div.dashboard-content').style.maxWidth = assigneeWidth + nameWidth + timeSpanWidth + controlsWidth - 4 + 'px';
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

    moveDown(parent) {
        let next = parent.nextElementSibling;
        if (next) {
            parent.parentElement.insertBefore(next, parent);
        }
    }

    moveUp(parent) {
        let prev = parent.previousElementSibling;
        if (prev) {
            parent.parentElement.insertBefore(parent, prev);
        }
    }

    async loadDashboard() {
        return fetch('/static/data/board-one.json')
            .then(response => response.json())
            .then(data => new Dashboard(data.name, data.tasks, data.startDate, data.endDate));
    }
}

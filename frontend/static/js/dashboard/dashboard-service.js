import { Dashboard } from "./Dashboard.js";
import { getDaysCount } from "../utility.js";

export class DashboardService {
    
    async renderDashboard() {
        let board = await this.loadDashboard();
        let numberDays = getDaysCount(board.startDate, board.endDate);
        document.getElementById('root').innerHTML = board.getDashboardHtml();
        
        document.querySelectorAll('div.task-timeline').forEach(element => {
            element.style.maxWidth = `${numberDays * 25 + 1}px`;
        });

        this.assignControllEvents();
    }

    assignControllEvents() { 
        document.querySelectorAll('img.rmmark').forEach(element => {
            element.addEventListener('click', () => {
                element.parentElement.parentElement.remove();
            });
        });

        document.querySelectorAll('img.dnmark').forEach(element => {
            element.addEventListener('click', () => this.moveDown(element));
        });

        document.querySelectorAll('img.upmark').forEach(element => {
            element.addEventListener('click', () => this.moveUp(element));
        });
    }

    moveDown(element) {
        let parent = element.parentElement.parentElement;
        let next = parent.nextElementSibling;
        if (next) {
            parent.parentElement.insertBefore(next, parent);
        }
    }

    moveUp(element) {
        let parent = element.parentElement.parentElement;
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

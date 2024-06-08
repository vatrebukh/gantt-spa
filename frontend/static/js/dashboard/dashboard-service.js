import { Dashboard } from "./Dashboard.js";
import { getDaysCount } from "../utility.js";

export class DashboardService {
    
    async renderDashboard() {
        let board = await this.loadDashboard();
        let numberDays = getDaysCount(board.startDate, board.endDate);
        document.getElementById('root').innerHTML = board.getDashboardHtml();
        
        document.querySelectorAll('div.task-timeline').forEach(element => {
            element.style.maxWidth = `${numberDays * 26 - 1}px`;
        })
    }

    async loadDashboard() {
        return fetch('/static/data/board-one.json')
            .then(response => response.json())
            .then(data => new Dashboard(data.name, data.tasks, data.startDate, data.endDate));
    }
}

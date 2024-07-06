import { Dashboard } from "./Dashboard.js";
import { navigate } from "../index.js";

export class DashboardManagementService {
    async viewDashboards() {
        let dashboards = await this.getDashboardsFromLocalStorage();
        this.renderDashboards(dashboards);
        this.assignEvents();
    }

    async getDashboardsFromLocalStorage() {
        let data = JSON.parse(localStorage.getItem('dashboards'));
        return data ? data : await this.getDashboardsFromFile();
    }

    async getDashboardsFromFile() {
        return fetch('/static/data/dashboards.json')
            .then(response => response.json());
    }

    assignEvents() {
        document.querySelectorAll('div.board-info')
            .forEach(element => element.addEventListener('click', e => {
                let parent = this.findElement(e.target, 'div.board-info');
                let id = parent.querySelector('label').textContent;
                history.pushState(null, null, `/dashboard/${id}`);
                navigate();
            }));
        
        document.getElementById('new-board-btn').addEventListener('click', e => {
            history.pushState(null, null, '/dashboards/new');
            navigate();
        });
    }

    findElement(target, description) {
        if (target.matches(description)) {
            return target;
        } else {
            return this.findElement(target.parentElement, description);
        }
    }

    renderDashboards(data) {
        document.getElementById('root').innerHTML = this.getDashboardInfoHtml(data);
    }

    getDashboardInfoHtml(data) {
        return `
            <div id="add-board">
                <button id="new-board-btn" class="board-img-btn"><span><img src="/static/img/plus.svg"></span>New Dashboard</button>
            </div>
            <div id="board-infos">
                ${Array.from(data).map(info => new Dashboard(info).getBoardInfoHtml()).join('')}
            </div>
        `;
    }
}
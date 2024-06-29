import { DashboardInfo } from "./DashboardInfo.js";
import { navigate } from "../index.js";

export class DashboardsService {
    async loadDashboards() {
        let dashboards = await this.getDashboardsFromLocalStorage();
        this.previewDashboards(dashboards);
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
    }

    findElement(target, description) {
        if (target.matches(description)) {
            return target;
        } else {
            return this.findElement(target.parentElement, description);
        }
    }

    previewDashboards(data) {
        document.getElementById('root').innerHTML = Array.from(data).map(info => new DashboardInfo(info).getBoardInfoHtml()).join('');
    }

}
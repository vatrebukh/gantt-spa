import { DashboardService } from "./dashboard/dashboard-service.js";
import { DashboardManagementService } from "./dashboard/dashboard-management-service.js";
import { Router } from "./Router.js";
import { getNavHtml } from "./home-service.js";
import { TeamService } from "./team-service.js";
import { UserService } from "./user-service.js";

const dashboardService = new DashboardService();
const dashboardManagementService = new DashboardManagementService();
const teamService = new TeamService();
const userService = new UserService();

const routes = [
    { path: '/', view: () => viewHome() },
    { path: '/dashboards', view: () => viewDashboards() },
    { path: '/dashboards/new', view: () => createDashboard() },
    { path: '/dashboard/:id', view: (args) => viewDashboard(args) },
    { path: '/teams', view: () => viewTeams() },
    { path: '/teams/:id', view: (args) => viewTeams(args) },
    { path: '/users', view: () => users() },
];

const router = new Router(routes);

export const navigate = () => {
    let { route, params } = router.findRoute(location.pathname);
    route.view(params);
};

window.addEventListener("popstate", navigate);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            history.pushState(null, null, e.target.href);
            navigate();
        }
    });

    navigate();
});

function viewHome() {
    document.getElementById('root').innerHTML = getNavHtml();
}

async function viewDashboard(params) {
    await dashboardService.loadDashboard(params);
}

async function viewDashboards() {
    await dashboardManagementService.viewDashboards();
}

function createDashboard() {
    dashboardService.createDashboard();
}

async function viewTeams(params) {
    if (params && params.id) {
        teamService.renderTeam(params.id);
    } else {
        teamService.renderTeams();
    }
}

async function users() {
    userService.renderUsers();
}

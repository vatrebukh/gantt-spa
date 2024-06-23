import { DashboardService } from "./dashboard/dashboard-service.js";
import { Router } from "./Router.js";
import { getNavHtml } from "./home-service.js";

const dashboardService = new DashboardService();

const routes = [
    { path: '/', view: () => viewHome() },
    { path: '/dashboard', view: () => viewDashboard() },
    { path: '/dashboard/:id', view: (args) => viewDashboard(args) },
    { path: '/teams', view: () => viewTeams() },
    { path: '/teams/:id', view: (args) => viewTeams(args) },
];

const router = new Router(routes);

const navigate = () => {
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

async function viewTeams(params) {
    if (params && params.id) {
        document.getElementById('root').innerHTML = `Team ${params.id}`;
    } else {
        document.getElementById('root').innerHTML = 'Teams';
    }
}

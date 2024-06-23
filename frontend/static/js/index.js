import { DashboardService } from "./dashboard/dashboard-service.js";

const dashboardService = new DashboardService();

const routes = [
    { path: '/', view: () => viewHome() },
    { path: '/dashboard', view: () => viewDashboard() },
    { path: '/dashboard/:id', view: () => viewDashboard() },
];

const route = (event) => {
    event = event || window.event;
    event.preventDefault();

    let navTo = findRoute(location.pathname) || routes[0];
    navigate(navTo);
};

const params = {};

function findRoute(url) {
    if (url.length > 1 && url.endsWith('/')) {
        url = url.replace(/\/$/, '');
    }
    return routes.find(route => matches(route.path, url));
}

function matches(route, url) {
    let routeSegments = route.split('/').slice(1);
    let urlSegments = url.split('/').slice(1);

    if (routeSegments.length !== urlSegments.length) {
        return false;
    }

    const match = routeSegments.every((segment, i) => segment === urlSegments[i] || segment.startsWith(':'));

    if (match) {
        routeSegments.forEach((segment, i) => {
            if (segment.startsWith(':')) {
                params[segment.slice(1)] = urlSegments[i];
            }
        });
    }

    return match;
}

function navigate({path, view}) {
    let newPath = path.split('/').map(segment => {
        if (segment.startsWith(':')) {
            return params[segment.slice(1)];
        } else {
            return segment;
        }
    }).join('/');
    history.pushState({}, "", newPath);
    view();
}

document.addEventListener('DOMContentLoaded', () => {
    route();
});

function viewHome() {
    document.getElementById('root').innerHTML = 'Home';
}

async function viewDashboard() {
    await dashboardService.loadDashboard(params);
}

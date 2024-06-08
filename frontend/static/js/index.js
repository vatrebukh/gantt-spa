const routes = [
    { path: '/', view: () => viewHome() },
    { path: '/dashboard', view: () => viewDashboard() },
];


const route = (event) => {
    event = event || window.event;
    event.preventDefault();

    let navTo = routes.find(route => route.path === location.pathname) || routes[0];
    navigateTo(navTo);
};

function navigateTo({path, view}) {
    history.pushState({}, "", path);
    view();
}

document.addEventListener('DOMContentLoaded', () => {
    route();
});

function viewHome() {
    document.getElementById('root').innerHTML = 'Home';
}

function viewDashboard() {
    document.getElementById('root').innerHTML = 'Dashboard';
}

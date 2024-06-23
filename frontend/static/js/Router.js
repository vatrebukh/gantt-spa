export class Router {
    constructor(routes) {
        this.routes = routes;
    }

    params = {};

    findRoute(url) {
        if (url.length > 1 && url.endsWith('/')) {
            url = url.replace(/\/$/, '');
        }
        let route = this.routes.find(route => this.matches(route.path, url)) || this.routes[0];
        return {route, params: this.params};
    }

    matches(route, url) {
        let routeSegments = route.split('/').slice(1);
        let urlSegments = url.split('/').slice(1);
    
        if (routeSegments.length !== urlSegments.length) {
            return false;
        }
    
        const match = routeSegments.every((segment, i) => segment === urlSegments[i] || segment.startsWith(':'));
    
        if (match) {
            routeSegments.forEach((segment, i) => {
                if (segment.startsWith(':')) {
                    this.params[segment.slice(1)] = urlSegments[i];
                }
            });
        }
    
        return match;
    }
}
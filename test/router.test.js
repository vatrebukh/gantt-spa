import { Router } from "../frontend/static/js/router";

const routes = [
    { path: '/', view: () => viewHome() },
    { path: '/teams', view: () => viewTeams() },
    { path: '/teams/new', view: () => createTeam() },
    { path: '/teams/:id', view: (args) => viewTeams(args) }
];

describe('findRoute', () => {
    const router = new Router(routes);
    test('should return root for not matched url', () => {
        expect(router.findRoute('/team').route.path).toBe('/');
    });
    test('should return matched route', () => {
        expect(router.findRoute('/teams').route.path).toBe('/teams');
    });
    test('should return matched route ignoring trailing slash', () => {
        expect(router.findRoute('/teams/').route.path).toBe('/teams');
    });
    test('should return matched route by two path params', () => {
        expect(router.findRoute('/teams/new').route.path).toBe('/teams/new');
    });
    test('should return matched route with placeholder', () => {
        expect(router.findRoute('/teams/1').route.path).toBe('/teams/:id');
    });
})
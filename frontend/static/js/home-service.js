export function getNavHtml() {
    return `
        <nav>
            <ul>
                <li><a href="/dashboards" data-link>Dashboards</a></li>
                <li><a href="/teams" data-link>Teams</a></li>
                <li><a href="/users" data-link>Users</a></li>
            </ul>
        </nav>
    `;
}
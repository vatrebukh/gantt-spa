export function getNavHtml() {
    return `
        <nav>
            <ul>
                <li><a href="/dashboards" data-link>Dashboards</a></li>
                <li><a href="/dashboards/new" data-link>Create dashboard</a></li>
                <li><a href="/teams" data-link>Teams</a></li>
            </ul>
        </nav>
    `;
}
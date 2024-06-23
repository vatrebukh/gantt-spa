export function getNavHtml() {
    return `
        <nav>
            <ul>
                <li><a href="/" data-link>Home</a></li>
                <li><a href="/dashboard" data-link>Dashboard</a></li>
                <li><a href="/teams" data-link>Teams</a></li>
            </ul>
        </nav>
    `;
}
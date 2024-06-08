export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = date => date ? `${MONTHS[date.getMonth()]} ${date.getDate()}` : '';

export function getDaysCount(startDate, endDate) {
    return (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
}

export function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
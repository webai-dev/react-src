// NOTE copied from '@formatjs/intl-utils'

const MS_PER_SECOND = 1e3;
const SECS_PER_MIN = 60;
const SECS_PER_HOUR = SECS_PER_MIN * 60;
const SECS_PER_DAY = SECS_PER_HOUR * 24;
const SECS_PER_WEEK = SECS_PER_DAY * 7;

const DEFAULT_THRESHOLDS = {
    second: 45,
    minute: 45,
    hour: 22,
    day: 7,
    weeks: 2,
    month: 1,
};

function getRelativeTimeUnit(from, to = Date.now(), thresholds = {}) {
    const resolvedThresholds = Object.assign(Object.assign({}, DEFAULT_THRESHOLDS), (thresholds || {}));

    const secs = (+from - +to) / MS_PER_SECOND;
    if (Math.abs(secs) < resolvedThresholds.second) {
        return {
            value: Math.round(secs),
            unit: 'second',
        };
    }
    const mins = secs / SECS_PER_MIN;
    if (Math.abs(mins) < resolvedThresholds.minute) {
        return {
            value: Math.round(mins),
            unit: 'minute',
        };
    }
    const hours = secs / SECS_PER_HOUR;
    if (Math.abs(hours) < resolvedThresholds.hour) {
        return {
            value: Math.round(hours),
            unit: 'hour',
        };
    }
    const days = secs / SECS_PER_DAY;
    if (Math.abs(days) < resolvedThresholds.day) {
        return {
            value: Math.round(days),
            unit: 'day',
        };
    }
    const weeks = secs / SECS_PER_WEEK;
    if (Math.abs(weeks) < resolvedThresholds.weeks) {
        return {
            value: Math.round(weeks),
            unit: 'week',
        };
    }
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const years = fromDate.getFullYear() - toDate.getFullYear();
    const months = years * 12 + fromDate.getMonth() - toDate.getMonth();
    return {
        value: Math.max(Math.round(months), -12), // limit to 12 month
        unit: 'month',
    };
}

export default getRelativeTimeUnit;

export function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    } [c]));
}

export function temp(celsius, unit) {
    const v = unit === 'imperial' ? celsius * 9 / 5 + 32 : celsius;
    return `${Math.round(v)}°`;
}

export function wind(ms, unit) {
    return unit === 'imperial' ?
        `${Math.round(ms * 2.23694)} mph` :
        `${Math.round(ms * 3.6)} km/h`;
}

// Horário "de parede" da cidade: desloca o timestamp pelo fuso da cidade e lê em UTC.
function cityDate(unixSeconds, tzSeconds) {
    return new Date((unixSeconds + tzSeconds) * 1000);
}

export function cityTime(unixSeconds, tzSeconds) {
    return cityDate(unixSeconds, tzSeconds).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    });
}

export function cityWeekday(unixSeconds, tzSeconds, style = 'short') {
    return cityDate(unixSeconds, tzSeconds)
        .toLocaleDateString('pt-BR', { weekday: style, timeZone: 'UTC' })
        .replace('.', '');
}

export function cityDayKey(unixSeconds, tzSeconds) {
    return cityDate(unixSeconds, tzSeconds).toISOString().slice(0, 10);
}

export function localTime(unixSeconds) {
    return new Date(unixSeconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/** Agrupa a previsão de 3 em 3 horas em até 5 dias (sem o dia de hoje). */
export function dailyForecast(forecast, tz, nowUnix) {
    if (!forecast || !Array.isArray(forecast.list)) return [];
    
    const todayKey = cityDayKey(nowUnix, tz);
    const days = new Map();
    
    for (const item of forecast.list) {
        const key = cityDayKey(item.dt, tz);
        if (key === todayKey) continue;
        if (!days.has(key)) days.set(key, []);
        days.get(key).push(item);
    }
    
    return [...days.entries()].slice(0, 5).map(([, items]) => {
        const noon = items.reduce((best, it) => {
            const h = (it.dt + tz) % 86400;
            const hb = (best.dt + tz) % 86400;
            return Math.abs(h - 43200) < Math.abs(hb - 43200) ? it : best;
        });
        return {
            dt: noon.dt,
            min: Math.min(...items.map((i) => i.main.temp_min)),
            max: Math.max(...items.map((i) => i.main.temp_max)),
            pop: Math.max(...items.map((i) => i.pop || 0)),
            icon: noon.weather[0].icon.replace('n', 'd'),
            description: noon.weather[0].description
        };
    });
}
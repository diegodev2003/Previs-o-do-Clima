import { keyApi, BASE_URL } from '../config/configApi.js';

export class ApiError extends Error {
    constructor(type, status) {
        super(type);
        this.name = 'ApiError';
        this.type = type;
        this.status = status;
    }
}

function typeFromStatus(status) {
    if (status === 400) return 'badRequest';
    if (status === 401) return 'auth';
    if (status === 404) return 'notFound';
    if (status === 429) return 'limit';
    return 'server';
}

async function request(path, params, signal) {
    const qs = new URLSearchParams({ ...params, appid: keyApi, units: 'metric', lang: 'pt_br' });
    let res;
    
    try {
        res = await fetch(`${BASE_URL}/${path}?${qs}`, { signal });
    } catch (e) {
        if (e.name === 'AbortError') throw e;
        throw new ApiError(navigator.onLine === false ? 'offline' : 'network');
    }
    
    if (!res.ok) throw new ApiError(typeFromStatus(res.status), res.status);
    
    try {
        return await res.json();
    } catch {
        throw new ApiError('server', res.status);
    }
}

/**
 * place: { city: "Fortaleza" }  ou  { lat, lon }
 * Clima atual é obrigatório; a previsão dos próximos dias é opcional (se falhar, segue sem ela).
 */
export async function fetchWeather(place, signal) {
    const params = place.city ? { q: place.city } : { lat: place.lat, lon: place.lon };
    
    const [current, forecast] = await Promise.all([
        request('weather', params, signal),
        request('forecast', params, signal).catch((e) => {
            if (e.name === 'AbortError') throw e;
            return null;
        })
    ]);
    
    return { current, forecast };
}
import { root } from '../mapDom/dom.js';
import { ICON_URL } from '../config/configApi.js';
import { escapeHtml, temp, wind, cityTime, cityWeekday, localTime, dailyForecast } from './format.js';

const droplet = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5S5 10.1 5 14.6A7 7 0 0 0 19 14.6C19 10.1 12 2.5 12 2.5z" fill="rgb(116,192,252)"/></svg>';

export function renderEmpty() {
  root.setAttribute('aria-busy', 'false');
  root.innerHTML = `<p class="empty">Busque uma cidade ou toque em 📍 para usar sua localização.</p>`;
}

export function renderLoading() {
  root.setAttribute('aria-busy', 'true');
  root.innerHTML = `<div class="weather-card skeleton" aria-label="Carregando"><span class="spinner"></span></div>`;
}

/**
 * data: { current, forecast }
 * opts: { unit: 'metric'|'imperial', stale: boolean }
 */
export function render(data, { unit = 'metric', stale = false } = {}) {
  const c = data.current;
  const w = c.weather[0];
  const tz = c.timezone || 0;
  const days = dailyForecast(data.forecast, tz, c.dt);
  
  const forecastHtml = days.length ? `
    <section class="forecast">
      <h3 class="forecast-title">Próximos dias</h3>
      <ul class="forecast-list">
        ${days.map((d) => `
          <li class="forecast-day">
            <span class="fd-name">${escapeHtml(cityWeekday(d.dt, tz))}</span>
            <img src="${ICON_URL(escapeHtml(d.icon), '2x')}" alt="${escapeHtml(d.description)}" title="${escapeHtml(d.description)}" width="44" height="44" loading="lazy">
            <span class="fd-max">${temp(d.max, unit)}</span>
            <span class="fd-min">${temp(d.min, unit)}</span>
            ${d.pop >= 0.2 ? `<span class="fd-pop">💧${Math.round(d.pop * 100)}%</span>` : ''}
          </li>`).join('')}
      </ul>
    </section>` : '';
  
  const html = `
  <article class="weather-card">

    <header class="weather-header">
      <figure class="weather-icon">
        <img src="${ICON_URL(escapeHtml(w.icon))}" alt="${escapeHtml(w.description)}" width="140" height="140">
      </figure>

      <section class="weather-main-info">
        <h2 class="weather-title">${escapeHtml(c.name)} - ${escapeHtml(c.sys.country)}</h2>
        <p class="weather-time">${escapeHtml(cityWeekday(c.dt, tz, 'long'))}, ${escapeHtml(cityTime(c.dt, tz))} (hora local)</p>
        <p class="weather-temp">${temp(c.main.temp, unit)}</p>
        <p class="weather-descript">${escapeHtml(w.description)}</p>
        <p class="weather-range">↓ ${temp(c.main.temp_min, unit)} &nbsp; ↑ ${temp(c.main.temp_max, unit)}</p>
      </section>
    </header>

    <dl class="weather-details">
      <div class="detail weather-umidity"><dt class="umidity-title">Umidade ${droplet}</dt><dd class="umidity">${c.main.humidity}%</dd></div>
      <div class="detail"><dt>Sensação</dt><dd>${temp(c.main.feels_like, unit)}</dd></div>
      <div class="detail"><dt>Vento</dt><dd>${wind(c.wind?.speed ?? 0, unit)}</dd></div>
      <div class="detail"><dt>Pressão</dt><dd>${c.main.pressure} hPa</dd></div>
      <div class="detail"><dt>Nascer do sol</dt><dd>${c.sys.sunrise ? escapeHtml(cityTime(c.sys.sunrise, tz)) : '--'}</dd></div>
      <div class="detail"><dt>Pôr do sol</dt><dd>${c.sys.sunset ? escapeHtml(cityTime(c.sys.sunset, tz)) : '--'}</dd></div>
    </dl>

    ${forecastHtml}

    <p class="info">${stale ? '💾 Dados salvos de ' : 'Atualizado às '}${escapeHtml(localTime(c.dt))}</p>

  </article>`;
  
  root.setAttribute('aria-busy', 'false');
  root.innerHTML = html;
}
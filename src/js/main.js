import { form, input, btnLocation, unitToggle } from './mapDom/dom.js';
import { fetchWeather } from './services/callApi.js';
import { load, save } from './services/storage.js';
import { alertModal } from './components/modalAlert.js';
import { soundSuccess } from './components/soundOk.js';
import { render, renderEmpty, renderLoading } from './tasks/render.js';

let unit = load('unit', 'metric') === 'imperial' ? 'imperial' : 'metric';
let current = null; // último resultado exibido { current, forecast }
let controller = null; // permite cancelar a busca anterior (evita resposta antiga sobrescrever a nova)

function refreshUnitButton() {
  unitToggle.textContent = unit === 'imperial' ? '°F' : '°C';
}

// Não desabilitamos o botão: assim dá para corrigir a cidade durante uma busca lenta
// (a busca anterior é cancelada pelo AbortController).
function setBusy(busy) {
  form.classList.toggle('busy', busy);
}

let geoRequest = 0; // descarta resposta de localização se o usuário buscou outra coisa depois

async function search(place, { silentSound = false } = {}) {
  controller?.abort();
  const mine = new AbortController();
  controller = mine;
  
  setBusy(true);
  renderLoading();
  
  try {
    const data = await fetchWeather(place, mine.signal);
    if (mine.signal.aborted) return;
    
    current = data;
    render(data, { unit });
    save('lastData', data);
    save('lastPlace', place.city ? { city: place.city } : { lat: place.lat, lon: place.lon });
    if (!silentSound) soundSuccess();
    
  } catch (e) {
    if (e.name === 'AbortError' || mine.signal.aborted) return;
    
    const type = e.type || 'network';
    const saved = load('lastData');
    
    // Sem rede: mostra a última consulta salva em vez de deixar a tela vazia
    if ((type === 'network' || type === 'offline') && saved?.current) {
      current = saved;
      render(saved, { unit, stale: true });
      alertModal('offlineCached');
    } else {
      current ? render(current, { unit }) : renderEmpty();
      alertModal(type);
    }
    console.error(e);
    
  } finally {
    if (controller === mine) setBusy(false);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const city = input.value.trim().replace(/\s+/g, ' ');
  
  if (!city) {
    alertModal('warning');
    input.focus();
    return;
  }
  
  geoRequest++;
  input.blur(); // fecha o teclado no celular
  search({ city });
});

if ('geolocation' in navigator) {
  btnLocation.hidden = false;
  
  btnLocation.addEventListener('click', () => {
    const id = ++geoRequest;
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (id !== geoRequest) return;
        input.value = '';
        search({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        if (id !== geoRequest) return;
        setBusy(false);
        alertModal(err.code === 1 ? 'geoDenied' : 'geoUnavailable');
      }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  });
}

unitToggle.addEventListener('click', () => {
  unit = unit === 'metric' ? 'imperial' : 'metric';
  save('unit', unit);
  refreshUnitButton();
  if (current) render(current, { unit });
});

// Início: reabre a última busca; se não houver, mostra a dica
refreshUnitButton();
const lastPlace = load('lastPlace');
if (lastPlace) {
  if (lastPlace.city) input.value = lastPlace.city;
  search(lastPlace, { silentSound: true });
} else {
  renderEmpty();
}

// PWA: funciona offline para a "casca" do app (só em http/https)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
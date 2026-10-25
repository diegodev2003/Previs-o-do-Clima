import { alertTypes } from '../config/configModalAlert.js';
import { alert, titleAlert, messageAlert, iconAlert } from '../mapDom/dom.js';

let timeId;
const timer = 3500;

export function alertModal(type, message) {
    
    const config = alertTypes[type];
    
    if (!config) {
        console.error(type, ", Tipo de validação invalido!");
        return;
    }
    
    // vibrate não existe em iOS/desktop: nunca pode quebrar o aviso
    try {
        if (typeof navigator.vibrate === 'function') navigator.vibrate(90);
    } catch { /* ignora */ }
    
    alert.dataset.kind = config.kind || 'info';
    iconAlert.textContent = config.icon || '';
    titleAlert.textContent = config.title;
    messageAlert.textContent = message || config.message;
    
    clearTimeout(timeId);
    alert.classList.remove("hidden");
    
    timeId = setTimeout(() => {
        alert.classList.add("hidden");
    }, timer);
}
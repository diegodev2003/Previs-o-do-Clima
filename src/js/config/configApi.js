// ATENÇÃO: esta chave fica visível no navegador (app 100% front-end).
// No painel da OpenWeather use uma chave exclusiva deste app e, se possível,
// regenere-a caso o projeto seja publicado. Para esconder de verdade só com um backend/proxy.
export const keyApi = "552c00ab853e988eb97637ded0156031";

export const BASE_URL = "https://api.openweathermap.org/data/2.5";
export const ICON_URL = (code, size = "4x") => `https://openweathermap.org/img/wn/${code}@${size}.png`;

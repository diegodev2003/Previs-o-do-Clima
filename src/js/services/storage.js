// localStorage pode lançar erro (modo privado, dados bloqueados): tudo protegido.
export function load(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { /* ignora */ }
}

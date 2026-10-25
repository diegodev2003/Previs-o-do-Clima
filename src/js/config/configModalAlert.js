// kind controla a cor do aviso (success | error | warning | info)
export const alertTypes = {
    success: { kind: "success", title: "Sucesso", message: "Operação realizada com sucesso.", icon: "✅" },
    error: { kind: "error", title: "Erro", message: "Cidade não encontrada. Confira o nome e tente de novo.", icon: "🚨" },
    notFound: { kind: "error", title: "Cidade não encontrada", message: "Confira o nome da cidade e tente de novo.", icon: "🚨" },
    warning: { kind: "warning", title: "Atenção", message: "Digite sua cidade no campo!", icon: "⚠️" },
    badRequest: { kind: "error", title: "Busca inválida", message: "Não consegui entender essa busca.", icon: "🚨" },
    auth: { kind: "error", title: "Chave de API inválida", message: "A chave da OpenWeather foi recusada. Verifique configApi.js.", icon: "🔑" },
    limit: { kind: "warning", title: "Limite excedido", message: "Muitas consultas seguidas. Aguarde um minuto e tente de novo.", icon: "⏳" },
    server: { kind: "error", title: "Serviço indisponível", message: "O serviço de clima está com problemas. Tente em instantes.", icon: "🛠️" },
    network: { kind: "error", title: "Falha de conexão", message: "Não consegui falar com o servidor. Verifique sua internet.", icon: "📡" },
    offline: { kind: "warning", title: "Sem internet", message: "Você está offline.", icon: "📡" },
    offlineCached: { kind: "info", title: "Sem internet", message: "Mostrando a última consulta salva.", icon: "💾" },
    geoDenied: { kind: "warning", title: "Localização bloqueada", message: "Permita o acesso à localização ou digite a cidade.", icon: "📍" },
    geoUnavailable: { kind: "warning", title: "Localização indisponível", message: "Não consegui obter sua posição. Digite a cidade.", icon: "📍" }
};
export const HOST =
    import.meta.env.PROD === true
        ? "https://voteapi.ch1ck.xyz"
        : "http://localhost:28282";

export const API_VOTE    = HOST + "/api/vote";
export const API_RESULT  = HOST + "/api/result";
export const API_JOIN    = HOST + "/api/join";
export const API_OPTIONS = HOST + "/api/options";
export const API_QRCODE  = HOST + "/api/qrcode";
export const API_SELECT  = HOST + "/api/select";
export const API_STATUS  = HOST + "/api/status";

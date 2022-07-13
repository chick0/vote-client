import Cookies from "js-cookie";
import { Buffer } from "buffer/";

export function removeToken(vote_id) {
    Cookies.remove(vote_id.toString());
    sessionStorage.removeItem(`qrcode:${vote_id}`);
}

export function setToken(vote_id, token) {
    Cookies.set(vote_id.toString(), token, { expires: 1 });
}

export function getPayload(token) {
    if (token == undefined) {
        return undefined;
    }

    if (token.split(".").length != 3) {
        return undefined;
    }

    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

function checkAndGetToken(vote_id) {
    let token = Cookies.get(vote_id.toString());
    let payload = getPayload(token);
    if (payload == undefined) {
        return undefined;
    }

    let now = new Date().getTime() / 1000;

    if (now > payload.exp) {
        removeToken(vote_id);
        alert("해당 투표는 삭제되었습니다.");
        return undefined;
    }

    return token;
}

export function getToken(vote_id) {
    let token = checkAndGetToken(vote_id);

    if (token != undefined) {
        localStorage.setItem("last", vote_id);
        return "Bearer " + token;
    } else {
        return undefined;
    }
}

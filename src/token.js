import { Buffer } from "buffer/";

export function setToken(vote_id, token, title) {
    localStorage.setItem(`vote:${vote_id}`, token);
    localStorage.setItem(`title:${vote_id}`, title);
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
    let token = localStorage.getItem(`vote:${vote_id}`);

    let payload = getPayload(token);
    if (payload == undefined) {
        return undefined;
    }

    let now = new Date().getTime() / 1000;

    if (now > payload.exp) {
        localStorage.removeItem(`vote:${vote_id}`);
        localStorage.removeItem(`title:${vote_id}`);
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

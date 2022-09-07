import Cookies from "js-cookie";
import { Buffer } from "buffer/";

/**
 * Remove the vote token from Cookies
 *
 * @param {number} vote_id
 */
export function removeToken(vote_id) {
    Cookies.remove(vote_id.toString());
    sessionStorage.removeItem(`qrcode:${vote_id}`);
}

/**
 * Save the vote token in the Cookies
 *
 * @param {number} vote_id
 * @param {string} token
 */
export function setToken(vote_id, token) {
    Cookies.set(vote_id.toString(), token, { expires: 1 });
}

/**
 * Get payload from token (=parse token)
 *
 * @param {string} token
 * @returns {Object|undefined} token payload or undefined
 */
export function getPayload(token) {
    if (token == undefined) {
        return undefined;
    }

    if (token.split(".").length != 3) {
        return undefined;
    }

    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

/**
 * Get token from Cookies and check expiration time
 *
 * @param {number} vote_id
 * @returns {string|undefined} token or undefined
 */
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

/**
 * Get token from Cookies and set the last viewed vote id
 *
 * @param {number} vote_id
 * @returns {string|undefined} token or undefined
 */
export function getToken(vote_id) {
    let token = checkAndGetToken(vote_id);

    if (token != undefined) {
        localStorage.setItem("last", vote_id.toString());
        return "Bearer " + token;
    } else {
        return undefined;
    }
}

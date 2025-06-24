import { jwtDecode } from "jwt-decode";

interface DecodeedToken {
    exp: number;
}

export const isTokenValid = (token: string) => {
    try {
        const decoded: DecodeedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime;
    } catch (error) {
        return false;
    }
}
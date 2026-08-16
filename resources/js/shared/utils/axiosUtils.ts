import axios from "axios";

export const axiosClient = axios.create({
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

//==================================================| Sanctum API (token-based)
export type SanctumTokenType = 'user' | 'personnel';

const sanctumTokenStorageKey: Record<SanctumTokenType, string> = {
    user: 'tokenUser',
    personnel: 'tokenPersonnel',
};

/**
 * @param tokenType
 * @example
 * const apiUser = axiosApi('user')
 * const response = await apiUser.get('/profile')
 */
export function axiosApi(tokenType: SanctumTokenType) {
    const apiToken = localStorage.getItem(sanctumTokenStorageKey[tokenType]) ?? '';

    return axios.create({
        baseURL: '/api',
        withCredentials: true,
        withXSRFToken: true,
        headers: {
            Authorization: `Bearer ${apiToken}`,
        },
    });
}

export interface UserTokenPayload {
    name?: string;
    fullName?: string;
    given_name?: string;
    family_name?: string;
    email?: string;
    phoneNumber?: string;
    phone_number?: string;
    unique_name?: string;
    upn?: string;
    sub?: string;           // çox vaxt userId burada olur
    nameid?: string;        // bəzi JWT-lərdə NameIdentifier
    socialLinks?: []
}

export interface User {
    name: string;
    email: string;
    phone: string;
    userId: string;
    socialMediaLinks?: [];
}

export const getUserFromToken = (token: string | null): User | null => {
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const payload: UserTokenPayload = JSON.parse(jsonPayload);

        const name =
            payload.name ||
            payload.fullName ||
            [payload.given_name, payload.family_name].filter(Boolean).join(' ').trim() ||
            payload.unique_name ||
            payload.sub ||
            'İstifadəçi';

        const email = payload.email || payload.unique_name || payload.upn || 'email mövcud deyil';
        const phone = payload.phoneNumber || 'Telefon mövcud deyil';
        const userId = payload.sub || payload.nameid || payload.unique_name || '';
        const socialMediaLinks = payload.socialLinks;

        return { name, email, phone, userId, socialMediaLinks };
    } catch {
        return null;
    }
};

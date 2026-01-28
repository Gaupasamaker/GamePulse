export const ADMIN_EMAILS = ['jonllaguno@gmail.com'];

export const IS_ADMIN = (email?: string | null) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
};

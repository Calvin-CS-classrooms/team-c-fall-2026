export function isCalvinEmail(email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    return /^[a-z0-9._%+-]+@calvin\.edu$/.test(normalizedEmail);
}
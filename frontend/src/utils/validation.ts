/**
 * Validation utilities
 */

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

export function validateEmail(email: string): ValidationResult {
    if (!email) {
        return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
    if (!password) {
        return { valid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters' };
    }

    // Optional: Add complexity checks if needed
    // if (!/[A-Z]/.test(password)) {
    //   return { valid: false, error: 'Password must contain at least one uppercase letter' };
    // }
    // if (!/[0-9]/.test(password)) {
    //   return { valid: false, error: 'Password must contain at least one number' };
    // }

    return { valid: true };
}

/**
 * Validation utilities for form inputs with strong validation rules
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}



export const validateEmail = (email: string): ValidationResult => {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // More comprehensive email validation
  const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return { valid: false, error: 'Email cannot contain consecutive dots' };
  }

  // Check for starting or ending with dot
  const [localPart, domain] = trimmedEmail.split('@');
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { valid: false, error: 'Email local part cannot start or end with a dot' };
  }

  // Basic domain validation - must have valid structure
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { valid: false, error: 'Email domain must have at least one dot (e.g., example.com)' };
  }

  if (domainParts.some(part => !part || part.length < 1)) {
    return { valid: false, error: 'Invalid domain format' };
  }

  // Validate domain parts (alphanumeric and hyphens only)
  const validDomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!domainParts.every(part => validDomainRegex.test(part))) {
    return { valid: false, error: 'Invalid domain format' };
  }

  // TLD must be at least 2 characters and not just numbers
  const tld = domainParts[domainParts.length - 1];
  if (!/^[a-z]{2,}$/.test(tld)) {
    return { valid: false, error: 'Invalid top-level domain (TLD)' };
  }

  return { valid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password must not exceed 128 characters' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const missingRequirements = [];
  if (!hasUpperCase) missingRequirements.push('uppercase letter');
  if (!hasLowerCase) missingRequirements.push('lowercase letter');
  if (!hasNumber) missingRequirements.push('number');
  if (!hasSpecialChar) missingRequirements.push('special character (!@#$%^&*, etc.)');

  if (missingRequirements.length > 0) {
    return {
      valid: false,
      error: `Password must contain at least one ${missingRequirements.join(', one ')}`,
    };
  }



  // Check for repeated characters (e.g., aaaa, 1111)
  if (/(.)\1{3,}/.test(password)) {
    return { valid: false, error: 'Password contains too many repeated characters' };
  }

  // Check for sequential characters (e.g., abcd, 1234)
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    return { valid: false, error: 'Password contains sequential characters. Please choose a different password' };
  }

  return { valid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { valid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    return { valid: false, error: 'Name must be at least 3 characters long' };
  }

  if (trimmedName.length > 60) {
    return { valid: false, error: 'Name must not exceed 60 characters' };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  // Check for numbers
  if (/\d/.test(trimmedName)) {
    return { valid: false, error: 'Name cannot contain numbers' };
  }

  // Check for multiple consecutive spaces
  if (/\s{2,}/.test(trimmedName)) {
    return { valid: false, error: 'Name cannot contain multiple consecutive spaces' };
  }

  // Check if name looks valid (not just special characters)
  const lettersOnly = trimmedName.replace(/[^a-zA-Z]/g, '');
  if (lettersOnly.length < 3) {
    return { valid: false, error: 'Name must contain at least 3 letters' };
  }

  // Prevent single character words that are too short
  const words = trimmedName.split(/\s+/);
  if (words.some(word => word.length === 1 && word !== "'" && word !== "-")) {
    return { valid: false, error: 'Name parts must be at least 2 characters long' };
  }

  return { valid: true };
};

export const validateLoginForm = (email: string, password: string) => {
  const errors: { email?: string; password?: string } = {};

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error;
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateRegisterForm = (email: string, password: string, name: string) => {
  const errors: { email?: string; password?: string; name?: string } = {};

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error;
  }

  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    errors.name = nameValidation.error;
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

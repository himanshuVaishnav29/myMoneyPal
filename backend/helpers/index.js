import { validate } from 'deep-email-validator';

export const formatName = (name) => {
    if (!name) return '';
    const [firstName, ...lastNameParts] = name.split(' ');
    const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const formattedLastName = lastNameParts.join(' ').toLowerCase();
    return `${formattedFirstName} ${formattedLastName}`;
};

/**
 * Comprehensive list of known disposable/temporary email domains
 * This is a backup check if deep-email-validator misses any
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
    // Well-known temporary email services
    '10minutemail.com',
    '10minutemail.co.uk',
    'tempmail.com',
    'tempmail.org',
    'guerrillamail.com',
    'guerrillamail.net',
    'guerrillamail.org',
    'mailinator.com',
    'throwaway.email',
    'trashmail.com',
    'maildrop.cc',
    'spam4.me',
    'fakeinbox.com',
    'mailnesia.com',
    '10minemail.com',
    'yopmail.com',
    'tempmail.us',
    'temp-mail.org',
    'temp-mail.io',
    'dispostable.com',
    'pokemail.net',
    'sharklasers.com',
    'grr.la',
    'guerrillamail.info',
    'guerrillamail.biz',
    'getnada.com',
    'maildrop.cc',
    'emailondeck.com',
    'temporaryemail.com',
    'mytrashmail.com',
    'dropmail.me',
    'dropmeon.com', // Recently added
    'mailvoid.com',
    'nada.email',
    'fakeemail.com',
    'minitemp.email',
    'temp.email',
    'protonmailrmez3lotccipshtkleegetolb73fuirgj7r4o4vfu7ozyd.onion',
    '10minutemail.net',
    'mailnesia.com',
    'trashmail.de',
    'temp-mail.asia',
    'tempemails.org',
    'throwawaymail.com',
    'bury.me',
    'emaildrop.org',
    'mockemail.com',
    'moakt.com',
    'temp.email',
    'tempmail.email',
    'inbox.lt',
]);

/**
 * Validates email robustly using deep-email-validator + disposable domain list
 * Checks:
 * - Format validity
 * - Disposable/temporary email domains (both via API and local list)
 * - MX record verification (ensures domain can receive email)
 * 
 * @param {string} email - Email to validate
 * @returns {Promise<{isValid: boolean, error: string|null}>}
 */
export const validateEmail = async (email) => {
    try {
        // Basic format check first (quick fail)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return { 
                isValid: false, 
                error: "Please enter a valid email address" 
            };
        }

        const emailDomain = email.split('@')[1]?.toLowerCase();

        // Quick check against local disposable domains list FIRST
        if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
            console.warn(`Disposable email detected (local list): ${email}`);
            return { 
                isValid: false, 
                error: "Disposable/temporary emails are not allowed. Please use a permanent email address" 
            };
        }

        // Deep validation with timeout protection (max 5 seconds)
        try {
            const validationPromise = validate({
                email,
                validateRegex: true,
                validateMx: true,
                validateTypo: false,
                validateDisposable: true
            });

            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Validation timeout')), 5000)
            );

            const { valid, reason } = await Promise.race([validationPromise, timeoutPromise]);

            if (!valid) {
                console.warn(`Email validation failed for ${email}: ${reason}`);
                
                // Provide user-friendly error messages based on reason
                const errorMessages = {
                    'invalid_email': 'Please enter a valid email address',
                    'invalid_domain': 'This email domain is not valid',
                    'no_mx_records': 'This email domain cannot receive emails',
                    'invalid_mxhost': 'This email domain cannot receive emails',
                    'disposable_email': 'Disposable/temporary emails are not allowed. Please use a permanent email address',
                    'smtp_error': 'Unable to verify email. Please try again',
                };

                const userError = errorMessages[reason] || 'This email address is invalid or cannot receive emails';
                return { 
                    isValid: false, 
                    error: userError 
                };
            }

            return { isValid: true, error: null };
        } catch (deepValidationError) {
            console.warn(`Deep email validation error (will fallback to format check): ${deepValidationError.message}`);
            
            // If deep validation fails/times out, fall back to basic validation
            // but DO NOT accept if it's in disposable list
            if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
                return { 
                    isValid: false, 
                    error: "Disposable/temporary emails are not allowed. Please use a permanent email address" 
                };
            }

            // Only accept if domain looks legitimate (has mx records implied by having a dot)
            if (emailDomain.includes('.')) {
                console.log(`Email validation passed (basic check, deep validation unavailable): ${email}`);
                return { isValid: true, error: null };
            }

            return { 
                isValid: false, 
                error: "Please enter a valid email address" 
            };
        }
    } catch (error) {
        console.error('Email validation error:', error);
        
        // Last resort: basic validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return { 
                isValid: false, 
                error: "Please enter a valid email address" 
            };
        }
        
        const emailDomain = email.split('@')[1]?.toLowerCase();
        if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
            return { 
                isValid: false, 
                error: "Disposable/temporary emails are not allowed. Please use a permanent email address" 
            };
        }
        
        return { isValid: true, error: null };
    }
};
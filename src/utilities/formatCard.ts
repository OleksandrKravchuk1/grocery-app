export type CardValidationError = {
    title: string;
    message: string;
};

export type CardProps = {
    cardNumber: string;
    expiry: string;
    cvc: string;
    now: Date;
};

export function onlyDigits(value: string) {
    return value.replace(/\D/g, '');
}

export function formatCardNumber(value: string) {
    const digits = onlyDigits(value).slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value: string) {
    const digits = onlyDigits(value).slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCvc(value: string) {
    return onlyDigits(value).slice(0, 4);
}

export function isValidLuhn(cardNumber: string) {
    const digits = onlyDigits(cardNumber);
    if (digits.length < 12 || digits.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = Number(digits[i]);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

export function isValidExpiry(expiry: string, now = new Date()) {
    const digits = onlyDigits(expiry);
    if (digits.length !== 4) return false;

    const month = Number(digits.slice(0, 2));
    const year = Number(digits.slice(2, 4));

    if (!Number.isFinite(month) || !Number.isFinite(year)) return false;
    if (month < 1 || month > 12) return false;

    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    return !(year === currentYear && month < currentMonth);
}

export function validateCardPaymentDetails({cardNumber, expiry, cvc, now = new Date()}: CardProps): CardValidationError | null {
    const cardDigits = onlyDigits(cardNumber);
    if (cardDigits.length < 16) {
        return {
            title: "Invalid card number",
            message: "Enter all 16 digits of your card number.",
        };
    }

    if (!isValidLuhn(cardDigits)) {
        return {
            title: "Invalid card number",
            message: "Card number failed validation. Please check the digits.",
        };
    }

    const expiryDigits = onlyDigits(expiry);
    if (expiryDigits.length < 4) {
        return {
            title: "Invalid expiry",
            message: "Enter expiry date in MM/YY format.",
        };
    }

    if (!isValidExpiry(expiry, now)) {
        return {
            title: "Invalid expiry",
            message: "Card expiry date is invalid or already expired.",
        };
    }

    const cvcDigits = onlyDigits(cvc);
    if (cvcDigits.length < 3) {
        return {
            title: "Invalid CVC",
            message: "CVC must contain at least 3 digits.",
        };
    }

    return null;
}

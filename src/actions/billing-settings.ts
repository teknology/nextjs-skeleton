'use server'
export async function getBillingSettings() {
    try {
        return null;

    }
    catch (error) {
        console.error('Failed to fetch billing settings:', error);
        throw new Error('Failed to fetch billing settings.');
    }
}
export async function getAccountSettings() {
    try {
        return null;

    }
    catch (error) {
        console.error('Failed to fetch account settings:', error);
        throw new Error('Failed to fetch account settings.');
    }
}
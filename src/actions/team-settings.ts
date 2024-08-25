export async function getTeamSettings() {
    try {
        return null;

    }
    catch (error) {
        console.error('Failed to fetch team member settings:', error);
        throw new Error('Failed to fetch team member settings.');
    }
}
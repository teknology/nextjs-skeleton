import createNextIntlPlugin from 'next-intl/plugin';
 
// Set a default time zone (e.g., 'UTC' or a specific time zone like 'America/New_York')
const withNextIntl = createNextIntlPlugin();

const nextConfig = {

};

export default withNextIntl(nextConfig);
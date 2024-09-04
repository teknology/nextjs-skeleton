import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div className="container mx-auto space-y-1">
      <h1>{t('title')}</h1>
    </div>
  );
}

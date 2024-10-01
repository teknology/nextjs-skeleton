import {useTranslations} from 'next-intl';
import PageTitle from '@/app/components/common/page-title';
import HomeHero from '@/app/components/common/home-hero';


export default function Index() {
  const t = useTranslations('index');
  return (
    <div>
      <PageTitle>{t('title')}</PageTitle>
      <HomeHero />
    </div>
  )
}

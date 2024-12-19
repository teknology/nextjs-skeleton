import PageTitle from '@/app/components/common/page-title';
import HomeHero from '@/app/components/common/public/home-hero';
import NotificationBar from '@/app/components/common/notification-bar';
import Features from '@/app/components/common/public/home/features';


export default function Index() {
  return (
    <div>
      <NotificationBar />
      <HomeHero />
      <Features />
    </div>
  )
}

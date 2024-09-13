import { redirect } from 'next/navigation';

export default function SettingsPage() {
  // Server-side redirect
  redirect('/my-account/settings/profile');
}
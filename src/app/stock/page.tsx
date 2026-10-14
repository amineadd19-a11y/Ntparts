import { redirect } from 'next/navigation';

/** Stock is no longer a public website feature. */
export default function StockPage() {
  redirect('/parts');
}

import { useRouter } from 'next/router';
import ViewPDF from '../../components/ViewPDF';

export default function PDFViewPage() {
  const router = useRouter();
  const { id } = router.query;

  return <ViewPDF />;
}
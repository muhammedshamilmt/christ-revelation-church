'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

function ErrorToastLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (error === 'unauthorized') {
      toast.error("You don't have access to the church admin panel.", {
        duration: 4500,
        style: {
          borderRadius: '20px',
          background: '#fff',
          color: '#111',
          fontWeight: 600,
          border: '1px solid #fee2e2',
          padding: '12px 18px',
          fontSize: '13px',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      });

      router.replace('/', { scroll: false });
    } else if (error === 'oauth_error') {
      const displayMsg = message 
        ? decodeURIComponent(message)
        : 'Google OAuth configuration error in Supabase.';

      toast.error(displayMsg, {
        duration: 6000,
        style: {
          borderRadius: '20px',
          background: '#fff',
          color: '#111',
          fontWeight: 600,
          border: '1px solid #fed7aa',
          padding: '12px 18px',
          fontSize: '13px',
        },
        iconTheme: {
          primary: '#f97316',
          secondary: '#fff',
        },
      });

      router.replace('/', { scroll: false });
    }
  }, [searchParams, router]);

  return null;
}

export default function ErrorToastHandler() {
  return (
    <Suspense fallback={null}>
      <ErrorToastLogic />
    </Suspense>
  );
}

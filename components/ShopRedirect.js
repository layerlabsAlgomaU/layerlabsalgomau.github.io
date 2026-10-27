'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Sends the visitor from the old /shop address to the ready-made items. Shows nothing itself.
export default function ShopRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/request/#ready-made');
    }, [router]);

    return null;
}

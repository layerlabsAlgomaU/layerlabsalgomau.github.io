import Link from 'next/link';
import Image from 'next/image';

// The round logo in the header: a link to the home page.
// The fade-out while a mouse pointer is over it is all CSS (see "Logo" in globals.css).
export default function LogoLink() {
    return (
        <Link href="/" prefetch={false} className="logo" aria-label="LayerLabs home">
            <span className="logo-ring" aria-hidden="true"></span>
            <span className="logo-disc">
                <Image src="/images/logo.png" alt="" width={46} height={46} priority />
            </span>
        </Link>
    );
}

import Image from 'next/image';

// A grid of print photos. Pass the list from data/prints.js (or part of it).
export default function PrintGallery({ items }) {
    return (
        <ul className="print-gallery">
            {items.map((item) => (
                <li key={item.src}>
                    <Image src={item.src} width={item.width} height={item.height} alt={item.alt}
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw" />
                </li>
            ))}
        </ul>
    );
}

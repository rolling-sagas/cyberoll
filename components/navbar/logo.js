import Link from 'next/link';
import { CinnamonRollIcon } from '@hugeicons/react';

export default function Logo({className = '', size = 24}) {
  return (
    <Link className={`logo ${className}`} href="/">
      <CinnamonRollIcon strokeWidth="2.5" size={size}/>
    </Link>
  );
}

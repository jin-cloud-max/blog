/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Link from 'next/link';

import styles from './header.module.scss';

export function Header() {
   return (
      <header className={styles.container}>
         <div className={styles.content}>
            <Link href="/">
               <a>
                  <img src="/images/Logo.svg" alt="spacetraveling" />
               </a>
            </Link>
         </div>
      </header>
   );
}

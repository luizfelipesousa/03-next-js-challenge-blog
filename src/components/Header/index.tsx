import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

interface HeaderProps {
  source?: boolean;
}

export default function Header({ source = true }: HeaderProps) {
  // TODO
  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Link href="/">
        <img
          src={source ? '/images/logo-w.svg' : '/images/logo.svg'}
          alt="logo"
        />
      </Link>
    </div>
  );
}

import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header() {
  // TODO
  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Link href="/">
        <img src="/images/logo.svg" alt="logo" />
      </Link>
    </div>
  );
}

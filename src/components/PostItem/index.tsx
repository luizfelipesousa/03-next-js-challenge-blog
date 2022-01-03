import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import styles from './styles.module.scss';

interface PostProps {
  post: {
    id: string;
    uid?: string;
    first_publication_date: string | null;
    data: {
      title: string | 'null';
      subtitle: string;
      author: string;
    };
  };
}

export default function PostItem({ post }: PostProps) {
  const postData = post.data;
  return (
    <div className={styles.container}>
      <Link href={`/post/${post.uid}`}>
        <a>
          <h2>{postData.title}</h2>
          <p>{postData.subtitle}</p>
          <div className={styles.postInfoContainer}>
            <div className={styles.postInfo}>
              <FiCalendar size={20} />
              <time>
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
            </div>
            <div className={styles.postInfo}>
              <FiUser size={20} />
              <span>{postData.author}</span>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}

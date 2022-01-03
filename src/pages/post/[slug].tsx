import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  // TODO
  const postContent = post.data.content.map(content => {
    const { heading } = content;
    const body = RichText.asHtml(content.body);
    const bodyAsText = RichText.asText(content.body).split(' ');
    const headingAsText = content.heading.split(' ');

    const words = bodyAsText.length + headingAsText.length;

    return {
      heading,
      body,
      words,
    };
  });

  const minutes = postContent.reduce((a, b) => {
    return a.words + b.words;
  });

  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Carregando...</div>;
  }
  return (
    <>
      <Header />
      <div className={styles.bannerContainer}>
        <img src={post.data.banner.url} alt="banner" />
      </div>
      <main className={commonStyles.container}>
        <div className={styles.content}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.postInfoContainer}>
            <div className={commonStyles.postInfo}>
              <FiCalendar size={20} />
              <time>
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
            </div>
            <div className={commonStyles.postInfo}>
              <FiUser size={20} />
              <span>{post.data.author}</span>
            </div>
            <div className={commonStyles.postInfo}>
              <FiClock size={20} />
              <span>{`${Math.floor(Math.round(minutes / 150))} min`}</span>
            </div>
          </div>
          {postContent.map((c, index) => (
            <article className={styles.postContent} key={index}>
              <h2>{c.heading}</h2>
              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{ __html: String(c.body) }}
              />
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.uid'],
      pageSize: 1,
    }
  );

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  // TODO
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;

  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    data: response.data,
    uid: response.uid,
  };

  // TODO
  return {
    props: { post },
  };
};

import { useState } from 'react';
import Prismic from '@prismicio/client';
import Header from '../components/Header';
import PostItem from '../components/PostItem';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  id: string;
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [postPages, setPostPages] = useState(postsPagination);

  async function handleLoadMorePosts() {
    const response = await fetch(postPages.next_page);
    const data = await response.json();
    const newPosts = data.results;
    postPages.results.push(...newPosts);

    const newPostsPagesProps = {
      next_page: data.next_page,
      results: postPages.results,
    };

    setPostPages(newPostsPagesProps);
  }

  return (
    <>
      <Header source={false} />
      <main className={commonStyles.container}>
        <div className={styles.PostList}>
          {postPages.results.map((post, index) => (
            <PostItem post={post} key={index} />
          ))}
        </div>
        {postPages.next_page ? (
          <button
            type="button"
            className={styles.loadMore}
            onClick={() => handleLoadMorePosts()}
          >
            Carregar mais posts
          </button>
        ) : (
          ''
        )}
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 3,
    }
  );

  const postsProps: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };

  return {
    props: { postsPagination: postsProps },
  };
};

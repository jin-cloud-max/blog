/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useState } from 'react';

import { GetStaticProps } from 'next';
import Link from 'next/link';

import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';

import { Header } from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
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
   const [posts, setPosts] = useState<Post[]>(postsPagination.results);
   const [loadMorePosts, setLoadMorePosts] = useState(
      postsPagination.next_page
   );

   async function handleLoadMore() {
      const postsResponse = await fetch(postsPagination.next_page).then(
         response => response.json()
      );

      const newPosts = postsResponse.results.map(post => ({
         uid: post.uid,
         first_publication_date: format(
            new Date(post.first_publication_date),
            'dd MMM yyyy',
            { locale: ptBr }
         ),
         data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author,
         },
      }));

      setPosts([...posts, ...newPosts]);
      setLoadMorePosts(postsResponse.next_page);
   }

   return (
      <>
         <Header />
         <main className={`${commonStyles.common} ${styles.container}`}>
            <div className={styles.posts}>
               {posts.map(post => (
                  <Link key={post.uid} href={`/post/${post.uid}`}>
                     <a>
                        <h2>{post.data.title}</h2>
                        <p>{post.data.subtitle}</p>
                        <div className={styles.postInfos}>
                           <time>
                              <FiCalendar size={20} />
                              <span>{post.first_publication_date}</span>
                           </time>
                           <div>
                              <FiUser size={20} />
                              <span>{post.data.author}</span>
                           </div>
                        </div>
                     </a>
                  </Link>
               ))}
            </div>
            {loadMorePosts && (
               <button
                  type="button"
                  className={styles.loadMore}
                  onClick={handleLoadMore}
               >
                  Carregar mais posts
               </button>
            )}
         </main>
      </>
   );
}

export const getStaticProps: GetStaticProps = async () => {
   const prismic = getPrismicClient();
   const postsResponse = await prismic.query(
      [Prismic.predicates.at('document.type', 'posts')],
      {
         fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
         pageSize: 1,
      }
   );

   const results = postsResponse.results.map(post => {
      return {
         uid: post.uid,
         first_publication_date: format(
            new Date(post.first_publication_date),
            'dd MMM yyyy',
            { locale: ptBr }
         ),
         data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author,
         },
      };
   });

   return {
      props: {
         postsPagination: {
            next_page: postsResponse.next_page,
            results,
         },
      },
   };
};

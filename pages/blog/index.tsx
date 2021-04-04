import React from 'react';
import { Pane, majorScale } from 'evergreen-ui';
import matter from 'gray-matter';
import path from 'path';
import fs from 'fs';
import Container from '../../components/container';
import HomeNav from '../../components/homeNav';
import PostPreview from '../../components/postPreview';
import { posts as postsFromCMS } from '../../content';
import { GetStaticProps } from 'next';

const Blog: React.ReactNode = ({ posts }) => {
  return (
    <Pane>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          {posts.map((post) => (
            <Pane key={post.title} marginY={majorScale(5)}>
              <PostPreview post={post} />
            </Pane>
          ))}
        </Container>
      </main>
    </Pane>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const targetPostsFromCMS = ctx.preview ? postsFromCMS.draft : postsFromCMS.published;
  const cmsPosts = targetPostsFromCMS.map((p) => matter(p).data);
  const postPath = path.resolve(process.cwd(), 'posts');
  const postFiles = fs.readdirSync(postPath);
  const filePosts = postFiles.map((name) => matter(fs.readFileSync(path.resolve(postPath, name), 'utf-8')).data);

  const posts = [...cmsPosts, ...filePosts];

  return { props: { posts } };
};

export default Blog;

/**
 * Need to get the posts from the
 * fs and our CMS
 */

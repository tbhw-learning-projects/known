import React, { FC } from 'react';
import hydrate from 'next-mdx-remote/hydrate';
import { majorScale, Pane, Heading, Spinner } from 'evergreen-ui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Post } from '../../types';
import Container from '../../components/container';
import HomeNav from '../../components/homeNav';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { posts } from '../../content';
import renderToString from 'next-mdx-remote/render-to-string';

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const content = hydrate(source);
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    );
  }
  return (
    <Pane>
      <Head>
        <title>{`Known Blog | ${frontMatter.title}`}</title>
        <meta name="description" content={frontMatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontMatter.title}
          </Heading>
          <Pane>{content}</Pane>
        </Container>
      </main>
    </Pane>
  );
};

BlogPost.defaultProps = {
  source: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
};

/**
 * Need to get the paths here
 * then the the correct post for the matching path
 * Posts can come from the fs or our CMS
 */

export function getStaticPaths() {
  const postPath = path.resolve(process.cwd(), 'posts');
  const postFiles = fs.readdirSync(postPath);
  const slugs = postFiles.map((name) => matter(fs.readFileSync(path.resolve(postPath, name), 'utf-8')).data);

  return { paths: slugs.map(({ slug }) => ({ params: { slug } })), fallback: true };
}

export async function getStaticProps({ params: { slug }, preview }) {
  let post;
  try {
    const postPath = path.resolve(process.cwd(), 'posts', `${slug}.mdx`);
    post = fs.readFileSync(postPath);
  } catch {
    const targetPostsFromCMS = preview ? posts.draft : posts.published;
    const cmsPosts = targetPostsFromCMS.map((p) => matter(p));
    const match = cmsPosts.find(({ data }) => data.slug === slug);
    post = match.content;
  }

  const { data } = matter(post);
  const mdxSource = await renderToString(post, { scope: data });

  return { props: { source: mdxSource, frontMatter: data } };
}

export default BlogPost;

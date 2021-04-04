import React from 'react';
import Document, { Head, Main, NextScript, Html, DocumentContext } from 'next/document';
import { extractStyles } from 'evergreen-ui';
import { RenderPageResult } from 'next/dist/next-server/lib/utils';

interface MyDocumentProps extends RenderPageResult {
  css: string;
  hydrationScript: JSX.Element;
}

export default class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps({ renderPage }: DocumentContext): Promise<RenderPageResult | MyDocumentProps> {
    const page = renderPage();
    const { css, hydrationScript } = extractStyles();

    return {
      ...page,
      css,
      hydrationScript,
    };
  }

  render(): JSX.Element {
    const { css, hydrationScript } = this.props;

    return (
      <Html lang="eng-us">
        <Head>
          <style dangerouslySetInnerHTML={{ __html: css }} />
        </Head>

        <body>
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </Html>
    );
  }
}

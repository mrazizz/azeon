import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Azeon',
  tagline: 'Exploring complexity. Building solutions.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'mrazizz', // Usually your GitHub org/user name.
  projectName: 'P-vs-NP-Explained', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css',
      type: 'text/css',
    },
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'p-vs-np',
          routeBasePath: 'p-vs-np',
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {
        hideable: true,  // ← correct key
      },
    },
    navbar: {
      title: 'Azeon',
      logo: {
        alt: 'Azeon Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'P vs NP Explained',
        },
        { to: '/blog', label: 'Founder Blog', position: 'left' },
        {
          href: 'https://github.com/mrazizz',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Research & Docs',
          items: [
            {
              label: 'The Millennium Prize',
              to: '/docs/intro-millennium-prize',
            },
            {
              label: 'Complexity Zoo',
              to: '/docs/category/complexity-zoo',
            },
            {
              label: 'Azizdevs.',
              href: 'https://mraziz.lemonsqueezy.com',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/mrazizz',
            },
            {
              label: 'Founder Blog',
              href: '/blog',
            },
            {
              label: 'Email',
              href: 'mailto:imrmaziz@gmail.com',
            },
          ],
        },
        {
          title: 'About',
          items: [
            {
              html: `
                <p style="color: var(--ifm-footer-link-color); line-height: 1.6; max-width: 300px; font-size: 0.95rem;">
                  CS student at FC College, Lahore. Founder of Azeon and Azizdevs. Rubik's cube solver. When I am not researching computational complexity or running Azizdevs., I am probably speedsolving a Rubik's cube.
                </p>
              `,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Azeon. Computed in polynomial time in Lahore. Designed by Azizdevs.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

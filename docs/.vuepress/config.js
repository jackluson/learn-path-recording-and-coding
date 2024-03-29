module.exports = {
  base: '/learn-path-recording-and-coding/',
  title: '学习笔记',
  description: '一个记录个人学习的笔记',
  dest: 'dist',
  head: [
    ['meta', { charset: 'UTF-8' }],
    ['link', { rel: 'icon', href: `/favicon.ico` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    [
      'link',
      {
        'http-equiv': 'x-ua-compatible',
        content: 'ie=edge',
      },
    ],
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    ['meta', { name: 'author', content: 'camel_lu' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    [
      'meta',
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0,maximum-scale=1,minimum-scale=1,user-scalable=no',
      },
    ],
    [
      'meta',
      { name: 'keywords', content: '笔记，知识点，回忆，前端，计算机，汇总' },
    ],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        size: '72x72',
        href: '/assets/images/apple-touch-icon-72.png',
      },
    ],
  ],
  serviceWorker: true,
  themeConfig: {
    repo: 'jackluson/learn-path-recording-and-coding',
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav: [
      {
        text: '个人博客',
        link: 'https://jackluson.github.io/',
      },
    ],
    sidebar: [
      {
        title: 'Javascript',
        collapsable: false,
        children: [
          ['javascript/', 'Introduction'],
          'javascript/browser',
          'javascript/eventloop',
          'javascript/further_eventloop',
          'javascript/js-engine',
          'javascript/design-patterns',
        ],
      },
      {
        title: '持续集成&自动化部署',
        collapsable: false,
        children: [
          ['develop-flow/', 'Introduction'],
          'develop-flow/gitlab-with-jenkins',
          'develop-flow/dingtalk-gitlab',
          'develop-flow/travis-test',
        ],
      },
      {
        title: '框架&库',
        collapsable: false,
        children: [
          ['library/', 'Introduction'],
          'library/react-test-library',
          'library/vue-cli3-typescript',
          'library/vuepress',
          'library/babel-parser',
        ],
      },
      {
        title: '计算机基础&原理',
        collapsable: false,
        children: [
          ['basics-principle/', 'Introduction'],
          'basics-principle/process-thread',
          'basics-principle/dns-hijack',
        ],
      },
      {
        title: '技术实现',
        collapsable: false,
        children: [['tech/', 'Introduction'], 'tech/real-time-video'],
      },
      {
        title: '动效',
        collapsable: false,
        children: [['effect/', 'Introduction'], 'effect/percent-ring'],
      },
    ],
  },
};

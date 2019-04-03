module.exports = {
  base: "/learn-path-recording-and-coding/",
  title: "学习路线笔记",
  description: "一个记录个人学习路线的笔记",
  dest: "dist",
  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }],
    ['link', {rel: 'manifest', href: '/manifest.json'}],
    ['link',{
      'http-equiv':'x-ua-compatible',
      content:'ie=edge'
    }],
    ['meta', {name: 'theme-color', content: '#3eaf7c'}],
    ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: 'black'}],
    ['link', {
      rel: 'apple-touch-icon',
      size: '72x72',
      href: `/assets/images/apple-touch-icon-72.png`
    }]
  ],
  serviceWorker: true,
  themeConfig:{
    repo: 'jackluson/learn-path-recording-and-coding',
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav:[
      {
        text: '个人博客',
        link: 'https://jackluson.github.io/'
      }
    ],
    sidebar:[
      {
        title: "框架&库",
        collapsable: false,
        children:[
          ['library/', 'Introduction'],
          'library/vuepress',
        ]
      },
      {
        title: "计算机基础&原理",
        collapsable: false,
        children:[
          ['basics-principle/', 'Introduction'],
          'basics-principle/process-thread'
        ]
      }
    ]
  },
}
/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "755a83ddd978f84dfa1a5ae0f85b5c19"
  },
  {
    "url": "assets/css/0.styles.0c283648.css",
    "revision": "b03ea14c5ea3902b06f203ac9d667fd7"
  },
  {
    "url": "assets/images/apple-touch-icon-72.png",
    "revision": "0c4109b03a10b0b3cf185098b1aed81d"
  },
  {
    "url": "assets/images/Paper-Plane-icon-128.png",
    "revision": "4fae5333cf84bc7d8d2c19af47c75f21"
  },
  {
    "url": "assets/images/Paper-Plane-icon-512.png",
    "revision": "60879bf9d2fe52c090ef3e8314a56a11"
  },
  {
    "url": "assets/img/1559222101896.71f22c04.png",
    "revision": "71f22c04fbcc0e14be245f510d43bd6b"
  },
  {
    "url": "assets/img/1560171939541.863d6329.png",
    "revision": "863d6329fe201a1be94a3cdb52d7ae2d"
  },
  {
    "url": "assets/img/1560173202968.b5982fd6.png",
    "revision": "b5982fd65e6088e8c92d5f5dd9b2f94d"
  },
  {
    "url": "assets/img/1560173887079.0ee2359d.png",
    "revision": "0ee2359ded20d31015c3b2c71726b27c"
  },
  {
    "url": "assets/img/1560174303420.a56648c4.png",
    "revision": "a56648c4f6bef820573ef09a5bfe1e82"
  },
  {
    "url": "assets/img/1560174346252.1df1accd.png",
    "revision": "1df1accdd085b0190fd4ad97486cb798"
  },
  {
    "url": "assets/img/1560174469165.6540c246.png",
    "revision": "6540c246e381b1430a57621b9f915296"
  },
  {
    "url": "assets/img/1560174876546.61e90e2e.png",
    "revision": "61e90e2e27cb6a05c742aefb9e9faad9"
  },
  {
    "url": "assets/img/1560174932404.e9437a76.png",
    "revision": "e9437a768d7ab43e4a973ab92753855d"
  },
  {
    "url": "assets/img/1560231821680.6424e657.png",
    "revision": "6424e6572fd45c3df69eeaa97cc1e3d6"
  },
  {
    "url": "assets/img/1560236586648.be14eb78.png",
    "revision": "be14eb7805d0c70f9bd87cff6d8c6c85"
  },
  {
    "url": "assets/img/1560238945877.17bce862.png",
    "revision": "17bce8629baab16a8d850ce7a3cadc85"
  },
  {
    "url": "assets/img/1560241035661.8951860c.png",
    "revision": "8951860cf2cafca1804ba76e41d35d1c"
  },
  {
    "url": "assets/img/1560241453237.c2336b16.png",
    "revision": "c2336b16b8f4771f037cc56504ead6bf"
  },
  {
    "url": "assets/img/1560242314260.9d4e5f7f.png",
    "revision": "9d4e5f7f4dea3b897c5ffe67a25c055c"
  },
  {
    "url": "assets/img/1560242780840.0c1816b3.png",
    "revision": "0c1816b3bc36bf248a1fc646296cb7f2"
  },
  {
    "url": "assets/img/g98x0nn0p1.53cf16fc.jpeg",
    "revision": "53cf16fc6a980974ca5ba5814a84d62d"
  },
  {
    "url": "assets/img/image-20200101231109566.bbd0399a.png",
    "revision": "bbd0399a8956be431501493ea630ef10"
  },
  {
    "url": "assets/img/image-20200101231318273.d267dd0b.png",
    "revision": "d267dd0bbe83257d53fb1c3105e60eb7"
  },
  {
    "url": "assets/img/image-20200101231634784.2dd51c04.png",
    "revision": "2dd51c04f87f56fc600c41f697598b9c"
  },
  {
    "url": "assets/img/mubwxk981b.0741af65.jpeg",
    "revision": "0741af6567226ab44f924bda414a60fb"
  },
  {
    "url": "assets/img/rtmp-vs-hls.9750ad13.jpg",
    "revision": "9750ad13ac3e523b9957f5be78c70e53"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.68bee804.js",
    "revision": "5907220a154338b6e7a2ac951251f84d"
  },
  {
    "url": "assets/js/11.5d33bd68.js",
    "revision": "96283f36fd417558cbd0f361973710b3"
  },
  {
    "url": "assets/js/12.31a56565.js",
    "revision": "da70970dc0591c1ce7a480bed0bba52a"
  },
  {
    "url": "assets/js/13.6db10a6c.js",
    "revision": "56412b4d4eb03b143acc265bffb059be"
  },
  {
    "url": "assets/js/14.01b257bc.js",
    "revision": "185dea44f86e69f5b608e4a9e38ca26f"
  },
  {
    "url": "assets/js/15.837f7139.js",
    "revision": "953adecfa39c0a2032638023b8db4cbe"
  },
  {
    "url": "assets/js/16.a5f08b76.js",
    "revision": "b16f358e3aedca41467d0cd30b250008"
  },
  {
    "url": "assets/js/17.5b6d4202.js",
    "revision": "abfb7bad8a178b012f32644dfbd42a55"
  },
  {
    "url": "assets/js/18.533876a1.js",
    "revision": "ee9d8841a1091ada0b0a0fa7dde58b14"
  },
  {
    "url": "assets/js/19.b3718ef1.js",
    "revision": "03695035149845509c2974db4a3609a0"
  },
  {
    "url": "assets/js/2.2d6af12f.js",
    "revision": "9daa11396291608bc872a5e40a9d02e5"
  },
  {
    "url": "assets/js/20.d98c007c.js",
    "revision": "800f94b955dca172d9b5acbeb918d401"
  },
  {
    "url": "assets/js/21.b76cb59f.js",
    "revision": "f45e80b8fed6722a782f2fc6e37ec44b"
  },
  {
    "url": "assets/js/22.638012c6.js",
    "revision": "bb6de78789f19e907c46eb9bc4c66f85"
  },
  {
    "url": "assets/js/23.d5639118.js",
    "revision": "fc3876b0e453c7d84bd89ac12b5f2a89"
  },
  {
    "url": "assets/js/3.22be132e.js",
    "revision": "56a3a9d3221787ac1769ad783eadce83"
  },
  {
    "url": "assets/js/4.2040d901.js",
    "revision": "bdc987005d6f0abfc0eb220d5af3009e"
  },
  {
    "url": "assets/js/5.e989de1b.js",
    "revision": "beb45a102492c21e64c99bca9b9f7af9"
  },
  {
    "url": "assets/js/6.4904d936.js",
    "revision": "6567aee7d4aa38cb245172f35180c206"
  },
  {
    "url": "assets/js/7.eb99de45.js",
    "revision": "f6a3f3c65a5e8cdb546248ebc8695c7f"
  },
  {
    "url": "assets/js/8.dfa3edec.js",
    "revision": "9929386bca7ab57d95ab375a1c875739"
  },
  {
    "url": "assets/js/9.c3792ee5.js",
    "revision": "b79f8489d8b3f4f5708530397803b164"
  },
  {
    "url": "assets/js/app.f9408880.js",
    "revision": "8d88c1baa972540c4b4b37d77c792f78"
  },
  {
    "url": "basics-principle/dns-hijack.html",
    "revision": "5cff49b312b174edc0643e85ec6bbc95"
  },
  {
    "url": "basics-principle/index.html",
    "revision": "d045fb281860de4dce072a99375ce321"
  },
  {
    "url": "basics-principle/process-thread.html",
    "revision": "3e2dc777ab29112e2fc254c2ac7d1a7b"
  },
  {
    "url": "collect/problem.html",
    "revision": "473e7691c9440bc9ea898421ce847bb3"
  },
  {
    "url": "develop-flow/index.html",
    "revision": "cf8e90f669b91d99559686b74b29b9e1"
  },
  {
    "url": "develop-flow/travis-test.html",
    "revision": "e5f7fb0dd50ce450d5826cce1363d0d5"
  },
  {
    "url": "effect/index.html",
    "revision": "66431327110bbe9fad2b5c83f114b150"
  },
  {
    "url": "effect/percent-ring.html",
    "revision": "eeb2a88331e4d3a6c2a1bda869d8691e"
  },
  {
    "url": "index.html",
    "revision": "e05ca56e51e72d64e0a22ffccd50451a"
  },
  {
    "url": "javascript/browser.html",
    "revision": "3897e8afc354b9d53ac49a53d83f9765"
  },
  {
    "url": "javascript/design-patterns.html",
    "revision": "9c910f65f1cc26f758b09531335582d8"
  },
  {
    "url": "javascript/eventloop.html",
    "revision": "5379d725c201328371cec79c7d1e2d86"
  },
  {
    "url": "javascript/index.html",
    "revision": "d8bd9e1cddba335b9448d8be6c0507e4"
  },
  {
    "url": "javascript/js-engine.html",
    "revision": "a64e719ce123e5d53bc7bb88adbfb800"
  },
  {
    "url": "library/babel-parser.html",
    "revision": "da6ffaeac262fd5dc2fee14c0fd644d6"
  },
  {
    "url": "library/index.html",
    "revision": "ad4fdb076f0b02dc0146898754246943"
  },
  {
    "url": "library/vuepress.html",
    "revision": "f7802a59191f8ee19282ff9ceb430b3c"
  },
  {
    "url": "tech/dns-hijack.html",
    "revision": "773f88e02417617f53bad73c8c437942"
  },
  {
    "url": "tech/index.html",
    "revision": "a5daa50273ba0d0dff992e4ecd039c5d"
  },
  {
    "url": "tech/real-time-video.html",
    "revision": "150ddb4ea8e3e21f7934727a3dbaf377"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})

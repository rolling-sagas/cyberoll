我这个网站会在其他地方打广告，现在要做统计渠道来源和登录转化率事件。
逻辑如下：

1. 判断获取渠道员。
   从广告跳转到我们网站，链接如下：
   https://rollingsagas.com/?utm_source=reddit&utm_medium=cpc&utm_campaign=test#firebase_debug
   即，会有 utm_source,utm_medium,utm_campaign（以及更多我没提及到的），我称之为 ad_source；
   可能会直接从广告跳转我们网站的任何页面；
2. 当进入如何我们的页面，会有一段逻辑：
   通过 url 获取 ad_source，然后从 url 中移除 ad_source(但不刷新)。
   将 ad_source 存入到 localStorage;
   并调用 trackEvent 方法发送一个埋点事件；
3. 修改 utils/index.js 的 goSso 事件，修改如下：
   进入是，通过 localStorage 获取想 ad_source 内容，并删除 localStorage 中的 ad_source。
   将 ad_source 拼接到 callbackUrl=xxx?ad_source=xxx 中。
4. 修改 app/auth/sso/route.js 中的方法，包括：
   从 url 中获取 ad_source 的内容。
   在获取 session 的信息后，将 session 的信息和 ad_source 通过 trackEvent 方法发送埋点。
5. trackEvent 方法单独有一个文件，现在只声明，暂时不实现。

- logEvent(eventName, data);
- event table,
  userinfo(uid,date,eventName, ...)

---

eventName, data

---

promise.all().catch()
try-catch

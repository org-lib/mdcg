if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$1 = {
    data() {
      return {
        webPayUrl: "http://192.168.1.27:8080/",
        userInfoTitle: "\u5FAE\u4FE1\u7528\u6237\u4E00\u952E\u767B\u5F55",
        downloadOk: false,
        payOk: false,
        apkUrl: "http://192.168.0.29:8080/src/assets/mdcg/revheadz.pj.apk",
        obbUrl: "http://192.168.0.29:8080/src/assets/mdcg/main.18.au.com.revheadz.revheadz.obb"
      };
    },
    onLoad() {
    },
    methods: {
      message(arg) {
        formatAppLog("log", "at pages/index/index.vue:32", "Arg=>");
        this.payOk = false;
        this.downloadOk = true;
        this.getPayMoney();
        formatAppLog("log", "at pages/index/index.vue:37", arg);
      },
      getPlats() {
        switch (uni.getSystemInfoSync().platform) {
          case "android":
            formatAppLog("log", "at pages/index/index.vue:42", "\u8FD0\u884CAndroid\u4E0A");
            break;
          case "ios":
            formatAppLog("log", "at pages/index/index.vue:45", "\u8FD0\u884CiOS\u4E0A");
            break;
          default:
            formatAppLog("log", "at pages/index/index.vue:48", "\u8FD0\u884C\u5728\u5F00\u53D1\u8005\u5DE5\u5177\u4E0A");
            break;
        }
      },
      getPayMoney() {
        uni.showToast({
          icon: "none",
          title: "\u652F\u4ED8\u5B8C\u6210\uFF01"
        });
      },
      getUserInfo() {
        uni.showLoading({
          title: "\u767B\u5F55\u4E2D..."
        });
        uni.getUserInfo({
          provider: "weixin",
          success: (res) => {
            formatAppLog("log", "at pages/index/index.vue:65", "\u767B\u5F55\u6210\u529F\uFF1AgetUserInfo=>", res);
            setTimeout(() => {
              uni.showLoading({
                title: "\u767B\u5F55\u6210\u529F"
              });
              uni.hideLoading();
              this.payOk = true;
            }, 2e3);
          }
        });
      },
      downloadTask() {
        this.getPlats();
        if (uni.getSystemInfoSync().platform == "ios") {
          uni.showToast({
            icon: "none",
            title: "\u5F53\u524D\u4E0D\u652F\u6301iOS\u7CFB\u7EDF\uFF0C\u8BF7\u5230\u3010\u5B89\u5353\u3011\u624B\u673A\u4E0A\u5B89\u88C5\uFF01"
          });
          return;
        }
        let fileType = "apk";
        let filePath = this.apkUrl;
        uni.showLoading({
          title: "\u5B89\u88C5\u5305\u4E0B\u8F7D\u4E2D"
        });
        if (fileType) {
          fileType = fileType.toLowerCase();
        }
        uni.downloadFile({
          url: encodeURI(filePath),
          success(res) {
            uni.hideLoading();
            if (fileType == "png" || fileType == "jpg" || fileType == "jpeg") {
              uni.previewImage({
                urls: [res.tempFilePath]
              });
              uni.hideLoading();
            } else {
              uni.openDocument({
                filePath: res.tempFilePath,
                success() {
                },
                fail(e) {
                  uni.hideLoading();
                  uni.showToast({
                    icon: "none",
                    title: "\u5B89\u88C5\u5305\u6253\u5F00\u5931\u8D25\uFF01"
                  });
                }
              });
            }
            formatAppLog("log", "at pages/index/index.vue:120", res.files);
            uni.showToast({
              icon: "none",
              title: res.files
            });
          },
          fail() {
            uni.hideLoading();
            uni.showToast({
              icon: "none",
              title: "\u5B89\u88C5\u5305\u4E0B\u8F7D\u51FA\u9519\uFF01"
            });
          },
          complete() {
            uni.hideLoading();
            this.obbDownload();
          }
        });
      },
      obbDownload() {
        var url = this.obbUrl;
        let dtask = plus.downloader.createDownload(
          url,
          {
            filename: "file://Android/obb/au.com.revheadz.revheadz/main.18.au.com.revheadz.revheadz.obb"
          },
          function(d, status) {
            if (status == 200) {
              plus.io.convertLocalFileSystemURL(d.filename);
              plus.runtime.openFile(d.filename);
            } else {
              plus.downloader.clear();
            }
          }
        );
        dtask.start();
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("image", {
        class: "logo",
        src: "/static/logo.png"
      }),
      !_ctx.loginOk ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "text-area"
      }, [
        vue.createElementVNode("button", {
          class: "login-btn",
          type: "primary",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.getUserInfo && $options.getUserInfo(...args))
        }, vue.toDisplayString($data.userInfoTitle), 1)
      ])) : vue.createCommentVNode("v-if", true),
      $data.payOk ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "pay-icon"
      }, [
        vue.createElementVNode("web-view", {
          src: $data.webPayUrl,
          onMessage: _cache[1] || (_cache[1] = (...args) => $options.message && $options.message(...args))
        }, null, 40, ["src"])
      ])) : vue.createCommentVNode("v-if", true),
      $data.downloadOk ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "downloadak"
      }, [
        vue.createElementVNode("button", {
          class: "btn",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.downloadTask && $options.downloadTask(...args))
        }, "\u70B9\u51FB\u5B89\u88C5")
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "/Users/yuandeqiao/Documents/HBuilderProjects/mdcg/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    },
    download() {
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/yuandeqiao/Documents/HBuilderProjects/mdcg/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);

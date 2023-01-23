"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
      console.log("Arg=>");
      this.payOk = false;
      this.downloadOk = true;
      this.getPayMoney();
      console.log(arg);
    },
    getPlats() {
      switch (common_vendor.index.getSystemInfoSync().platform) {
        case "android":
          console.log("\u8FD0\u884CAndroid\u4E0A");
          break;
        case "ios":
          console.log("\u8FD0\u884CiOS\u4E0A");
          break;
        default:
          console.log("\u8FD0\u884C\u5728\u5F00\u53D1\u8005\u5DE5\u5177\u4E0A");
          break;
      }
    },
    getPayMoney() {
      common_vendor.index.showToast({
        icon: "none",
        title: "\u652F\u4ED8\u5B8C\u6210\uFF01"
      });
    },
    getUserInfo() {
      common_vendor.index.showLoading({
        title: "\u767B\u5F55\u4E2D..."
      });
      common_vendor.index.getUserInfo({
        provider: "weixin",
        success: (res) => {
          console.log("\u767B\u5F55\u6210\u529F\uFF1AgetUserInfo=>", res);
          setTimeout(() => {
            common_vendor.index.showLoading({
              title: "\u767B\u5F55\u6210\u529F"
            });
            common_vendor.index.hideLoading();
            this.payOk = true;
          }, 2e3);
        }
      });
    },
    downloadTask() {
      this.getPlats();
      if (common_vendor.index.getSystemInfoSync().platform == "ios") {
        common_vendor.index.showToast({
          icon: "none",
          title: "\u5F53\u524D\u4E0D\u652F\u6301iOS\u7CFB\u7EDF\uFF0C\u8BF7\u5230\u3010\u5B89\u5353\u3011\u624B\u673A\u4E0A\u5B89\u88C5\uFF01"
        });
        return;
      }
      let fileType = "apk";
      let filePath = this.apkUrl;
      common_vendor.index.showLoading({
        title: "\u5B89\u88C5\u5305\u4E0B\u8F7D\u4E2D"
      });
      if (fileType) {
        fileType = fileType.toLowerCase();
      }
      common_vendor.index.downloadFile({
        url: encodeURI(filePath),
        success(res) {
          common_vendor.index.hideLoading();
          if (fileType == "png" || fileType == "jpg" || fileType == "jpeg") {
            common_vendor.index.previewImage({
              urls: [res.tempFilePath]
            });
            common_vendor.index.hideLoading();
          } else {
            common_vendor.index.openDocument({
              filePath: res.tempFilePath,
              success() {
              },
              fail(e) {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  icon: "none",
                  title: "\u5B89\u88C5\u5305\u6253\u5F00\u5931\u8D25\uFF01"
                });
              }
            });
          }
          console.log(res.files);
          common_vendor.index.showToast({
            icon: "none",
            title: res.files
          });
        },
        fail() {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            icon: "none",
            title: "\u5B89\u88C5\u5305\u4E0B\u8F7D\u51FA\u9519\uFF01"
          });
        },
        complete() {
          common_vendor.index.hideLoading();
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
  return common_vendor.e({
    a: !_ctx.loginOk
  }, !_ctx.loginOk ? {
    b: common_vendor.t($data.userInfoTitle),
    c: common_vendor.o((...args) => $options.getUserInfo && $options.getUserInfo(...args))
  } : {}, {
    d: $data.payOk
  }, $data.payOk ? {
    e: $data.webPayUrl,
    f: common_vendor.o((...args) => $options.message && $options.message(...args))
  } : {}, {
    g: $data.downloadOk
  }, $data.downloadOk ? {
    h: common_vendor.o((...args) => $options.downloadTask && $options.downloadTask(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/yuandeqiao/Documents/HBuilderProjects/mdcg/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);

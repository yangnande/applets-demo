/* eslint-disable  */
/* 201912121130 */
function _wt() {
  var trackingUrl = getApp().globalData.trackingUrl;
  this.u = trackingUrl ? trackingUrl : "https://sdc.10086.cn/dcso2y3n900000o614xoc5s2w_3e2n/dcs.gif?WT.branch=JT_XCX_LLQB",
    this.p = "", this.t = "", this.WT = {}, this.z = !0
}
_wt.prototype.V = function () {
  var appInstance = getApp();
  if (appInstance.globalData.mwosDomain) {
    var hostname = appInstance.globalData.mwosDomain;
  } else {
    var hostname = ""
  }
  var pathname = "";
  var screenWidth = wx.getSystemInfoSync().windowWidth;
  var screenHeight = wx.getSystemInfoSync().windowHeight;
  var referrer = "";
  var search = '?';
  var search_flg = true;
  if (getCurrentPages().length - 1 >= 0) {
    pathname = getCurrentPages()[getCurrentPages().length - 1].__route__;
  }
 if(getCurrentPages().length - 1 >= 0){
  	var options_ = getCurrentPages()[getCurrentPages().length - 1].options;
  	var flg = true;
  	for(var item in options_){
  		search_flg = false;
  		if(flg){
  			search += item+'='+options_[item];
  			flg = false;
  		}else{
  			search += '&'+item+'='+options_[item];
  		}
  	}
  }
 	pathname += search_flg ? '' : search;
  if (getCurrentPages().length - 2 >= 0) {
    referrer = getCurrentPages()[getCurrentPages().length - 2].__route__;
  }
  this.p += "&dcssip=" + hostname + "&dcsuri=" + pathname + "&WT.es=" + pathname;
  referrer != "" && referrer != "-" && (this.p += "&dcsref=" + referrer);
  this.p += "&WT.sr=" + screenWidth + "x" + screenHeight;
  if (wx.getStorageSync("WTmobile")) {
    var WTmobile = wx.getStorageSync("WTmobile")
    this.p += "&WT.mobile=" + WTmobile;
  }
  if (wx.getStorageSync("city")) {
    var WTcity = wx.getStorageSync("city")
    this.p += "&WT.city=" + WTcity;
  }
  this.p += "&dcsqry=" + (search_flg ? '' : search);

},
  _wt.prototype.M = function () { }, _wt.prototype.G = function () {
    var e = this.p + "&dcsdat=" + (new Date).getTime() + this.t,
      t = {}, n = e.toLowerCase().split("&");
    for (var r = 0; r < n.length; r++) n[r].length > 0 && (t[n[r].split("=")[0]] = n[r].split("=")[1]);
    //请求发出
    wx.request({
      url: this.u + e,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Cookie": this.cookie
      },
      success: function (res) { },
      fail: function (res) { },
      complete: function () { }
    });
  }, _wt.prototype.S = function () {
    this.z && (this.z = !1, this.G())
  }, _wt.prototype.dcsMultiTrack = function () {
    var e = arguments;
    if (e.length % 2 == 0) {
      for (var t = 0; t < e.length; t += 2) {
        this.t += "&" + e[t] + "=" + encodeURIComponent(e[t + 1]);
      }
    }
    if (this.p.indexOf("WT.mobile") <= -1) {
      if (wx.getStorageSync("WTmobile")) {
        var WTmobile = wx.getStorageSync("WTmobile")
        this.p += "&WT.mobile=" + WTmobile;
      }
    }
  if (this.p.indexOf("WT.city") <= -1) {
      if (wx.getStorageSync("city")) {
        var WTcity = wx.getStorageSync("city")
        this.p += "&WT.city=" + WTcity;
      }
    }
    this.G(), this.t = ""
  }, _wt.prototype.setOtherParameter = function (otherParameter) {
    try {
      var WTcity = "";
      for (var item in otherParameter) {
        var WTValue = otherParameter[item];
        wx.setStorageSync(item, WTValue);
        if (item == "city") {
          WTcity = WTValue;
        }
      }
      if (_tag.p.indexOf("WT.city") <= -1) {
        _tag.p += "&WT.city=" + WTcity;
      } else {
        var thisArr = _tag.p.split("&");
        var thisCurrentArr = [];
        for (var i = 0; i < thisArr.length; i++) {
          if (thisArr[i].indexOf("WT.city") > -1) {
            thisArr[i] = "WT.city=" + WTcity
          }
          thisCurrentArr.push(thisArr[i]);
        }
      }
      _tag.p = thisCurrentArr.join("&")
      console.log(thisCurrentArr);
    } catch (error) { }
  }, _wt.prototype.setMobile = function (mobile) {
    var thismobile = mobile || "";
    if (thismobile) {
      if (is_mobile(thismobile)) {
        if (thismobile.length > 11 && is_mobile(thismobile.slice(-11))) {
          thismobile = thismobile.slice(-11)
        }
        thismobile = encode_mobile(thismobile);
        wx.setStorageSync("WTmobile", thismobile);
        if (_tag.p.indexOf("WT.mobile") <= -1) {
          _tag.p += "&WT.mobile=" + thismobile;
        } else {
          var thisArr = _tag.p.split("&");
          var thisCurrentArr = [];
          for (var i = 0; i < thisArr.length; i++) {
            if (thisArr[i].indexOf("WT.mobile") > -1) {
              thisArr[i] = "WT.mobile=" + thismobile
            }
            thisCurrentArr.push(thisArr[i]);
          }
        	_tag.p = thisCurrentArr.join("&")
        }
      } else {
        if (thismobile.indexOf("-") > -1 && is_mobile(decode_mobile(thismobile))) {
          wx.setStorageSync("WTmobile", thismobile);
          if (_tag.p.indexOf("WT.mobile") <= -1) {
            _tag.p += "&WT.mobile=" + thismobile;
          } else {
            var thisArr = _tag.p.split("&");
            var thisCurrentArr = [];
            for (var i = 0; i < thisArr.length; i++) {
              if (thisArr[i].indexOf("WT.mobile") > -1) {
                thisArr[i] = "WT.mobile=" + thismobile
              }
              thisCurrentArr.push(thisArr[i]);
            }
          }
        } else {
          thismobile = ""
        }
      }
    }
    if (_tag) {
      return thismobile
    } else {
      return ""
    }
  }
  , Function.prototype.wtbind = function (e) {
    var t = this,
      n = function () {
        return t.apply(e, arguments)
      };
    return n
  }, _wt.prototype.F = function () {
    var f = "2";
    var e = new Date();
    var d = new Date(e.getTime() + 315360000000);
    var c = new Date(e.getTime());
    this.cookie = "";
    if (this.cookie.indexOf("WT_FPC=") != -1) {
      this.p += "&WT.vt_f=3";
      f = this.cookie.substring(this.cookie.indexOf("WT_FPC=") + 10);
      if (f.indexOf(";") != -1) {
        f = f.substring(0, f.indexOf(";"))
      }
      if (e.getTime() < ((new Date(parseInt(f.substring(f.indexOf(":lv=") + 4, f.indexOf(":ss="))))).getTime() +
        1800000)) {
        c.setTime((new Date(parseInt(f.substring(f.indexOf(":ss=") + 4)))).getTime())
      } else {
        this.p += "&WT.entry=2"
      }
      f = f.substring(0, f.indexOf(":lv="))
    }
    if (f.length < 10) {
      this.p += "&WT.vt_f=1&WT.entry=1";
      var b = e.getTime().toString();
      for (var a = 2; a <= (32 - b.length); a++) {
        f += Math.floor(Math.random() * 16).toString(16)
      }
      f += b
    }

    f = encodeURIComponent(f);
    this.p += "&WT.co_f=" + f;
    this.cookie = "WT_FPC=id=" + f + ":lv=" + e.getTime().toString() + ":ss=" + c.getTime().toString() +
      "; expires=" + d.toGMTString() + "; path=/; domain=.kfc.com.cn"

  };
var _tag = new _wt();
setTimeout(function () {
  try {
    _tag.V(), _tag.M(), _tag.F()
  } catch (_te) { }
  _tag.S();
}, 3000)

function is_mobile(mobile) {
  if (mobile.length > 11) {
    mobile = mobile.slice(-11)
  }
  var reg = /^(\+[0-9]{2,}-?)?1[0-9]{10}$/;
  return reg.test(mobile)
};
function get_a_random() {
  var a = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
  return String(a[parseInt(Math.random() * (15 + 1), 10)])
}
function pre_fix_integer(num, n) {
  return (Array(n).join(0) + num).slice(-n)
}
function encode_mobile(mobile) {
  if (is_mobile(mobile)) {
    var key = "abcdef";
    var mobile = String(mobile);
    mobile = mobile.substring(0, 2) + get_a_random() + get_a_random() + mobile.substring(2, 5) + get_a_random() + get_a_random() + mobile.substring(5, 8) + get_a_random() + mobile.substring(8, 11);
    var m1 = String(parseInt("0x" + String(mobile.substring(0, 4))) ^ key);
    var m2 = String(parseInt("0x" + String(mobile.substring(4, 8))) ^ key);
    var m3 = String(parseInt("0x" + String(mobile.substring(8, 12))) ^ key);
    var m4 = String(parseInt("0x" + String(mobile.substring(12, 16))) ^ key);
    return m3 + "-" + m4 + "-" + m1 + "-" + m2
  } else {
    return mobile
  }
}
function decode_mobile(str) {
  var key = "abcdef";
  str = str.split("-");
  var m3 = pre_fix_integer(Number(str[0] ^ key).toString(16), 4);
  var m4 = pre_fix_integer(Number(str[1] ^ key).toString(16), 4);
  var m1 = pre_fix_integer(Number(str[2] ^ key).toString(16), 4);
  var m2 = pre_fix_integer(Number(str[3] ^ key).toString(16), 4);
  var m5 = m1 + m2 + m3 + m4;
  return m5.substring(0, 2) + m5.substring(4, 7) + m5.substring(9, 12) + m5.substring(13, 17)
}
module.exports = _tag

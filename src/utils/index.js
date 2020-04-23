import CryptoJS from 'crypto-js'

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

/**
 * md5加密
 */
function md5 (str) {
  let md5Str = CryptoJS.MD5(str).toString()
  return md5Str
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

/**
 * 构造ajax的data数据变成json字符串
 * @param {Object} objPam reqBody所携带的json对象
 * @param {Object} objJson 客户端携带的json对象参数
 */
function getAjaxData (objPam, objJson) {
  /* eslint-disable */
  var cid = "0"; //推送标识
		var clientID = "0"; //客户端唯一标识
		var sn = "0"; //设备型号
		var cv = "0"; //客户端版本号
		var st = "0"; //系统类型 int
		var sv = "0"; //系统版本号
		var sp = "0"; //屏幕分辨率
		var xk = "0"; //客户端安全ID
    var ak = "0"; //签名字串
    var xc = "WX001"; //渠道号
		if (!!objJson) {
			cid = "undefined" == (typeof objJson.cid) ? "0" : objJson.cid;
			clientID = "undefined" == (typeof objJson.clientID) ? "0" : objJson.clientID;
			sn = "undefined" == (typeof objJson.sn) ? "0" : objJson.sn;
			cv = "undefined" == (typeof objJson.version) ? "0" : objJson.version;
			st = "undefined" == (typeof objJson.st) ? "0" : objJson.st;
			sv = "undefined" == (typeof objJson.sv) ? "0" : objJson.sv;
			sp = "undefined" == (typeof objJson.sp) ? "0" : objJson.sp;
			xk = "undefined" == (typeof objJson.xk) ? "0" : objJson.xk;
      ak = "undefined" == (typeof objJson.ak) ? "0" : objJson.ak;
      xc = "undefined" == (typeof objJson.xc) ? "WX001" : objJson.xc;
		}
		return {
			"cid": cid,
			"clientID": clientID,
			"sn": sn,
			"cv": cv,
			"st": st,
			"sv": sv,
			"sp": sp,
			"xk": xk,
      "ak": ak,
      "xc": xc,
			"reqBody": objPam
		};
}
/**
 * 获取时间戳(以毫秒为单位)
 */
export function timeChuo () {
  // 获取当前时间戳(以毫秒为单位)
  let timestamp = Date.parse(new Date())
  // 时间戳后面带6个随机数
  let random = ''
  for (var i = 0; i < 6; i++) {
    random += Math.floor(Math.random() * 10)
  }
  // 返回时间戳
  return timestamp + random
}
/** 发起post请求 */
export function fetch ({method = 'POST', url, confirmFun, reqBody = '', xs = false, cookie = false, cv = '0', openId = '', openid = '', noEncrypt = false, transId , cellNum = '', smsAuth = '', acid = '', mcid = ''}) {
  return new Promise((resolve, reject) => {
    if (reqBody !== '') {
      if (!!noEncrypt) {
        if (cellNum !== '') {
          cellNum = cellNum
        } else {
          cellNum = reqBody.cellNum
        }
      }
      reqBody = getAjaxData(reqBody)
    }
    if (smsAuth !== '') { // 短信验证码
      reqBody.smsAuth = smsAuth
    }
    reqBody.cv = cv
    if (!!noEncrypt) {
      reqBody.transId = transId
      reqBody.cellNum = cellNum
    }
    reqBody = JSON.stringify(reqBody)
    let md5Xs = ''
    let cookie1 = ''
    let definedString = 'Leadeon/SecurityOrganization'
    let headerObj = {
      'content-type': 'application/json'
    }
    if (xs) {
      md5Xs = md5(url + '_' + reqBody + '_' + definedString)
      headerObj.xs = md5Xs
    }
    // console.log('------------------', cookie, url)
    if (cookie) {
      cookie1 = wx.getStorageSync('leadon_Set_Cookie')
      headerObj.Cookie = cookie1
    }
    if (openId !== '') {
      headerObj.openId = openId
    }
    if (openid !== '') {
      headerObj.openid = openid
    }
    if (acid !== '') { // 流量钱包创建订单接口插码
      headerObj['AC-ID'] = acid
    }
    if (mcid !== '') { // 流量钱包创建订单接口插码
      headerObj['MC-ID'] = mcid
    }
    if (xs && cookie && openId !== '' && openid !== '') {
      md5Xs = md5(url + '_' + reqBody + '_' + definedString)
      cookie1 = wx.getStorageSync('leadon_Set_Cookie')
      headerObj.Cookie = cookie1
      headerObj.xs = md5Xs
      headerObj.openId = openId
      headerObj.openid = openid
    }
    if (!!noEncrypt) {
      let signs = cryptosign(reqBody)
      headerObj.sign = signs
      headerObj['x-qen'] = '3'
      headerObj.wxtype = 0
      reqBody = encryptByAES(reqBody)
    }
    // console.log('openId', openId)
    wx.request({
      // 正式代码
      method: method,
      url: url,
      data: reqBody,
      header: headerObj,
      success: function (res) {
        if (!!noEncrypt) {
          let resData = decryptByAES(res.data.body)
          res.data = JSON.parse(resData)
        }
        resolve(res.data)
      },
      fail: function () {
        wx.showModal({
          title: '',
          content: '亲，小老鼠跑得太快了，请稍后再试哦~',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#005EC8',
          success: function (res) {
            if (res.confirm) {
              if (confirmFun) {
                confirmFun()
              }
            }
          }
        })
      }
    })
  })
}
/**
 * aes加密
 * @message 需要加密的字符串
 */
const iv = CryptoJS.enc.Utf8.parse('7158134673493202');//十六位十六进制数作为秘钥偏移量
export function encryptByAES (message) {
  let key = CryptoJS.enc.Utf8.parse("fv02ziFLk4nGRINB")
  if (port.hostportVAG.indexOf('gray') > -1) {
    key = CryptoJS.enc.Utf8.parse("MCz3DBfuUaWC19mK")
  }
  message = CryptoJS.enc.Utf8.parse(message)
  var encrypted = CryptoJS.AES.encrypt(message, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
/**
 * aes解密
 * @message 需要加密的字符串
 */
 //十六位十六进制数作为秘钥
export function decryptByAES (message) {
  let key = CryptoJS.enc.Utf8.parse("7Kz85GSjLfpbcYdJ")
  if (port.hostportVAG.indexOf('gray') > -1) {
    key = CryptoJS.enc.Utf8.parse("a20n70LRd6ibWHDo")
  }
  var decrypted = CryptoJS.AES.decrypt(message, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypted)
}
/**
 * 对header字段sign的处理
 * 将json消息头按照正序字典排序，除了reqBody里，每个字段后面追加&
 * * @param data 请求消息头
 */
export function cryptosign (dataSign) {
  // 将json消息头按照正序字典排序，除了reqBody里，每个字段后面追加&
  // 排序规则，按对象的key排序
  let sortedObjKeys = Object.keys(dataSign).sort()
  let obj = ''
  for (var key in sortedObjKeys) {
    let reqbody = {}
    if (sortedObjKeys[key] === 'reqBody') {
      for (var key2 in dataSign[sortedObjKeys[key]]) {
        let aa = dataSign[sortedObjKeys[key]]
        if (typeof (aa[key2]) === 'number' || typeof (aa[key2]) === 'object') {
          aa[key2] = aa[key2] + ''
        }
      }
      reqbody = dataSign[sortedObjKeys[key]]
      obj += sortedObjKeys[key] + '=' + JSON.stringify(reqbody) + '&'
    } else {
      if ((typeof (dataSign[sortedObjKeys[key]]) === 'number' || typeof (dataSign[sortedObjKeys[key]]) === 'object')) {
        dataSign[sortedObjKeys[key]] = dataSign[sortedObjKeys[key]] + ''
      }
      obj += sortedObjKeys[key] + '=' + dataSign[sortedObjKeys[key]] + '&'
    }
  }
  // header头部追加sign字段  用md5加密整个消息头
  let signmess = md5(obj)
  return signmess
}
// 小数点后俩位的处理方法
export function floating (mon) {
  var mon = Math.floor(mon * 1000) / 1000;
  var sMon = String(mon); //把数字类型转换成字符串类型
  var demical = sMon.indexOf("."); //取得小数点号的位置
  if (demical > 0) {
    var subb = sMon.substring(0, demical + 3); //取开始位置到小数点后2位
    mon = (Number(subb)); //转换成数字
  }
  mon = mon.toFixed(2);
  return mon;
}
/**
 * 自动登陆
 */
export function autoLog (data, that) {
    //会话超时，判断用户有没有设置自动登录
    wx.getStorage({
      key: 'leadon_autoLogin',
      success: function (resAutoLogin) {
        if (1 == resAutoLogin.data) {
          //获取微信用户信息和iv
          //获取之前需要先调用wx.login
          wx.login({
            success: function (resWXLogin) {
              if (resWXLogin.code) {
                //用登录凭证换openid
                useWXLogin();

                function useWXLogin() {
                  //拼装xs
                  var requestUrl = port.hostport + 'LWX/wxLogin/wxlogin';
                  var requestBodyString = JSON.stringify(getAjaxData({
                    jsCode: resWXLogin.code
                  }));
                  var definedString = "Leadeon/SecurityOrganization";
                  // console.log('*+*+*', requestUrl, requestBodyString, definedString)
                  var md5String = md5(requestUrl + '_' + requestBodyString + '_' + definedString);
                  wx.request({
                    //正式代码
                    method: 'POST',
                    url: requestUrl,
                    data: requestBodyString,
                    //测试代码
                    // method: 'GET',
                    // url: _this.prefix + 'jsonData/index/wxlogin.json',
                    header: {
                      'content-type': 'application/json',
                      'xs': md5String
                    },
                    success: function (res) {
                      if ("000000" == res.data.retCode) {
                        if (!!res.data.rspBody) {
                          //将返回的的openid存到本地
                          wx.setStorage({
                            key: "leadon_openid",
                            data: res.data.rspBody.openid,
                            success: function () {
                              //获取手机号
                              wx.getStorage({
                                key: 'leadon_cellNum',
                                success: function (resCellNum) {
                                  //获取openid
                                  wx.getStorage({
                                    key: 'leadon_openid',
                                    success: function (resOpenId) {
                                      //自动登录
                                      toAutoLogin()
                                      function toAutoLogin() {
                                        //拼装xs
                                        var requestUrl = port.hostport + 'LWX/uamrandcodelogin/autoLogin';
                                        var requestBodyString = JSON.stringify(getAjaxData({
                                          wUserInfo: '',
                                          iv: '',
                                          cellNum: resCellNum.data,
                                          openid: resOpenId.data
                                        }));
                                        var definedString = "Leadeon/SecurityOrganization";
                                        var md5String = md5(requestUrl + '_' + requestBodyString + '_' + definedString);
                                        wx.request({
                                          //正式代码
                                          method: 'POST',
                                          url: requestUrl,
                                          data: requestBodyString,
                                          //测试代码
                                          // method: 'GET',
                                          // url: this.prefix + 'jsonData/login/autoLogin.json',
                                          header: {
                                            'content-type': 'application/json',
                                            'xs': md5String
                                          },
                                          success: function (res) {
                                            if ("000000" == res.data.retCode) {
                                              if (!!res.data.rspBody) {
                                                //存Set_Cookie
                                                wx.setStorage({
                                                  key: "leadon_Set_Cookie",
                                                  data: res.data.rspBody.Set_Cookie,
                                                  success: function () {
                                                    //此时已登录成功 改变leadon_loginStatus
                                                    wx.setStorage({
                                                      key: "leadon_loginStatus",
                                                      data: '1',
                                                      success: function () {
                                                        console.log('重新登录成功')
                                                        that.init()
                                                      }
                                                    });
                                                  }
                                                });
                                              } else {
                                                wx.navigateTo({
                                                  url: '/pages/login/login'
                                                })
                                              }
                                            } else {
                                              wx.navigateTo({
                                                url: '/pages/login/login'
                                              })
                                            }
                                          },
                                          fail: function () {
                                            toAutoLogin();
                                          }
                                        });
                                      }
                                    },
                                    fail: function () {
                                      useWXLogin();
                                    }
                                  });
                                },
                                fail: function () {
                                  wx.navigateTo({
                                    url: '/pages/login/login'
                                  })
                                }
                              });
                            }
                          });
                        } else {}
                      } else {
                        wx.showModal({
                          content: res.data.retDesc,
                          showCancel: false,
                          confirmText: '知道了',
                          confirmColor: '#0066FF',
                          success: function(res){}
                        })
                      }
                    },
                    fail: function () {
                      useWXLogin();
                    }
                  })
                }
              } else { }
            }
          });
        } else if (0 == resAutoLogin.data) {
          //用户设置不自动登录 拉起登录页面
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      },
      fail: function () {
        // 用户未设置自动登录 默认自动登录
        wx.setStorage({
          key: "leadon_autoLogin",
          data: 1,
          success: function () {
            autoLog(data);
          }
        })
      }
    })
}


// 会话超时的提示框
export function checkHuModal({data = null, that = null, content = '', confirmText = '知道了', confirmColor = '#0066FF', callBack = function () {}}) {
  if (data !== null && that !== null && "4" == data.retCode.substring(0, 1)) {
    wx.getStorage({
      key: 'leadon_loginStatus',
      success: function (loginStatus) {
        if (loginStatus.data === '0') {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        } else {
          autoLog(data, that)
        }
      },
      fail: function () {
        wx.setStorage({
          key: 'leadon_loginStatus',
          data: '0'
        });
        wx.showModal({
          content: content,
          showCancel: false,
          confirmText: confirmText,
          confirmColor: confirmColor,
          success: callBack
        })
      }
    })
  } else {
    wx.showModal({
      content: content,
      showCancel: false,
      confirmText: confirmText,
      confirmColor: confirmColor,
      success: callBack
    })
  }
}

// 单按钮的提示框
export function singleshowModal({content = '', confirmText = '知道了', confirmColor = '#0066FF', callBack = function () {}}) {
  wx.showModal({
    content: content,
    showCancel: false,
    confirmText: confirmText,
    confirmColor: confirmColor,
    success: callBack
  })
}
// 双按钮的提示框
export function showModal({title = '',content, showCancel = true, cancelText = '取消', cancelColor = '#0066FF', confirmText = '确定', confirmColor = '#0066FF', callBack = function(res){}}) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    cancelText: cancelText,
    cancelColor: cancelColor,
    confirmText: confirmText,
    confirmColor: confirmColor,
    success: callBack
  })
}
/**
 * 双按钮公共弹框方法
 * @param {String} content 提示的内容
 * @param {Object} btnTex1 左边按钮文字
 * @param {Object} btnTex2 右边按钮文字
 * @param {Object} btnFun1 左边按钮事件名称
 * @param {Object} btnFun2 右边按钮事件名称
 */
export function delPubModal (content, btnTex1, btnTex2, btnFun1, btnFun2) {
  wx.showModal({
    title: '尊敬的用户您好',
    content: content,
    cancelText: btnTex1,
    cancelColor: '#0085CF',
    confirmText: btnTex2,
    confirmColor: '#0085CF',
    success: function (res) {
      if (res.confirm) {
        if (!!btnFun2) {
          btnFun2()
        }
      } else {
        if (!!btnFun1) {
          btnFun1()
        }
      }
    }
  })
}
// 页面分享
export function sharePage(title,path,imgUrl) {
  return function (){
    return {
      title: title,
      path: path,
      imageUrl: imgUrl
    }
  }
}
// 加密方法
export function encryptByDES(message) {
  var keyHex = CryptoJS.enc.Utf8.parse('leadeon-wx-wt');
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString()
}

// 解密方法
export function decryptByDES(ciphertext) {
  var keyHex = CryptoJS.enc.Utf8.parse('leadeon-wx-wt');
  // direct decrypt ciphertext
  var decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// toast提示
export function showToast () {
  wx.showToast({
    title: '删除成功',
    icon: 'success',
    duration: 2000
  })
}
// 导航的功能广告统计量请求
export async function getFunction (obj) {
  // let requestUrl = 'https://www.easy-mock.com/mock/5ac2030d470d657aa5c1dd62/getNav'
  let requestUrl = port.hostportTest + 'SA/clickCount/printLog'
  let cellNum = !!wx.getStorageSync('leadon_cellNum') ? wx.getStorageSync('leadon_cellNum') : '99999999999'
  let provinceCode = !!wx.getStorageSync('leadon_provinceCode') ? wx.getStorageSync('leadon_provinceCode') : '9999'
  let cityCode = !!wx.getStorageSync('leadon_cityCode') ? wx.getStorageSync('leadon_cityCode') : '0000'
  let reqBody = JSON.stringify(getAjaxData({
    cellNum: cellNum,
    provinceCode: provinceCode,
    cityCode: cityCode,
    adverType: obj.adverType,
    adverLocation: obj.adverLocation || '',
    markId: obj.adverId
  }))
  console.log(reqBody)
  let definedString = 'Leadeon/SecurityOrganization'
  let md5Xs = md5(requestUrl + '_' + reqBody + '_' + definedString)
  let headerObj = {
    'content-type': 'application/json',
    xs: md5Xs
  }
  wx.request({
    // 正式代码
    method: 'POST',
    url: requestUrl,
    data: reqBody,
    header:headerObj,
    success: function (res) {
      console.log(res)
    },
    fail: function () {
    }
  })
}

// 请求接口的前缀
export const port = {
  /**
	 * 业务接口前缀
   * 灰度: https://app.10086.cn/biz-V2.2/
   * 正式: https://app.10086.cn/biz-orange/
	 */
	hostportTest: "https://app.10086.cn/biz-V2.2/",
  /**
   * 登录
   * 灰度: https://app.10086.cn/biz-V2.2/
   * 正式: https://app.10086.cn/biz-weixin/
   */
  hostport: 'https://app.10086.cn/biz-V2.2/',
  /**
   * 流量加密
   * 灰度:'https://flow.clientaccess.10086.cn/VSC-gray/'
   * 正式:'https://flow.clientaccess.10086.cn/VSC/'
   */
  hostportVSC: 'https://flow.clientaccess.10086.cn/VSC-gray/',
  /**
   * 流量账户
   * 灰度:'https://flow.clientaccess.10086.cn/VAG-gray/'
   * 正式:'https://flow.clientaccess.10086.cn/VAG/'
   */
  hostportVAG: 'https://flow.clientaccess.10086.cn/VAG-gray/',
  /**
   * 流量交易
   * 灰度:'https://flow.clientaccess.10086.cn/VDG-gray/'
   * 正式:'https://flow.clientaccess.10086.cn/VDG/'
   */
  hostportVDG: 'https://flow.clientaccess.10086.cn/VDG-gray/',
  /**
   * 流量支付
   * 灰度:'https://flow.clientaccess.10086.cn/VTG-gray/'
   * 正式:'https://flow.clientaccess.10086.cn/VTG/'
   */
  hostportVTG: 'https://flow.clientaccess.10086.cn/VTG-gray/',
  /**
   * 流量H5页面地址
   * 灰度:'https://flow.clientaccess.10086.cn/flowwallet-test/'
   * 正式:'https://flow.clientaccess.10086.cn/flowwallet/'
   */
  pageUrl: 'https://flow.clientaccess.10086.cn/flowwallet-test/',
  /**
   * 贺卡红包页面地址
   * 灰度:'https://flow.clientaccess.10086.cn/activity-flow-test/'
   * 正式:'https://flow.clientaccess.10086.cn/activity-flow/'
   */
  videoPacketUrl: 'https://flow.clientaccess.10086.cn/activity-flow-test/'
}

/**
 * 获取url字符串
 */
export function getQuery() {
  /* 获取当前路由栈数组 */
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  return options
}

export function getCurrent() {
  /* 获取当前路由栈数组 */
  const pages = getCurrentPages()
  return pages
}
/**
 * 推荐人分享统计
 * @param {String} telNum1 推荐人号码
 * @param {String} telNum2 被推荐人号码
 */
export async function referrerShare(telNum1,telNum2){
  let openid = wx.getStorageSync('leadon_openid')
  let province = wx.getStorageSync('leadon_provinceCode')
  let city = wx.getStorageSync('leadon_cityCode')
  let requestUrl = port.hostportTest + 'DWX/shareCount/referrerShare'
  // let requestUrl = 'https://app.10086.cn/biz-V2.2/DWX/shareCount/referrerShare'
  let retel = encryptByDES(telNum1)
  let phone = encryptByDES(telNum2)
  let reqBody = {
    openid: openid,
    referralProvince: province, // 被推荐人省份
    referralCity: city, // 被推荐人市
    referrerCellNum: retel, // 推荐人手机号
    referralcellNum: phone // 被推荐人手机号
  }
  console.log(reqBody,'请求数据')
  let referData = await fetch({
    url: requestUrl,
    reqBody: reqBody,
    xs: true,
    cookie: true,
    confirmFun: function () {
    }
  })
  if (referData.retCode === '000000') {
    console.log(referData.retDesc, '成功')
  } else {
    // singleshowModal({content: referData.retDesc})
  }
}

/**
 * 微信推送服务关系绑定
 */
export async function bindRelation(){
  let openid = wx.getStorageSync('leadon_openid')
  let cellNum = wx.getStorageSync('leadon_cellNum')
  let bindData = await fetch({
    url: port.hostportTest + 'CHWX/wechatPush/bindRelation',
    reqBody: {
      openid: openid,
      cellNum: cellNum // 手机号码
    },
    xs: true,
    cookie: true,
    confirmFun: function () {
    }
  })
  if (bindData.retCode === '000000') {
    console.log(bindData.retDesc, '微信推送服务关系绑定成功')
  } else {
  }
}
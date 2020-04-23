/* eslint-disable */
var md5 = require('../utils/md5/md5.min');
var CryptoJS = require('./crypto.min.js')
module.exports = {
	/**
	 * 登录相关接口前缀
   * 正式： https://app.10086.cn/biz-weixin/
   * 灰度:  https://app.10086.cn/biz-V2.2/
	 */
  hostport: "https://app.10086.cn/biz-V2.2/",
	/**
	 * 业务接口前缀
   * 正式: https://app.10086.cn/biz-orange/
   * 灰度: https://app.10086.cn/biz-V2.2/
	 */
	hostportTest: "https://app.10086.cn/biz-V2.2/",
	/**
	 * 资源(图片、json文件等等)前缀
	 */
  prefix: "https://app.10086.cn/leadeon-wx-rs/",
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
  videoPacketUrl: 'https://flow.clientaccess.10086.cn/activity-flow-test/',
	/**
	 * 请求体对象
	 */
	requsetData: {
		wUserInfo: '',
		iv: '',
		cellNum: '',
		openid: ''
	},
	/**
	 * jsCode
	 */
  jsCode: '',
  /**
   * des加密
   */
  encryptByDES: function (message) {
    var keyHex = CryptoJS.enc.Utf8.parse('u_ec3_01');
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase()
  },
  /**
   * des解密
   */
  decryptByDES: function (message) {
    var keyHex = CryptoJS.enc.Utf8.parse('u_ec3_01');
    var decrypted = CryptoJS.DES.decrypt({
      ciphertext: CryptoJS.enc.Hex.parse(message)
    }, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  },
  /**
  * des加密微信
  */
  newEncryptByDES: function (message) {
    var keyHex = CryptoJS.enc.Utf8.parse('leadeon-wx-wt');
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString()
  },
  /**
   * des解密微信
   */
  newDecryptByDES: function (ciphertext) {
    var keyHex = CryptoJS.enc.Utf8.parse('leadeon-wx-wt');
    // direct decrypt ciphertext
    var decrypted = CryptoJS.DES.decrypt({
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  },
	/**
	 * 构造ajax的data数据变成json字符串
	 * @param {Object} objPam reqBody所携带的json对象
	 * @param {Object} objJson 客户端携带的json对象参数
	 */
	getAjaxData: function (objPam, objJson) {
		var cid = "0"; //推送标识
		var clientID = "0"; //客户端唯一标识
		var sn = "0"; //设备型号
		var cv = "0"; //客户端版本号
		var st = "0"; //系统类型 int
		var sv = "0"; //系统版本号
		var sp = "0"; //屏幕分辨率
		var xk = "0"; //客户端安全ID
    var ak = "0"; //签名字串
    var xc = "WX001"; // 渠道号
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
		return JSON.stringify({
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
		});
	},
	/**
	 * autoLogin带来的data
	 */
	autoLoginData: {},
	/**
	 * autoLogin带来的obj
	 */
	autoLoginObj: {},
	/**
	 * 自动登录
	 * @param {Object} data 响应体的json对象
	 * @param {Object} obj 指向调用该方法的页面的对象
	 */
	autoLogin: function (data, obj) {
		//传递this对象
		var _this = this;
		//带来的参数存在全局变量里
		_this.autoLoginData = data;
		_this.autoLoginObj = obj;
		//判断是否会话超时
		if ("4" == data.retCode.substring(0, 1) || "223142" == data.retCode) {
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
									_this.jsCode = resWXLogin.code;
									//用登录凭证换openid
									useWXLogin();

									function useWXLogin() {
										//拼装xs
										var requestUrl = _this.hostport + 'LWX/wxLogin/wxlogin';
										var requestBodyString = _this.getAjaxData({
											jsCode: _this.jsCode
										});
										var definedString = "Leadeon/SecurityOrganization";
										var md5String = md5(requestUrl + '_' + requestBodyString + '_' + definedString);
										wx.request({
											//正式代码
											method: 'POST',
											url: requestUrl,
											data: requestBodyString,
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
																		_this.requsetData.cellNum = resCellNum.data;
																		//获取openid
																		wx.getStorage({
																			key: 'leadon_openid',
																			success: function (resOpenId) {
																				_this.requsetData.openid = resOpenId.data;
																				//自动登录
																				toAutoLogin()
																				function toAutoLogin() {
																					//拼装xs
																					var requestUrl = _this.hostport + 'LWX/uamrandcodelogin/autoLogin';
																					var requestBodyString = _this.getAjaxData(_this.requsetData);
																					var definedString = "Leadeon/SecurityOrganization";
																					var md5String = md5(requestUrl + '_' + requestBodyString + '_' + definedString);
																					wx.request({
																						//正式代码
																						method: 'POST',
																						url: requestUrl,
																						data: requestBodyString,
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
																													//重新刷新页面
																													obj.onLoad();
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
																					// _this.autoLoginTimes++;
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
													} else {

													}
												} else {
													_this.showModal(res.data.retDesc, "知道了");
												}
											},
											fail: function () {
												useWXLogin();
											}
										})
									}
								} else {
									// _this.showModal("获取用户登录态失败！", "知道了");
								}
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
					// //用户未设置自动登录 默认自动登录
					wx.setStorage({
						key: "leadon_autoLogin",
						data: 1,
						success: function () {
							_this.autoLogin(_this.autoLoginData, _this.autoLoginObj);
						}
					})
				}
			})
		} else {
			//不为000000 也不为为4开头的异常场景
			_this.showModal(data.retDesc, '知道了');
		}
	},
	/**
	 * 分享绿点小程序（默认都分享首页）
	 */
	toShare: function () {
		return function () {
			return {
				title: '这里可以查话费、查账单、办业务啦，快进来看看吧！',
        desc: '中国移动手机营业厅官方小程序',
        imageUrl: 'https://app.10086.cn/leadeon-wx-rs/images/share/share01.jpg',
				path: '/pages/index/index'
			};
		};
	},

	/**
	 * 单按钮提示框
	 * @param {String} title 提示的标题
	 * @param {String} content 提示的内容
	 * @param {String} confirmText 按钮的文字，默认为"确定"，最多 4 个字符
	 * @param {String} confirmFun  按钮事件名称
	 */
	showModal: function (content, confirmText, confirmFun,showCancel=false,cancelText,cancelFun,cancelColor="#000000",confirmColor='#005EC8',) {
		wx.showModal({
			title: '',
			content: content,
			showCancel: showCancel,
      confirmText: confirmText,
      cancelColor: cancelColor,
			confirmColor: confirmColor,
			success: function (res) {
				if (res.confirm) {
					if (!!confirmFun) {
						confirmFun()
					}
        }else if (!res.confirm) { //点取消
          if (!!cancelFun) {
						cancelFun()
					}
        }
      }
		})
	},


	/**
	 * 双按钮公共弹框方法
	 * @param {String} content 提示的内容
	 * @param {Object} btnTex1 左边按钮文字
	 * @param {Object} btnTex2 右边按钮文字
	 * @param {Object} btnFun1 左边按钮事件名称
	 * @param {Object} btnFun2 右边按钮事件名称
	 */
	delPubModal: function (content, btnTex1, btnTex2, btnFun1, btnFun2) {
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
  },
  /**
   * 广告位点击量
   */
  adverPrintLog: function (obj) {
    var cellNum = !!wx.getStorageSync('leadon_cellNum') ? wx.getStorageSync('leadon_cellNum') : '99999999999'
    var provinceCode = !!wx.getStorageSync('leadon_provinceCode') ? wx.getStorageSync('leadon_provinceCode') : '9999'
    var cityCode = !!wx.getStorageSync('leadon_cityCode') ? wx.getStorageSync('leadon_cityCode') : '0000'
    var requestUrl = this.hostportTest + 'SA/clickCount/printLog'
    // var requestUrl = 'https://www.easy-mock.com/mock/5af940ede98afd5da1f733c1/cmccmini/biz-weixin/SA/advertisingClick/printLog'
    var definedString = "Leadeon/SecurityOrganization";
    var reqBody = {
      cellNum: cellNum,
      provinceCode: provinceCode,
      cityCode: cityCode,
      adverType: obj.adverType,
      adverLocation: obj.adverLocation || '',
      markId: obj.markId
    }
    var ajaxData = this.getAjaxData({
      ...reqBody
    })
    var md5String = md5(requestUrl + '_' + ajaxData + '_' + definedString);
    wx.request({
      method: 'POST',
      url: requestUrl, //仅为示例，并非真实的接口地址
      data: ajaxData,
      header: {
        'content-type': 'application/json',
        xs: md5String
      },
      success: function(res) {
        console.log(res.data)
      },
      fail: function () {
      }
    })
  },
  /**
   * 推荐人分享统计
   * @param {String} telNum1 推荐人号码
   * @param {String} telNum2 被推荐人号码
   */
  referrerShare: function(telNum1,telNum2){
    var openid = wx.getStorageSync('leadon_openid')
    var getCookie = wx.getStorageSync('leadon_Set_Cookie')
    var province = wx.getStorageSync('leadon_provinceCode')
    var city = wx.getStorageSync('leadon_cityCode')
    var requestUrl = this.hostportTest + 'DWX/shareCount/referrerShare'
    var definedString = "Leadeon/SecurityOrganization";
    var retel = this.newEncryptByDES(telNum1)
    var phone = this.newEncryptByDES(telNum2)
    var reqBody = {
      openid: openid,
      referralProvince: province, // 被推荐人省份
      referralCity: city, // 被推荐人市
      referrerCellNum: retel, // 推荐人手机号
      referralcellNum: phone // 被推荐人手机号
    }
    console.log(reqBody,'请求数据')
    var ajaxData = this.getAjaxData({
      ...reqBody
    })
    var md5String = md5(requestUrl + '_' + ajaxData + '_' + definedString);
    wx.request({
      method: 'POST',
      url: requestUrl,
      data: ajaxData,
      header: {
        'content-type': 'application/json',
        xs: md5String,
        'Cookie': getCookie,
      },
      success: function(res) {
        console.log(res.data,'推荐人接口数据')
      },
      fail: function () {
      }
    })
  },
  /**
   * 微信推送服务关系绑定
   */
  bindRelation: function(){
    var openid = wx.getStorageSync('leadon_openid')
	var cellNum = wx.getStorageSync('leadon_cellNum')
	var getCookie = wx.getStorageSync('leadon_Set_Cookie')
    var requestUrl = this.hostportTest + 'CHWX/wechatPush/bindRelation'
    var definedString = "Leadeon/SecurityOrganization";
    var reqBody = {
      openid: openid,
      cellNum: cellNum // 手机号码
    }
    var ajaxData = this.getAjaxData({
      ...reqBody
    })
    var md5String = md5(requestUrl + '_' + ajaxData + '_' + definedString);
    wx.request({
      method: 'POST',
      url: requestUrl,
      data: ajaxData,
      header: {
        'content-type': 'application/json',
        xs: md5String,
        'Cookie': getCookie,
      },
      success: function(res) {
        console.log(res.data,'微信推送服务关系绑定成功')
      },
      fail: function () {
      }
    })
  },
  /**
   * 基础库版本号判断
   */
  compareVersion(v1, v2) {
	v1 = v1.split('.')
	v2 = v2.split('.')
	const len = Math.max(v1.length, v2.length)
  
	while (v1.length < len) {
	  v1.push('0')
	}
	while (v2.length < len) {
	  v2.push('0')
	}
  
	for (let i = 0; i < len; i++) {
	  const num1 = parseInt(v1[i])
	  const num2 = parseInt(v2[i])
  
	  if (num1 > num2) {
		return 1
	  } else if (num1 < num2) {
		return -1
	  }
	}
  
	return 0
  }
}

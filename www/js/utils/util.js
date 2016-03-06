/**
 * get方法
 */
seeds.service('getService', ['$http', '$q',
    function ($http, $q) {
        /**
         * http get方法
         * @param url  路径
         * @param parameters 参数
         * @returns {*}
         */
        this.getData = function (url, parameters) {
            var deferred = $q.defer();
            $http.get(url, {params: parameters, timeout: 5000})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.resolve({"result": "-1", "msg": "网络异常"});
                });
            return deferred.promise;
        };
    }]);

/**
 * post方法
 */
seeds.service('postService', ['$http', '$q', '$timeout', 'showMsgService', 'deviceService',
    function ($http, $q, $timeout, showMsgService, deviceService) {
        /**
         *
         * @param url 路径
         * @param parameters 参数
         * @returns {*}
         */
        this.postData = function (url, parameters) {
            var accessToken = sessionStorage.getItem("token");
            parameters.accessToken = accessToken;

            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: parameters,
                timeout: 15000,
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.resolve({"result": "-1", "msg": "网络异常"});
            });
            return deferred.promise;
        }
    }]);


/**
 * jsonp方法
 */
seeds.service('jsonpService', ['$http', '$q',
    function ($http, $q) {
        /**
         *
         * @param url 路径
         * @param parameters 参数
         * @returns {*}
         */
        this.jsonpData = function (url, parameters) {
            parameters.jsoncallback = 'JSON_CALLBACK';

            var deferred = $q.defer();
            var p = $http({
                method: 'JSONP',
                url: comUrl + url,
                params: parameters,
                timeout: 5000,
            }).success(function (response, status, headers, config) {
                deferred.resolve(response);
            }).error(function (response, status, headers, config) {
                deferred.resolve({"result": "fail", "msg": "网络异常"});
            });

            return deferred.promise;
        }
    }]);
/**
 * 弹框显示
 */
seeds.service('showMsgService', ['$ionicLoading',
    function ($ionicLoading) {
        /**
         * 弹框提示
         * @param msg 提示信息
         */
        this.showMsg = function (msg) {
            $ionicLoading.show({
                template: '<div ><p>' + msg + '</p></div>',
                duration: 1200
            });
        }
    }]);

/**
 * 过滤字符串   返回 xxx...
 * str  字符串
 * len  过滤的长度
 */
seeds.filter('splitStr', function () {
    return function (str, len) {
        if (!str) {
            return "";
        }
        if (str.length * 2 <= len) {
            return str;
        }
        var strlen = 0;
        var s = "";
        for (var i = 0; i < str.length; i++) {
            s = s + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if (strlen >= len) {
                    return s.substring(0, s.length - 1) + "...";
                }
            } else {
                strlen = strlen + 1;
                if (strlen >= len) {
                    return s.substring(0, s.length - 2) + "...";
                }
            }
        }
        return s;
    };
});

/**
 * 字符串处理
 */
seeds.service('strService', function () {
    /**
     * 截取字符串
     * @param str 字符串
     * @param len 截取的长度
     * @returns   xxx...
     */
    this.subStr = function (str, len) {
        if (str.length * 2 <= len) {
            return str;
        }
        var strlen = 0;
        var s = "";
        for (var i = 0; i < str.length; i++) {
            s = s + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if (strlen >= len) {
                    return s.substring(0, s.length - 1) + "...";
                }
            } else {
                strlen = strlen + 1;
                if (strlen >= len) {
                    return s.substring(0, s.length - 2) + "...";
                }
            }
        }
        return s;
    };
});

/**
 * 数组处理
 */
seeds.service('arrayService', function () {
    /**
     * 去重
     * @param arr
     * @returns {Array}
     */
    this.unique = function (arr) {
        var ret = [];
        var hash = {};
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var key = typeof(item) + item;
            if (hash[key] !== 1) {
                ret.push(item);
                hash[key] = 1;
            }
        }
        return ret;
    };
    /**
     * 去重
     * @param arr
     * @returns {Array}
     */
    this.uniqueOrder = function (arr) {
        var ret = [];
        var hash = {};
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var key = typeof(item.orderPk) + item.orderPk;
            if (hash[key] !== 1) {
                ret.push(item);
                hash[key] = 1;
            }
        }
        return ret;
    };
});

/**
 * 时间
 */
seeds.service('dateService', function () {
    this.formatTen = function (num) {
        return num > 9 ? (num + "") : ("0" + num);
    };
    /**
     * 格式化中国标准时间
     * @param date 时间
     * @returns yyyy-mm-dd格式
     */
    this.formatDate = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + this.formatTen(month) + "-" + this.formatTen(day);
    };

    /**
     * 格式化中国标准时间
     * @param date 时间
     * @returns yyyy-mm格式
     */
    this.formatYearM = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        return year + this.formatTen(month);
    };

    /**
     * 格式化带小时的时间
     * @param date 时间
     * @returns yyyy-MM-dd hh:mm
     */
    this.formatDateTime = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this.formatTen(minute);
    };

    /**
     * 格式化成“Y-m-d h:i:s”
     */
    this.formatDateSeconds = function (date, fmtType) {
        var formatType = typeof fmtType != 'undefined' ? fmtType : 'yy-mm-dd hh:ii:ss';
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var returnStr = "";
        switch (formatType) {
            case "yy/mm/dd hh:ii:ss":
                returnStr = year + "/" + this.formatTen(month) + "/" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this.formatTen(minute) + ":" + this.formatTen(second);
                break;
            default:
                returnStr = year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this.formatTen(minute) + ":" + this.formatTen(second);
                break;
        }
        return returnStr;
    };

    /**
     * 得到当前时间
     * @returns 当前时间
     */
    this.getCurrentTime = function () {
        return this.formatDate(new Date());
    };
});

/**
 * 获取当前设备
 */
seeds.service('deviceService', function () {
    /**
     * 获取设备
     * @returns {*}
     */
    this.getDevice = function () {
        return ionic.Platform.platform();
    };

    /**
     * 客户端类型android:1 ios :2 windowsPhone:3 其他:4
     * @returns {string}
     */
    this.getClientType = function () {
        var device = this.getDevice();
        var clientType = '4';
        if (device == 'windowsphone') {
            clientType = '3'
        } else if (device == 'ios') {
            clientType = '2'
        } else if (device == 'android') {
            clientType = '1'
        }
        return clientType;
    }
});

/**
 * 验证
 */
seeds.service('validataService', function () {
    /**
     * 验证邮箱 手机号码 电话号码
     * @param val   值
     * @param type  类型(邮箱:email 手机:mobile 电话号码:tel)
     * @param showMsgService
     * @returns 是否正确
     */
    this.check = function (val, type, showMsgService) {
        if (typeof val == 'undefined' || val.length == 0) {
            if (type == 'email') {
                showMsgService.showMsg('邮箱不能为空!');
            } else if (type == 'mobile') {
                showMsgService.showMsg('手机号码不能为空!');
            } else if (type == 'tel') {
                showMsgService.showMsg('电话号码不能为空!');
            }
            return false;
        }

        if (type == 'email') {
            var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        } else if (type == 'mobile') {
            var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
        } else if (type == 'tel') {
            var reg = /^(([0+]d{2,3}-)?(0d{2,3})-)?(d{7,8})(-(d{3,}))?$/;
        }
        if (reg.test(val) == false) {
            if (type == 'email') {
                showMsgService.showMsg('邮箱格式不正确!');
            } else if (type == 'mobile') {
                showMsgService.showMsg('手机格式不正确!');
            } else if (type == 'tel') {
                showMsgService.showMsg('电话号码格式不正确!');
            }
            return false;
        }
        return true;
    };
});

/**
 * 对象处理
 */
seeds.service('objService', function () {
    //是否为空
    this.objIsEmp = function (obj) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    };
    //过滤undefined
    this.filtUndef = function (arr) {
        for (i in arr) {
            if (typeof arr[i] == 'undefined') {
                delete arr[i];
            }
        }
        return arr;
    };
});

/**
 * 缓存
 */
seeds.service('propertyCache', ['$cacheFactory', function ($cacheFactory) {
    var realCache = $cacheFactory('propertyCache'); // angularjs自身的cacheFactory缓存机制
    // 自定义的缓存机制
    var customCache = {
        get: function (cacheId) {
            var record = realCache.get(cacheId);
            if (record) {
                var curTime = new Date().getTime();
                if (curTime - record.startTime > record.expireTime) {
                    realCache.remove(cacheId);
                    return realCache.get(cacheId);
                } else {
                    return record.data;
                }
            } else {
                return record
            }
            return record
        },
        put: function (cacheId, value, expireTime) {
            if (typeof expireTime == 'undefined') {
                expireTime = 600000;  // 缓存的有效时间，默认为10分钟
            }
            var record = {
                startTime: new Date().getTime(),
                expireTime: expireTime,
                data: value
            };
            return realCache.put(cacheId, record);
        },
        remove: function (cacheId) {
            return realCache.remove(cacheId);
        },
        removeAll: function () {
            return realCache.removeAll();
        }
    };
    return customCache;
}]);

/**
 * 字符串截取
 */
seeds.filter('limitSlice', function () {
    return function (sSource, iLen) {
        var str = "";
        // input是我们传入的字符串
        if (sSource) {
            if (sSource.replace(/[^x00-xff]/g, "xx").length <= iLen) {
                return sSource;
            }
            var len = 0;
            var schar;
            var charCodeNo;
            for (var i = 0; i < sSource.length; i++) {
                charCodeNo = sSource.charCodeAt(i);
                schar = sSource.charAt(i);
                var charLen = charCodeNo >= 0 && charCodeNo <= 128 ? 1 : 2;
                if (len + charLen <= iLen) {
                    str += schar;
                    len += charLen;
                    continue;
                }
                break;
            }
            var newLen = str.length;
            var specialChar = str.charAt(newLen - 1);
            var pattern = new RegExp("[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,。.、]");
            if (pattern.test(specialChar)) {
                str = str.substr(0, newLen - 1);
            }
            str += '…';
        }
        return str;
    };
});




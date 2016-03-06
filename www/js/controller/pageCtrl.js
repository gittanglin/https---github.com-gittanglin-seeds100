seeds.controller('loginCtrl', ['$scope', '$state', 'showMsgService', 'jsonpService', function ($scope, $state, showMsgService, jsonpService) {
    //cordova
    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady() {
        if (localStorage.getItem('id') && localStorage.getItem('isOpen') == 'success') {
            window.location.href = 'seeds.html';
            return false;
        }
    }

    $scope.login = {};
    //登陆
    $scope.loginBtn = function () {
        if (!$scope.login.phone) {
            showMsgService.showMsg('手机号码不能为空');
            return false;
        }
        var reg = /^0?(13|15|17|18|14)[0-9]{9}$/;
        if (reg.test($scope.login.phone) != true) {
            showMsgService.showMsg('手机号码格式不正确');
            return false;
        }
        if (!$scope.login.pwd) {
            showMsgService.showMsg('密码不能为空');
            return false;
        }
        var params = {
            userName: $scope.login.phone,
            password: $scope.login.pwd
        };
        jsonpService.jsonpData('login', params).then(function (data) {
            if (data.result == 'success') {
                if (data.token) {
                    localStorage.setItem('id', data.token.id);
                    localStorage.setItem('phone', data.token.phone);
                    localStorage.setItem('pId', data.token.pId);
                    localStorage.setItem('username', data.token.username);
                    //是否开通
                    jsonpService.jsonpData('isOpen', {id: data.token.id}).then(function (data) {
                        if (data) {
                            localStorage.setItem('isOpen', data.result);
                            if (data.result == 'success') {
                                window.location.href = 'seeds.html'
                            } else {
                                $state.go('open');
                            }
                        }
                    });
                }
            } else {
                showMsgService.showMsg(data.msg);
                return false;
            }
        })
    };
    //注册
    $scope.register = function () {
        $state.go('register');
    };
    //忘记密码
    $scope.forgetPass = function () {
        $state.go('forgetPass');
    }
}]);

//注册
seeds.controller('registerCtrl', ['$scope', '$state', '$ionicPopup', 'showMsgService', 'jsonpService', function ($scope, $state, $ionicPopup, showMsgService, jsonpService) {
    $scope.register = {};
    $scope.register.showVCode = true;
    $scope.register.showReVCode = false;
    //返回键
    $scope.goBack = function () {
        $state.go('login');
    };
    $scope.getVCode = function () {

        //获取验证码
        if (!$scope.register.phone) {
            showMsgService.showMsg('请输入手机号');
            flag = true;
            return false;
        }
        var reg = /^0?(13|15|17|18|14)[0-9]{9}$/;
        if (reg.test($scope.register.phone) != true) {
            showMsgService.showMsg('手机号格式不正确');
            return false;
        }
        $scope.register.showVCode = false;
        $scope.register.showReVCode = true;
        $scope.minuteTxt = '正在发送...';
        jsonpService.jsonpData('sendcode', {phone: $scope.register.phone}).then(function (data) {
            if (data) {
                if (data.result == 'success') {
                    $scope.register.showVCode = false;
                    $scope.register.showReVCode = true;
                    $scope.minute = 60;
                    var time = setInterval(function () {
                        $scope.minute--;
                        $scope.minuteTxt = $scope.minute + 'S重新获取';
                        $scope.$digest();
                    }, 1000);
                    setTimeout(function () {
                        $scope.register.showVCode = true;
                        $scope.register.showReVCode = false;
                        $scope.minute = 0;
                        $scope.minuteTxt = $scope.minute + 'S重新获取';
                        $scope.$digest();
                        clearInterval(time);
                    }, 60000);
                } else {
                    $scope.register.showVCode = true;
                    $scope.register.showReVCode = false;
                    showMsgService.showMsg(data.msg);
                }
            }
        })
    };
    //注册
    $scope.registerBtn = function () {
        if (!$scope.register.pId) {
            showMsgService.showMsg('请输入介绍人编码');
            return false;
        }
        if (!$scope.register.username) {
            showMsgService.showMsg('请输入真实姓名');
            return false;
        }
        if (!$scope.register.pwd) {
            showMsgService.showMsg('请输入密码');
            return false;
        }
        var pwdTest = new RegExp(/^[0-9a-zA-Z_]{6,12}$/);
        //var pwdTest = /^(?=[a-zA-Z0-9]*\d)(?=[a-zA-Z0-9]*[a-zA-Z])[a-zA-Z0-9]{6,12}$/;
        if (pwdTest.test($scope.register.pwd) != true) {
            showMsgService.showMsg('密码格式不正确');
            return false;
        }
        if (!$scope.register.repwd) {
            showMsgService.showMsg('请再次确认密码');
            return false;
        }
        if ($scope.register.repwd != $scope.register.pwd) {
            showMsgService.showMsg('两次密码不一致');
            return false;
        }
        if (!$scope.register.phone) {
            showMsgService.showMsg('请输入手机号');
            return false;
        }
        var reg = /^0?(13|15|17|18|14)[0-9]{9}$/;
        if (reg.test($scope.register.phone) != true) {
            showMsgService.showMsg('手机号格式不正确');
            return false;
        }
        if (!$scope.register.vCode) {
            showMsgService.showMsg('请输入验证码');
            return false;
        }
        var params = {
            pId: $scope.register.pId,
            mobile: $scope.register.phone,
            userName: $scope.register.username,
            password: $scope.register.pwd,
            vCode: $scope.register.vCode
        };
        jsonpService.jsonpData('register', params).then(function (data) {
            if (data) {
                if (data.result == 'success') {
                    $ionicPopup.alert({
                        title: data.msg,
                        okText: '确定'
                    }).then(function (res) {
                        var params = {
                            userName: $scope.register.phone,
                            password: $scope.register.pwd
                        };
                        jsonpService.jsonpData('login', params).then(function (data) {
                            if (data.result == 'success') {
                                if (data.token) {
                                    localStorage.setItem('id', data.token.id);
                                    localStorage.setItem('phone', data.token.phone);
                                    localStorage.setItem('pId', data.token.pId);
                                    localStorage.setItem('username', data.token.username);
                                    $state.go('open');
                                }
                            } else {
                                showMsgService.showMsg(data.msg);
                                return false;
                            }
                        })

                    });
                } else {
                    showMsgService.showMsg(data.msg);
                    return false;
                }
            }
        })
    }
}]);


//忘记密码
seeds.controller('forgetPassCtrl', ['$scope', '$state', '$ionicPopup', 'showMsgService', 'jsonpService', function ($scope, $state, $ionicPopup, showMsgService, jsonpService) {
    $scope.forgetPass = {};
    $scope.forgetPass.showVCode = true;
    $scope.forgetPass.showReVCode = false;
    //返回
    $scope.goBack = function () {
        $state.go('login');
    };
    $scope.getVCode = function () {
        //获取验证码
        if (!$scope.forgetPass.phone) {
            showMsgService.showMsg('请输入手机号');
            return false;
        }
        var reg = /^0?(13|15|17|18|14)[0-9]{9}$/;
        if (reg.test($scope.forgetPass.phone) != true) {
            showMsgService.showMsg('手机号格式不正确');
            return false;
        }
        $scope.forgetPass.showReVCode = true;
        $scope.forgetPass.showVCode = false;
        $scope.minuteTxt = '正在发送...';
        jsonpService.jsonpData('sendcode', {phone: $scope.forgetPass.phone}).then(function (data) {
            if (data) {
                if (data.result == 'success') {
                    $scope.forgetPass.showReVCode = true;
                    $scope.forgetPass.showVCode = false;
                    $scope.minute = 60;
                    var time = setInterval(function () {
                        $scope.minute--;
                        $scope.minuteTxt = $scope.minute + 'S重新获取';
                        $scope.$digest();
                    }, 1000);
                    setTimeout(function () {
                        $scope.forgetPass.showVCode = true;
                        $scope.forgetPass.showReVCode = false;
                        $scope.minute = 0;
                        $scope.minuteTxt = $scope.minute + 'S重新获取';
                        $scope.$digest();
                        clearInterval(time);
                    }, 60000);
                } else {
                    $scope.forgetPass.showVCode = true;
                    $scope.forgetPass.showReVCode = false;
                    $scope.minute = 0;
                    showMsgService.showMsg(data.msg);
                }
            }
        })
    };
    //重置密码
    $scope.resetPassword = function () {
        if (!$scope.forgetPass.phone) {
            showMsgService.showMsg('请输入手机号');
            return false;
        }
        if (!$scope.forgetPass.vCode) {
            showMsgService.showMsg('请输入验证码');
            return false;
        }
        if (!$scope.forgetPass.newPwd) {
            showMsgService.showMsg('请输入新密码');
            return false;
        }
        var pwdTest = new RegExp(/^[0-9a-zA-Z_]{6,12}$/);
        //var pwdTest = /^(?=[a-zA-Z0-9]*\d)(?=[a-zA-Z0-9]*[a-zA-Z])[a-zA-Z0-9]{6,12}$/;
        if (pwdTest.test($scope.forgetPass.newPwd) != true) {
            showMsgService.showMsg('密码格式不正确');
            return false;
        }
        if (!$scope.forgetPass.rePwd) {
            showMsgService.showMsg('请确认新密码');
            return false;
        }
        if ($scope.forgetPass.newPwd != $scope.forgetPass.rePwd) {
            showMsgService.showMsg('两次密码不一致');
            return false;
        }
        var parms = {
            phone: $scope.forgetPass.phone,
            password: $scope.forgetPass.rePwd,
            vCode: $scope.forgetPass.vCode
        };
        jsonpService.jsonpData('forgetpassword', parms).then(function (data) {
            if (data.result == 'success') {
                $ionicPopup.alert({
                    title: data.msg,
                    okText: '确定'
                }).then(function (res) {

                    $state.go('login');
                });
            } else {
                showMsgService.showMsg(data.msg);
                return false;
            }
        })

    }
}]);

//开通
seeds.controller('openCtrl', ['$scope', '$state', 'showMsgService', 'jsonpService', function ($scope, $state, showMsgService, jsonpService) {
    if (!sessionStorage.getItem('openList')) {
        jsonpService.jsonpData('getFalseData', {}).then(function (data) {
            if (data.result == 'success') {
                $scope.dataList = data.data;
                sessionStorage.setItem('openList', JSON.stringify(data.data));
            } else {
                $scope.dataList = [];
                sessionStorage.setItem('openList', '[]');
            }
        });
    } else {
        $scope.dataList = JSON.parse(sessionStorage.getItem('openList'));
    }

    //开通
    $scope.openCk = function () {

        $state.go('pay');
    };
    //取消
    $scope.cancelCk = function () {
        $state.go('login');
    }
}]);


//支付
seeds.controller('payCtrl', ['$scope', '$state', '$ionicPopup', 'showMsgService', 'jsonpService', function ($scope, $state, $ionicPopup, showMsgService, jsonpService) {
    //支付
    $scope.pay = function (type) {
        var payCode = '';
        if (type == 'alipay') {
            payCode = 'ALIPAY';
        } else {
            payCode = 'WXPAY';
        }
        jsonpService.jsonpData('open', {
            id: localStorage.getItem('id'),
            username: localStorage.getItem('username'),
            typecode: payCode
        }).then(function (data) {
            if (data.result == 'success') {
                goUrl(data.url);
            } else {
                showMsgService.showMsg('程序异常');
                return false;
            }
        });
    };
    var goUrl = function (url) {
        var goUrlOption = window.open(url, '_blank', 'location=yes');
        goUrlOption.addEventListener('exit', urlClose);
    };

    function urlClose() {
        $ionicPopup.confirm({
            cancelText: '支付完成',
            okText: '继续支付'
        }).then(function (res) {
            if (res) {
            } else {
                jsonpService.jsonpData('isOpen', {id: localStorage.getItem('id')}).then(function (data) {
                    if (data) {
                        if (data.result == 'success') {
                            window.location.href = 'seeds.html'
                        } else {
                            showMsgService.showMsg('尚未支付,请支付');
                            return false;
                        }
                    }
                });
            }
        });
    }

    $scope.cancelCk = function () {
        $state.go('open');
    }
}]);



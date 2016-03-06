//app home
seeds.controller('seedsAppCtrl', ['$scope', '$state', '$ionicHistory', function ($scope, $state, $ionicHistory) {
    //cordova
    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady() {

    };
    $state.go('main.home');
    //所有返回处理
    $scope.goBack = function () {
        var currentStateName = $ionicHistory.currentStateName();
        console.log(currentStateName);
        switch (currentStateName) {
            case 'main.myBankList':
                $state.go('main.money');
                break;
            default:
                $ionicHistory.goBack();
                break;
        }
    };
}]);

//home 页
seeds.controller('homeCtrl', ['$scope', '$state', '$ionicPopup', 'jsonpService', 'showMsgService', function ($scope, $state, $ionicPopup, jsonpService, showMsgService) {

    //跑马灯
    if (!sessionStorage.getItem('showInfo')) {
        jsonpService.jsonpData('bulletin', {}).then(function (data) {
            if (data.result == 'success' && data.data) {
                var arr = data.data;
                sessionStorage.setItem('infoImg', data.image);
                if (arr.length > 0) {
                    $scope.showInfo = arr[0].content;
                    sessionStorage.setItem('showInfo', arr[0].content);
                }
            } else {
                showMsgService.showMsg(data.msg);
                return false;
            }
        });
    } else {
        $scope.showInfo = sessionStorage.getItem('showInfo');
    }


    $scope.userAccount = {};

    //下拉刷新
    $scope.doRefresh = function () {
        $scope.getUserAccount();
        $scope.$broadcast('scroll.refreshComplete');
    };

    var flag = true;
    $scope.payMonth = function () {
        if (flag == false) {
            return false;
        }
        flag = false;
        jsonpService.jsonpData('isFreeze', {id: localStorage.getItem('id')}).then(function (data) {
            flag = true;
            if (data.result == 'fail') {
                $ionicPopup.confirm({
                    template: data.msg,
                    cancelText: '取消',
                    okText: '解冻'
                }).then(function (res) {
                    flag = true;
                    if (res) {
                        $state.go('main.homePay')
                    }
                });
            } else {
            }
        });
    }
    $scope.getUserAccount = function () {
        //获取用户详情
        jsonpService.jsonpData('getUserAcount', {id: localStorage.getItem('id')}).then(function (data) {
            if (data) {
                if (data.result == 'success') {
                    $scope.userAccount.user_name = data.user_name;
                    $scope.userAccount.account_name = data.account_name;
                    $scope.userAccount.total_money = numFormat(parseInt(data.totalMoney));
                    $scope.userAccount.getMoney = numFormat((parseInt(data.getMoney)));
                    $scope.userAccount.freeMoney = numFormat((parseInt(data.freeMoney)));
                    $scope.userAccount.thisMonthMoney = numFormat((parseInt(data.thisMonthMoney)));
                    $scope.userAccount.id = localStorage.getItem('id');
                    $scope.userAccount.account_status = data.account_status;
                    sessionStorage.setItem('getMoney', numFormat(parseInt(data.getMoney)));
                    sessionStorage.setItem('thisMonthMoney', numFormat(parseInt(data.thisMonthMoney)));
                    sessionStorage.setItem('freeMoney', numFormat(parseInt(data.freeMoney)));
                } else {
                    $scope.userAccount.user_name = '';
                    $scope.userAccount.total_money = 0.00;
                    sessionStorage.setItem('total_money', '0.00');
                }
            }
        });
    };

    function numFormat(num) {
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }

    $scope.getUserAccount();
    //设置
    $scope.settings = function () {
        $state.go('main.setting');
    }

}]);

//支付
seeds.controller('homePayCtrl', ['$scope', '$state', '$ionicPopup', 'showMsgService', 'jsonpService', function ($scope, $state, $ionicPopup, showMsgService, jsonpService) {
    //支付
    $scope.pay = function (type) {
        var payCode = '';
        if (type == 'alipay') {
            payCode = 'ALIPAY';
        } else {
            payCode = 'WXPAY';
        }
        jsonpService.jsonpData('removefreeze', {
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
                jsonpService.jsonpData('isFreeze', {id: localStorage.getItem('id')}).then(function (data) {
                    if (data) {
                        if (data.result == 'success') {
                            $state.go('main.home')
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
        $state.go('main.home')
    }
}]);

//home---设置
seeds.controller('settingsCtrl', ['$scope', '$state', 'jsonpService', function ($scope, $state, jsonpService) {
    $scope.updatePwd = function () {
        $state.go('main.updatePwd');
    };

    //注销登陆
    $scope.loginOut = function () {
        localStorage.clear();
        window.location.href = 'index.html';
    }

}]);

//资讯
seeds.controller('informationCtrl', ['$scope', '$state', '$ionicPopup', 'showMsgService', 'jsonpService', function ($scope, $state, $ionicPopup, showMsgService, jsonpService) {
    $scope.infoList = [];


    //跑马灯
    if (!sessionStorage.getItem('showInfo')) {
        jsonpService.jsonpData('bulletin', {}).then(function (data) {
            if (data.result == 'success' && data.data) {
                var arr = data.data;
                sessionStorage.setItem('infoImg', data.image);
                if (arr.length > 0) {
                    $scope.showInfo = arr[0].content;
                    sessionStorage.setItem('showInfo', arr[0].content);
                }
            } else {
                showMsgService.showMsg(data.msg);
                return false;
            }
        });
    } else {
        $scope.showInfo = sessionStorage.getItem('showInfo');
    }

    $scope.doRefresh = function () {
        jsonpService.jsonpData('information', {}).then(function (data) {
            if (data.result == 'success') {
                $scope.infoList = data.data;
                sessionStorage.setItem('infoList', JSON.stringify(data.data));
            } else {
                showMsgService.showMsg(data.msg);
                return false;
            }
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    if (sessionStorage.getItem('infoList')) {
        $scope.infoList = JSON.parse(sessionStorage.getItem('infoList'));
    } else {
        jsonpService.jsonpData('information', {}).then(function (data) {
            if (data.result == 'success') {
                $scope.infoList = data.data;

                sessionStorage.setItem('infoList', JSON.stringify(data.data));
            } else {
                showMsgService.showMsg(data.msg);
                return false;
            }
        });
    }

    $scope.detail = function (bank) {
        $state.go('main.informationDetail', {informationDetail: bank});
    }
}]);
//资讯
seeds.controller('informationDetailCtrl', ['$scope', '$state', '$stateParams', '$ionicPopup', 'showMsgService', 'jsonpService', function ($scope, $state, $stateParams, $ionicPopup, showMsgService, jsonpService) {
    $scope.detail = $stateParams.informationDetail;

}]);

//重置密码
seeds.controller('updatePwdCtrl', ['$scope', '$state', '$ionicPopup', 'showMsgService', 'jsonpService', function ($scope, $state, $ionicPopup, showMsgService, jsonpService) {

    $scope.resetPwd = {};
    //返回
    $scope.goBack = function () {
        $state.go('main.setting');
    };
    //重置密码
    $scope.wallet = function () {
        if (!$scope.resetPwd.oldPwd) {
            showMsgService.showMsg('请输入旧密码');
            return false;
        }
        if (!$scope.resetPwd.newPwd) {
            showMsgService.showMsg('请输入新密码');
            return false;
        }
        var pwdTest = new RegExp(/^[0-9a-zA-Z_]{6,12}$/);
        // var pwdTest = /^(?=[a-zA-Z0-9]*\d)(?=[a-zA-Z0-9]*[a-zA-Z])[a-zA-Z0-9]{6,12}$/;
        if (pwdTest.test($scope.resetPwd.newPwd) != true) {
            showMsgService.showMsg('密码格式不正确');
            return false;
        }
        if (!$scope.resetPwd.reNewPwd) {
            showMsgService.showMsg('请确认新密码');
            return false;
        }

        if ($scope.resetPwd.newPwd != $scope.resetPwd.reNewPwd) {
            showMsgService.showMsg('两次密码不一致');
            return false;
        }
        var params = {
            id: localStorage.getItem('id'),
            password: $scope.resetPwd.oldPwd,
            newpassword: $scope.resetPwd.reNewPwd
        };
        jsonpService.jsonpData('updatepassword', params).then(function (data) {
            if (data) {
                if (data.result == 'success') {
                    $ionicPopup.alert({
                        title: data.msg,
                        okText: '确定'
                    }).then(function (res) {
                        $state.go('main.home');
                    });
                } else {
                    showMsgService.showMsg(data.msg);
                    return false;
                }
            }
        });
    }
}]);

//钱包
seeds.controller('moneyCtrl', ['$scope', '$state', '$ionicPopup', 'showMsgService', 'jsonpService', function ($scope, $state, $ionicPopup, showMsgService, jsonpService) {
    $scope.money = {};
    if (sessionStorage.getItem('getMoney')) {
        if (sessionStorage.getItem('getMoney') == 'null' || sessionStorage.getItem('getMoney') == 'NAN') {
            $scope.money.getMoney = '0.00';
        } else {
            $scope.money.getMoney = sessionStorage.getItem('getMoney');
        }
    }
    if (sessionStorage.getItem('thisMonthMoney')) {
        if (sessionStorage.getItem('thisMonthMoney') == 'null' || sessionStorage.getItem('getMoney') == 'NAN') {
            $scope.money.thisMonthMoney = '0.00';
        } else {
            $scope.money.thisMonthMoney = sessionStorage.getItem('thisMonthMoney');
        }
    }
    if (sessionStorage.getItem('freeMoney')) {
        if (sessionStorage.getItem('freeMoney') == 'null' || sessionStorage.getItem('getMoney') == 'NAN') {
            $scope.money.freeMoney = '0.00';
        } else {
            $scope.money.freeMoney = sessionStorage.getItem('freeMoney');
        }
    }

    //跑马灯
    if (!sessionStorage.getItem('showInfo')) {
        jsonpService.jsonpData('bulletin', {}).then(function (data) {
            if (data.result == 'success' && data.data) {
                var arr = data.data;
                sessionStorage.setItem('infoImg', data.image);
                if (arr.length > 0) {
                    $scope.showInfo = arr[0].content;
                    sessionStorage.setItem('showInfo', arr[0].content);
                }
            } else {
                showMsgService.showMsg(data.msg);
                return false;
            }
        });
    } else {
        $scope.showInfo = sessionStorage.getItem('showInfo');
    }
    var flag = true;
    //提取现金
    $scope.getMoney = function () {
        if (flag == false) {
            return false;
        }
        flag = false;
        jsonpService.jsonpData('isFreeze', {id: localStorage.getItem('id')}).then(function (data) {
            if (data.result == 'fail') {
                $ionicPopup.confirm({
                    template: data.msg,
                    cancelText: '取消',
                    okText: '解冻'
                }).then(function (res) {
                    flag = true;
                    if (res) {
                        $state.go('main.pay')
                    }
                });
            } else {
                $ionicPopup.prompt({
                    title: '请输入提现金额(小于1000元收取10元手续费)',
                    cancelText: '取消',
                    okText: '确认'
                }).then(function (res) {
                    flag = true;
                    if (res) {
                        try {
                             var money = parseInt(res);
                            if (money <= 10) {
                                showMsgService.showMsg('提现金额不能小于或等于10');
                                return false;
                            } else {
                                if (!isNaN(parseInt(res))) {
                                    jsonpService.jsonpData('getMoney', {
                                        id: localStorage.getItem('id'),
                                        money: parseInt(res)
                                    }).then(function (data) {
                                        showMsgService.showMsg(data.msg);
                                        if (data.result == 'success') {
                                            //获取用户详情
                                            jsonpService.jsonpData('getUserAcount', {id: localStorage.getItem('id')}).then(function (data) {
                                                if (data) {
                                                    if (data.result == 'success') {
                                                        sessionStorage.setItem('getMoney', numFormat(parseInt(data.getMoney)));
                                                        sessionStorage.setItem('thisMonthMoney', numFormat(parseInt(data.thisMonthMoney)));
                                                        sessionStorage.setItem('freeMoney', numFormat(parseInt(data.freeMoney)));
                                                        $scope.money.getMoney = sessionStorage.getItem('getMoney');
                                                        $scope.money.thisMonthMoney = sessionStorage.getItem('thisMonthMoney');
                                                        $scope.money.freeMoney = sessionStorage.getItem('freeMoney');
                                                    }
                                                } else {
                                                }
                                            });
                                        } else {
                                        }
                                    });
                                } else {
                                    showMsgService.showMsg('请正确输入您的提现金额');
                                    return false;
                                }
                            }
                        } catch (e) {
                            showMsgService.showMsg('请正确输入您的提现金额');
                            return false;
                        }
                    }
                });
            }
        });
    };

    function numFormat(num) {
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }

    //我的银行卡
    $scope.myBankCard = function () {
        if (flag) {
            jsonpService.jsonpData('listBankInfo', {id: localStorage.getItem('id')}).then(function (data) {
                if (data) {
                    if (data.result == 'success') {
                        var list = data.info;
                        for (var i in list) {
                            var bank = list[i];
                            if (bank.bindcard_status == '1') {
                                var newBank =
                                {
                                    'bankCode': bank.bank_code,
                                    'bankName': bank.bank_name,
                                    'openBank': bank.bank_openname,
                                    'bankCardNo': bank.bank_card
                                };
                                $scope.bankCard = newBank;
                                $state.go('main.myBankCard', {bankCard: newBank});
                            } else {
                                $state.go('main.myBankList');
                            }
                        }
                    } else {
                        showMsgService.showMsg(data.msg);
                        return false;
                    }
                }
            });
        }
    };

    //收入明细
    $scope.income = function () {
        if (flag) {
            $state.go('main.income')
        }
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
        jsonpService.jsonpData('removefreeze', {
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
                jsonpService.jsonpData('isFreeze', {id: localStorage.getItem('id')}).then(function (data) {
                    if (data) {
                        if (data.result == 'success') {
                            $state.go('main.money')
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
        $state.go('main.money');
    }
}]);

//钱包--收入明细
seeds.controller('incomeCtrl', ['$scope', '$state', 'showMsgService', 'jsonpService', function ($scope, $state, showMsgService, jsonpService) {
    $scope.incomeDetail = {};
    $scope.incomeDetail.showUnList = false;
    jsonpService.jsonpData('getMoneyDetail', {id: localStorage.getItem('id')}).then(function (data) {
        if (data) {
            if (data.result == 'success') {
                var data = data.data;
                var list = data;
                for (var i = 0; i < list.length; i++) {
                    var money = list[i].d_money;
                    money.toString;
                    list[i].d_money = numFormat(parseInt(money));
                }
                $scope.incomeDetail.list = list;
                $scope.incomeDetail.count = data.length;
                if ($scope.incomeDetail.count <= 0) $scope.incomeDetail.showUnList = true;
            } else {
                showMsgService.showMsg(data.msg);
                return false;
            }
        }
    });
    function numFormat(num) {
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }
}]);

//钱包---银行卡列表
seeds.controller('myBankListCtrl', ['$scope', '$state', 'showMsgService', 'jsonpService', function ($scope, $state, showMsgService, jsonpService) {
    $scope.bank = {};
    $scope.bankList = [];
    jsonpService.jsonpData('listBankInfo', {id: localStorage.getItem('id')}).then(function (data) {
        if (data) {
            if (data.result == 'success') {
                var list = data.info;
                for (var i in list) {
                    var bank = list[i];
                    if (bank.bindcard_status == '1') {
                        var newBank =
                        {
                            'bankCode': bank.bank_code,
                            'bankName': bank.bank_name,
                            'openBank': bank.bank_openname,
                            'bankCardNo': bank.bank_card
                        };
                        $scope.bankList.push(newBank);
                        $scope.bank.showAdd = false;
                    } else {
                        $scope.bank.showAdd = true;
                    }
                }
            } else {
                showMsgService.showMsg(data.msg);
                return false;
            }
        }
    });
    $scope.bankDetail = function (id) {
        for (var i in $scope.bankList) {
            var bank = $scope.bankList[i];
            if (id == bank.id) {
                $state.go('main.myBankCard', {bankCard: bank});
                break;
            }
        }

    };
    //添加银行卡
    $scope.addBank = function () {
        $state.go('main.addBank', {bankCard: {}});
    }
}]);

//钱包---我的银行卡
seeds.controller('myBankCardCtrl', ['$scope', '$state', '$stateParams', '$ionicPopup', 'showMsgService', 'jsonpService', function ($scope, $state, $stateParams, $ionicPopup, showMsgService, jsonpService) {
    $scope.bankCard = $stateParams.bankCard;
    $scope.bankCard.userName = localStorage.getItem('username');
    $scope.bankList =
        [
            {'bankCode': '981', 'bankName': '交通银行'},
            {'bankCode': '965', 'bankName': '中国建设银行'},
            {'bankCode': '970', 'bankName': '招商银行'},
            {'bankCode': '967', 'bankName': '中国工商银行'},
            {'bankCode': '964', 'bankName': '中国农业银行'}
        ];

    $scope.eidtBank = function () {
        document.getElementById('edit').style.display = 'block';
        document.getElementById('show').style.display = 'none';
    };
    $scope.updateBank = function () {
        if (!$scope.bankCard.bankCardNo) {
            showMsgService.showMsg('请填写银行卡号');
            return false;
        }
        var bankReg = /^(\d{16}|\d{19})$/;
        if (bankReg.test($scope.bankCard.bankCardNo) != true) {
            showMsgService.showMsg('银行卡号格式不正确');
            return false;
        }
        if (!$scope.bankCard.bankCode) {
            showMsgService.showMsg('请选择银行');
            return false;
        }
        if (!$scope.bankCard.openBank) {
            showMsgService.showMsg('请输入开户行');
            return false;
        }
        var parms = {
            id: localStorage.getItem('id'),
            bankName: $scope.bankCard.bankName,
            bankOpenName: $scope.bankCard.openBank,
            bankCode: $scope.bankCard.bankCode,
            bankNum: $scope.bankCard.bankCardNo
        };
        jsonpService.jsonpData('updateBankCard', parms).then(function (data) {
            if (data) {
                if (data.result == 'success') {
                    $ionicPopup.alert({
                        title: data.msg,
                        okText: '确定'
                    }).then(function (res) {
                        $state.go('main.money');
                    });
                } else {
                    showMsgService.showMsg(data.msg);
                    return false;
                }
            }
        });

    }
}]);

//钱包---添加银行卡1
seeds.controller('addBankCtrl', ['$scope', '$state', '$ionicPopup', 'showMsgService', 'jsonpService', function ($scope, $state, $ionicPopup, showMsgService, jsonpService) {
    $scope.bankCard = {};

    $scope.bankCard.userName = localStorage.getItem('username');
    $scope.bankList =
        [
            {'bankCode': '981', 'bankName': '交通银行'},
            {'bankCode': '965', 'bankName': '中国建设银行'},
            {'bankCode': '970', 'bankName': '招商银行'},
            {'bankCode': '967', 'bankName': '中国工商银行'},
            {'bankCode': '964', 'bankName': '中国农业银行'}
        ];

    $scope.nextCk = function () {
        if (!$scope.bankCard.bankCardNo) {
            showMsgService.showMsg('请填写银行卡号');
            return false;
        }
        var bankReg = /^(\d{16}|\d{19})$/;
        if (bankReg.test($scope.bankCard.bankCardNo) != true) {
            showMsgService.showMsg('银行卡号格式不正确');
            return false;
        }
        if (!$scope.bankCard.bankCode) {
            showMsgService.showMsg('请选择银行');
            return false;
        }
        if (!$scope.bankCard.openBank) {
            showMsgService.showMsg('请输入开户行');
            return false;
        }
        for (var i in $scope.bankList) {
            var bank = $scope.bankList[i];
            if ($scope.bankCard.bankCode == bank.bankCode) {
                var params = {
                    id: localStorage.getItem('id'),
                    bankName: bank.bankName,
                    bankNum: $scope.bankCard.bankCardNo,
                    bankCode: $scope.bankCard.bankCode,
                    bankOpenName: $scope.bankCard.openBank
                };
                jsonpService.jsonpData('bindBankCard', params).then(function (data) {
                    if (data.result == 'success') {
                        $ionicPopup.alert({
                            title: data.msg,
                            okText: '确定'
                        }).then(function (res) {
                            $state.go('main.money');
                        });

                    } else {
                        showMsgService.showMsg(data.msg);
                        return false;
                    }
                });
            }
        }
        // $state.go('main.money');
        //$state.go('main.addCard', {bankCard: $scope.bankCard});
    }
}]);

//钱包---添加银行卡2
seeds.controller('addCardCtrl', ['$scope', '$state', '$stateParams', 'showMsgService', 'jsonpService', function ($scope, $state, $stateParams, showMsgService, jsonpService) {
    $scope.bankList =
        [
            {'bankCode': '981', 'bankName': '交通银行'},
            {'bankCode': '965', 'bankName': '中国建设银行'},
            {'bankCode': '970', 'bankName': '招商银行'},
            {'bankCode': '967', 'bankName': '中国工商银行'},
            {'bankCode': '964', 'bankName': '中国农业银行'}
        ];
    $scope.bankCard = $stateParams.bankCard;

    $scope.saveBank = function () {
        if (!$scope.bankCard.bankCode) {
            showMsgService.showMsg('请选择银行');
            return false;
        }
        if (!$scope.bankCard.openBank) {
            showMsgService.showMsg('请输入开户行');
            return false;
        }
        for (var i in $scope.bankList) {
            var bank = $scope.bankList[i];
            if ($scope.bankCard.bankCode == bank.bankCode) {
                var params = {
                    id: localStorage.getItem('id'),
                    bankName: bank.bankName,
                    bankNum: $scope.bankCard.bankCardNo,
                    bankCode: $scope.bankCard.bankCode,
                    bankOpenName: $scope.bankCard.openBank
                };
                jsonpService.jsonpData('bindBankCard', params).then(function (data) {
                    if (data.result == 'success') {
                        showMsgService.showMsg(data.msg);
                        $state.go('main.money');
                    } else {
                        showMsgService.showMsg(data.msg);
                        return false;
                    }
                });
            }
        }

    }

}]);



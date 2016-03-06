var seeds = angular.module('seedsApp', ['ionic', 'ngIOS9UIWebViewPatch']);

seeds.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.tabs.position("bottom");
});


seeds.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {                                  //tab
            url: '/main',
            'abstract': true,
            templateUrl: "tpls/tab/tabPage.html"
        })
        .state('main.home', {                            //主页
            url: "/home",
            cache: 'false',
            views: {
                'main-home': {
                    templateUrl: "tpls/tab/home.html",
                    controller: "homeCtrl"
                }
            }
        }).state('main.homePay', {                                       //提现
            url: "/homePay",
            cache: 'false',
            views: {
                'main-home': {
                    templateUrl: "tpls/common/pay.html",
                    controller: "homePayCtrl"
                }
            }
        })
        .state('main.setting', {                            //设置
            url: "/setting",
            cache: 'false',
            views: {
                'main-home': {
                    templateUrl: "tpls/setting/settings.html",
                    controller: "settingsCtrl"
                }
            }
        })
        .state('main.updatePwd', {                            //修改密码
            url: "/updatePwd",
            cache: 'false',
            views: {
                'main-home': {
                    templateUrl: "tpls/setting/updatePwd.html",
                    controller: "updatePwdCtrl"
                }
            }
        })
        .state('main.information', {                        //资讯
            url: "/information",
            cache: 'false',
            views: {
                'main-information': {
                    templateUrl: "tpls/tab/information.html",
                    controller: "informationCtrl"
                }
            }
        })
        .state('main.informationDetail', {                        //资讯详情
            url: "/informationDetail",
            cache: 'false',
            views: {
                'main-information': {
                    templateUrl: "tpls/information/informationDetail.html",
                    controller: "informationDetailCtrl"
                }
            },
            params: {'informationDetail': {}}
        })
        .state('main.money', {                                  //钱包
            url: "/money",
            cache: 'false',
            views: {
                'main-money': {
                    templateUrl: "tpls/tab/money.html",
                    controller: "moneyCtrl"
                }
            }
        }).state('main.income', {                                  //收入明细
            url: "/income",
            cache: 'false',
            views: {
                'main-money': {
                    templateUrl: "tpls/wallet/income.html",
                    controller: "incomeCtrl"
                }
            }
        }).state('main.pay', {                                       //提现
            url: "/pay",
            cache: 'false',
            views: {
                'main-money': {
                    templateUrl: "tpls/common/pay.html",
                    controller: "payCtrl"
                }
            }
        })
        .state('main.myBankList', {                               //银行卡列表
            url: "/myBankList",
            cache: 'false',
            views: {
                'main-money': {
                    templateUrl: "tpls/wallet/myBankList.html",
                    controller: "myBankListCtrl"
                }
            }
        })
        .state('main.myBankCard', {                               //银行卡详情
            url: "/myBankCard",
            cache: 'false',
            views: {
                'main-money': {
                    templateUrl: "tpls/wallet/myBankCard.html",
                    controller: "myBankCardCtrl"
                }
            },
            params: {'bankCard': {}}
        })
        .state('main.addBank', {                               //添加银行卡
            url: "/addBank",
            cache: 'false',
            views: {
                'main-money': {
                    templateUrl: "tpls/wallet/addBank.html",
                    controller: "addBankCtrl"
                }
            }
        })
        .state('main.addCard', {                               //银行卡
            url: "/addCard",
            cache: 'false',
            views: {
                'main-money': {
                    templateUrl: "tpls/wallet/addCard.html",
                    controller: "addCardCtrl"
                }
            },
            params: {'bankCard': {}}
        })
        .state('main.store', {                               //商城
            url: "/store",
            cache: 'false',
            views: {
                'main-store': {
                    templateUrl: "tpls/tab/store.html"
                }
            }
        })

})
;

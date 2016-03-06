var seeds = angular.module('seedsApp', ['ionic','ngIOS9UIWebViewPatch']);


seeds.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.tabs.position("bottom");
});


seeds.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("login");
    $stateProvider
        .state('login', {                               //登陆
            url: "/login",
            templateUrl: "tpls/login_reg/login.html",
            controller: 'loginCtrl'
        }).state('register', {                          //注册
            url: "/register",
            cache: 'false',
            templateUrl: "tpls/login_reg/register.html",
            controller: 'registerCtrl'
        }).state('forgetPass', {                        //忘记密码
            url: "/forgetPass",
            cache: 'false',
            templateUrl: "tpls/login_reg/forgetPass.html",
            controller: 'forgetPassCtrl'
        }).state('open', {                               //开通
            url: "/open",
            cache: 'false',
            templateUrl: "tpls/login_reg/open.html",
            controller: 'openCtrl'
        }).state('pay', {                               //支付
            url: "/pay",
            cache: 'false',
            templateUrl: "tpls/common/pay.html",
            controller: 'payCtrl'
        })
});

'use strict';
/**
 * @ngdoc overview
 * @name minovateApp
 * @description
 * # minovateApp
 *
 * Main module of the application.
 */

/*jshint -W079 */

// $rootScope.baseUrl = 'http://127.0.0.1/';
var app = angular.module("judgeMe", ['ngRoute', 'toastr']).config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: true,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-bottom-center',
        preventDuplicates: false,
        preventOpenDuplicates: true,
        target: 'body'
    });
});


app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./views/main.html",
            controller: "appCtrl"
        })
        .when("/quiz", {
            templateUrl: "./views/quiz.html",
            controller: "appCtrl"
        })
         .when("/create", {
            templateUrl: "./views/create.html",
            controller: "appCtrl"
        })
        .otherwise({
            templateUrl: "./views/404.html",
        });
});

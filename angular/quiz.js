app.controller('quizCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


    //0:variable decalration
    var baseURL = "http://www.judgemeyar.tk/judge_me/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.uid = 1;
    $scope.count = 0;
    //end of 0

    //1:command set ajax calling function
    var commonSetHTTPService = function (method, data, url, callback) {
        $http({
            method: method,
            url: baseURL + url,
            dataType: 'JSON',
            data: data,
            headers: {
                "Content-type": "application/json"
            }
        }).then(function (response) {
            console.log(response);
            if (response.data.status == true) {
                toastr.success(response.data.message, 'Success');
                callback(1);
            }
            if (response.data.status == false) {
                console.log(',,,');
                toastr.error(response.data.message, 'Error');
            }
            $('#loader').hide();
        }, function (error) {
            $('#loader').hide();
            toastr.error(error.data.message, 'Error');
        });
    };
    //end of 1; 

    //1:command get ajax calling function
    var commonGetHTTPService2 = function (method, data, url, callback) {
        $http({
            method: method,
            url: baseURL + url,
            dataType: 'JSON',
            data: data,
            headers: {
                "Content-type": "application/json"
            }
        }).then(function (response) {
            console.log(response);
            if (response.data.status == true) {
                callback(response.data.data);
            }
            if (response.data.status == false) {
                toastr.error(response.data.message, 'Error');
            }
        }, function (error) {
            $('#loader').hide();
            toastr.error(error.data.message, 'Error');
        });
    };
    //end of 1; 

    $scope.listQuestion = function (count) {
        $scope.question = {};
        $scope.option = {};
        commonGetHTTPService('Get', '', 'main/list_questions/' + $scope.count, function (result) {
            $scope.count = $scope.count + 1;
            $scope.questionData = result.question;
            $scope.optionData = result.option;
        });
    }

    $scope.isLoggedIn = function () {
        commonGetHTTPService('Get', '', 'main/is_logged_in', function (result) {
            console.log(result);
            if (result) {
                $scope.loginStatus = 1;
                $scope.name = result;
            } else {
                $scope.loginStatus = 0;
                window.location = "http://www.judgemeyar.tk/judgeMe/#!/";
            }
        });
    }
    $scope.listQuestion();
    $scope.isLoggedIn();

    $scope.logout = function () {
        commonSetHTTPService('Post', '', 'school/school_logout', function (result) {
            window.location = "http://www.judgemeyar.tk/schoolkit/app/school/login.html";
        });
    }

    $scope.saveResponse = function (count) {
        console.log($scope.radvalue.value);
        $scope.data = {};
        $scope.data.qid = $scope.questionData.id;
        $scope.data.aid = $scope.radvalue.value;
        $scope.data.uid = $scope.uid;
        commonSetHTTPService2('Post', $scope.data, 'main/save_response', function (result) {
            if (count == 10) {
                window.location = "http://www.judgemeyar.tk/judgeMe/#!/";
            } else {
                $scope.listQuestion(count);
            } // window.location = "http://www.judgemeyar.tk/judgeMe/#!/quiz";
        });
    }


    $scope.skipResponse = function (count) {
        if (count == 10) {
            window.location = "http://www.judgemeyar.tk/judgeMe/#!/";
        } else {
            $scope.listQuestion(count);
        }
    }


});
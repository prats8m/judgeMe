app.controller('appCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


    //0:variable decalration
    var baseURL = "http://localhost/judge_me/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
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
                callback(response.data.data);
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
    var commonGetHTTPService = function (method, data, url, callback) {
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
            $('#loader').hide();
        }, function (error) {
            $('#loader').hide();
            toastr.error(error.data.message, 'Error');
        });
    };
    //end of 1; 

    $scope.startJudging = function () {
        var data = {};
        data.name = $scope.fname;
        if (data.name) {
            commonSetHTTPService('Post', data, 'main/set_session', function (result) {
                $rootScope.fid = result;
                console.log($scope.fid);
                window.location = "http://localhost/judgeMe/#!/quiz";
            });
        } else {
            toastr.error('Enter Your Name First', 'Error');

        }
    }


    $scope.createLink = function () {
        var data = {};
        data.name = $scope.fname;
        if (data.name) {
            commonSetHTTPService('Post', data, 'main/create_link', function (result) {
                $scope.link = result
            });
        } else {
            toastr.error('Enter Your Name First', 'Error');
        }
    }

    $scope.isLoggedIn = function () {
        commonGetHTTPService('Get', '', 'main/is_logged_in', function (result) {
            console.log(result);
            if (result) {
                $scope.loginStatus = 1;
                $scope.name = result;
            } else {
                $scope.loginStatus = 0;
            }
        });
    }


    $scope.isLoggedIn();

    $scope.logout = function () {
        commonSetHTTPService('Post', '', 'school/school_logout', function (result) {
            window.location = "http://localhost/schoolkit/app/school/login.html";
        });
    }



    $scope.listQuestion = function (count) {
        $scope.question = {};
        $scope.option = {};
        commonGetHTTPService('Get', '', 'main/list_questions/' + $scope.count, function (result) {
            $scope.count = $scope.count + 1;
            $scope.questionData = result.question;
            $scope.optionData = result.option;
        });
    }

    $scope.listUserResponse = function (count) {
        $scope.question = {};
        $scope.option = {};
        commonGetHTTPService('Get', '', 'main/list_response', function (result) {
            $scope.userResponse = result;
        });
    }


    $scope.singleResponse = function (fid) {
        $scope.question = {};
        $scope.option = {};
        commonGetHTTPService('Get', '', 'main/single_response/' + fid, function (result) {
            $scope.singleResponseData = result;
        });
    }

    $scope.listUserResponse();
    $scope.isLoggedIn = function () {
        commonGetHTTPService('Get', '', 'main/is_logged_in', function (result) {
            console.log(result);
            if (result) {
                $scope.loginStatus = 1;
                $scope.name = result;
            } else {
                $scope.loginStatus = 0;
                window.location = "http://localhost/judgeMe/#!/";
            }
        });
    }
    $scope.listQuestion();
    $scope.isLoggedIn();

    $scope.logout = function () {
        commonSetHTTPService('Post', '', 'school/school_logout', function (result) {
            window.location = "http://localhost/schoolkit/app/school/login.html";
        });
    }

    $scope.saveResponse = function (count) {
        console.log($scope.radvalue.value);
        $scope.data = {};
        $scope.data.qid = $scope.questionData.id;
        $scope.data.aid = $scope.radvalue.value;
        $scope.data.fid = $rootScope.fid;
        commonSetHTTPService('Post', $scope.data, 'main/save_response', function (result) {
            if (count == 10) {
                window.location = "http://localhost/judgeMe/#!/";
            } else {
                $scope.listQuestion(count);
            } // window.location = "http://localhost/judgeMe/#!/quiz";
        });
    }


    $scope.skipResponse = function (count) {
        if (count == 10) {
            window.location = "http://localhost/judgeMe/#!/";
        } else {
            $scope.listQuestion(count);
        }
    }




});
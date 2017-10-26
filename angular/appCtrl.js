app.controller('appCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


    //0:variable decalration
    var baseURL = "http://www.judgemeyar.tk/judge_me/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.count = 0;
    $scope.aid = 0;
    $scope.result = 0;
   
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
 //1:command set ajax calling function
    var commonSetHTTPService2 = function (method, data, url, callback) {
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
                console.log(',,,');
                toastr.error(response.data.message, 'Error');
            }
        }, function (error) {
            $('#loader').hide();
            toastr.error(error.data.message, 'Error');
        });
    };
   
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
         $('#loader').show();
        if (data.name) {
            commonSetHTTPService('Post', data, 'main/set_session', function (result) {
                $rootScope.fid = result;
                console.log($scope.fid);
                window.location = "http://www.judgemeyar.tk/judgeMe/#!/quiz";
            });
        } else {
            toastr.error('Enter Your Name First', 'Error');

        }
    }


    $scope.createLink = function () {
        var data = {};
        data.name = $scope.fname;
        $window.localStorage.setItem('user',1)
        $('#loader').show();
        if (data.name) {
            commonSetHTTPService('Post', data, 'main/create_link', function (result) {
                $rootScope.link = result;
            });
        } else {
            toastr.error('Enter Your Name First', 'Error');
        }
    }

    $scope.gotoCreateLink= function(){
        $scope.createLink();
         window.location = "http://www.judgemeyar.tk/judgeMe/#!/create";
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
            window.location = "http://www.judgemeyar.tk/schoolkit/app/school/login.html";
        });
    }



    $scope.listQuestion = function (count) {
        $('#2'+$scope.aid).hide();
        if($scope.answerData)
        $('#1'+$scope.answerData.a_id).hide();
        $('#1'+$scope.aid).hide(); 
         $scope.disable = 0;
        $scope.question = {};
        $scope.option = {};
        $('#loader').show();
        commonGetHTTPService('Get', '', 'main/list_questions/' + $scope.count, function (result) {
            $scope.count = $scope.count + 1;
            $scope.questionData = result.question;
            $scope.optionData = result.option;
            $scope.answerData = result.answer[0];
        });
    }

    $scope.checkAnswer = function(aid){
        $scope.aid = aid;
        console.log('aid '+aid);
        console.log('a_id '+$scope.answerData.a_id);
        $scope.disable = 1;
        if(aid == $scope.answerData.a_id){
        $('#1'+aid).show();  
        $scope.result = 1;  
        }
        else{
        $('#2'+aid).show();
        $('#1'+$scope.answerData.a_id).show();
        $scope.result = 0;
    }
    
    }

    $scope.listUserResponse = function (count) {
        $scope.question = {};
        $scope.option = {};
        $('#loader').show();
        $scope.user = $window.localStorage.getItem('user')
        console.log($scope.user);
        if( $rootScope.done || $scope.user){
            $rootScope.done = 1;
        commonGetHTTPService('Get', '', 'main/list_response', function (result) {
            for(var idx in result){
                if(!result[idx].count){
                    result[idx].count = "Old Version Response";
                }
            }
            $scope.userResponse = result;
        });
    }
    else{
         $rootScope.done = 0;
    }
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
                window.location = "http://www.judgemeyar.tk/judgeMe/#!/";
            }
        });
    }
    $scope.listQuestion();
    // $scope.isLoggedIn();

    $scope.logout = function () {
        commonSetHTTPService('Post', '', 'school/school_logout', function (result) {
            window.location = "http://www.judgemeyar.tk/schoolkit/app/school/login.html";
        });
    }

    $scope.saveResponse = function (count) {
        console.log($scope.radvalue.value);
        $('#loader').show();
        $scope.data = {};
        $scope.data.qid = $scope.questionData.id;
        $scope.data.aid = $scope.radvalue.value;
        $scope.data.fid = $rootScope.fid;
        $scope.data.result = $scope.result;
        commonSetHTTPService2('Post', $scope.data, 'main/save_response', function (result) {
            if (count == 10) {
                $rootScope.done = 1;
                window.location = "http://www.judgemeyar.tk/judgeMe/#!/";
            } else {
                $scope.listQuestion(count);
            } // window.location = "http://www.judgemeyar.tk/judgeMe/#!/quiz";
        });
    }


 $scope.saveYourResponse = function (count) {
        console.log($scope.radvalue.value);
        $('#loader').show();
        $scope.data = {};
        $scope.data.qid = $scope.questionData.id;
        $scope.data.aid = $scope.radvalue.value;
        commonSetHTTPService2('Post', $scope.data, 'main/save_your_response', function (result) {
            if (count == 10) {
              $rootScope.link2=1
            } else {
                $scope.listQuestion(count);
            }
        });
    }


    $scope.skipResponse = function (count) {
        if (count == 10) {
            $rootScope.done = 1;
            window.location = "http://www.judgemeyar.tk/judgeMe/#!/";
        } else {
            $scope.listQuestion(count);
        }
    }




});
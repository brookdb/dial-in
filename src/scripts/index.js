var app = angular.module("main", ["ngAnimate","ngRoute", "ngSanitize", "ui.bootstrap"]);
app.factory("Data", ['$http',
    function($http){
      let serviceBase = "./API/";
      let obj = {};
      obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {

                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {

                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {

                return results.data;
            });
        };

        return obj;

}]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "./src/pages/landing.html",
        controller: "defaultCtrl"
    })
    .when("/dail-in", {
      templateUrl : "./src/pages/dail-in.html",
      controller: "dailInCtrl"
    })
    .when("/history/", {
      templateUrl : "./src/pages/history.html",
      controller: "hstCtrl"
    })
    .when("/history/:brew-id", {
      templateUrl : "./pages/brew.html",
      controller: "brwCtrl"
    })
    .when("/404", {
      templateUrl : "./pages/fourOfour.html",
      controller: "brwCtrl"
    })
    /** .when("/resources", {
      templateUrl : "./pages/resources.html",
      controller: "srcCtrl"
    }) **/
    .otherwise({
        redirectTo: '/404'
    });
}).run(function ($rootScope, $location, Data) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.authenticated = false;
        Data.get('session').then(function (results) {
            if (results.uid) {
                $rootScope.authenticated = true;
                $rootScope.uid = results.uid;
                $rootScope.name = results.name;
                $rootScope.email = results.email;
            } else {
                var nextUrl = next.$$route.originalPath;
                if (nextUrl == '/signup' || nextUrl == '/login') {

                } else {
                    $location.path("/login");
                }
            }
        });
    });
});

app.controller('defaultCtrl', ['$scope', '$http', '$sce', '$location', function($scope, $http, $sce, $location){

}]);

app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, $sce, Data) {
  //sanitizing function
  $scope.trustSrc = function(src){
    return $sce.trustAsResourceUrl(src);
  }


  //switch between mobile view and desktop view
  $scope.mainNav = document.getElementById( 'mainNav' ) ;
  $scope.container = document.getElementById( 'container' );

  $scope.showOpts = function(){
    $scope.mainNav.classList.toggle("showOptions");
    $scope.container.classList.toggle("change");
  }
  //welcome message

  $scope.isActive = function(route){
    return route === $location.path();
  }

    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (user) {
        Data.post('login', {
            user: user
        }).then(function (results) {
            //Data.toast(results);
            if (results.status == "success") {
                $location.path('/user-space/dashboard');
            }
        });
    };
    $scope.signup = {email:'',password:'',fname:'',lname:''};
    $scope.signUp = function (user) {
        Data.post('signUp', {
            user: user
        }).then(function (results) {
            //Data.toast(results);
            if (results.status == "success") {
                $location.path('/user-space/dashboard');
            }
        });
    };
    $scope.logout = function () {
        Data.get('logout').then(function (results) {
            //Data.toast(results);
            $location.path('login');
        });
    }
});

//task-manager controller
app.controller('tasksCtrl', function($scope, $http, Data){
  console.log("Tasklist");
  $scope.notSelected = true;
  Data.get('tasks')
  .then((results)=>
  {
    $scope.tasks = results.tasks;
    console.log($scope.tasks);
  });

  $scope.preview = function(task){
    $scope.selectedTask = task
    console.log($scope.selectedTask);
    $scope.notSelected = false;
  }
});

//pages controller
app.controller('pageCtrl', function($scope, $http, $routeParams, Data){
  $scope.pageurl = $routeParams.page;
  console.log($scope.pageurl);

  $scope.page = pages.filter(obj => {
    return obj.url === $scope.pageurl
  })[0];
  console.log($scope.page);
});



app.directive("mainNav", function(){
  return {
    restrict: 'E',
    templateUrl: "./pages/main_nav.html"
  }
});

app.directive("icon", function() {
    return {
      restrict: 'E',
      scope: {
        val: "@"
      },
      link: function(scope, element, attrs){
        scope.getContentUrl = function(){
          return './src/img/'+attrs.val+'.svg';
        }
      },
        template : '<div ng-include="getContentUrl()"></div>'
    }
});
app.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }
});

app.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {

                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel);

                //get the value of the other password
                var e2 = scope.$eval(attrs.passwordMatch);
                if(e2!=null)
                return e1 == e2;
            };
            scope.$watch(checker, function (n) {

                //set the form control to valid if both
                //passwords are the same, else invalid
                control.$setValidity("passwordNoMatch", n);
            });
        }
    };
}]);

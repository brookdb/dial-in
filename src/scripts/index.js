var app = angular.module("main", ["ngAnimate","ngRoute", "ngSanitize", 'ngAria', 'ngMaterial', 'ngMessages']);
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
      templateUrl : "./src/pages/dial-in.html",
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
      controller: "defaultCtrl"
    })
    /** .when("/resources", {
      templateUrl : "./pages/resources.html",
      controller: "srcCtrl"
    }) **/
    .otherwise({
        redirectTo: '/404'
    });
})

app.controller('defaultCtrl', ['$scope', '$http', '$sce', '$location', function($scope, $http, $sce, $location){
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
}]);
app.controller('dailInCtrl', ['$scope', '$http', '$sce', '$location', '$filter', function($scope, $http, $sce, $location, $filter){
  $scope.startbrew = false;
  $scope.brewAttempts = [];
  $scope.hasBrewAttempts = false;
  console.log($scope.brewAttempts.length);

  $scope.startBrew = function(coffee, brewer){
    //save coffee info into the scope to be used by other forms
    $scope.coffee = coffee;

    //set up coffee ID based on name and rest date (EX: Ethiopia Laayoo 8 Days -> EthLaa8) This string ID will be used to distinguish common brews
    let coffeeName = $scope.coffee.name.split(' ');
    let coffeeID = brewer.Type;//0 -> Espresso, 1 -> pour Over
    for(let i = 0; i < coffeeName.length; i++){
      coffeeID = coffeeID + coffeeName[i].substring(0,3).toLowerCase();
    }
    let bDate = new Date();
    let restDate = Math.floor(bDate.getTime() - coffee.roastDate.getTime());
    restDate = restDate / (1000 * 60 * 60 * 24);

    $scope.coffee.restDate = ("" + restDate).split('.')[0];
    coffeeID = (coffeeID + $scope.coffee.restDate);
    $scope.coffee.id = coffeeID;

    //update roastDate formatting
    $scope.coffee.roastDate = $filter('date')
        (coffee.roastDate, 'dd/MM/yy');

    //add brewer to scope and start brewing
    $scope.brewer = brewer;
    $scope.startbrew = true;
    console.log($scope.coffee);
  }

  $scope.addBrewAttempt = function(brew){
    let b = JSON.parse(JSON.stringify(brew));

    b.brewer = $scope.brewer;
    b.brewDate = $filter('date')
        (new Date(), 'dd/MM/yy');

    console.log(b);
    $scope.brewAttempts.push(b)
    console.log($scope.brewAttempts);
    $scope.hasBrewAttempts = true;
  }

  $scope.commpleteDial = function(bestBrewIndex){
    let d ={
      brewAttempts: $scope.brewAttempts,
      coffeeID: $scope.coffee.id,
      brewer: $scope.brewer,
      bestBrewIndex: bestBrewIndex
    }
    console.log(d);

  }

}]);
app.controller('hstCtrl', ['$scope', '$http', '$sce', '$location', function($scope, $http, $sce, $location){

}]);
app.controller('brwCtrl', ['$scope', '$http', '$sce', '$location', function($scope, $http, $sce, $location){

}]);


//pages controller
app.controller('pageCtrl', function($scope, $http, $routeParams, Data){
  $scope.pageurl = $routeParams.page;
  console.log($scope.pageurl);

  $scope.page = pages.filter(obj => {
    return obj.url === $scope.pageurl
  })[0];
  console.log($scope.page);
});

//filter to reverse the order of any array
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

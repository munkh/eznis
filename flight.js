angular.module('project', ['firebase']).

    value('fbURL', 'https://eznis.firebaseio.com/').
    factory('Flights', function(angularFireCollection, fbURL) {
        return angularFireCollection(fbURL);
    }).
    config(function($routeProvider) {
        $routeProvider.
            when('/', {controller:ListCtrl, templateUrl:'1-search.html'}).
            when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
            when('/new', {controller:CreateCtrl, templateUrl:'2-addFlight.html'}).
            when('/flightList', {controller:ListCtrl, templateUrl:'3-flight-list.html'}).

            otherwise({redirectTo:'/'});
    });

function ListCtrl($scope, Flights) {
    $scope.flights = Flights;
}

function CreateCtrl($scope, $location, $timeout, Flights) {
    $scope.save = function() {
        Flights.add($scope.flight, function() {
            $timeout(function() { $location.path('/'); });
        });
    }
}

function EditCtrl($scope, $location, $routeParams, angularFire, fbURL) {
    angularFire(fbURL + $routeParams.projectId, $scope, 'remote', {}).
        then(function() {
            $scope.project = angular.copy($scope.remote);
            $scope.project.$id = $routeParams.projectId;
            $scope.isClean = function() {
                return angular.equals($scope.remote, $scope.project);
            }
            $scope.destroy = function() {
                $scope.remote = null;
                $location.path('/');
            };
            $scope.save = function() {
                $scope.remote = angular.copy($scope.project);
                $location.path('/');
            };
        });
}
angular.module("ContactListApp").controller("ListCtrl", function($scope,$http) {

    function refresh(){
        $http.get("/api/v1/contacts?apikey=1234abcd").then(function (response){
            $scope.contacts = response.data;
        });
    }
    
    $scope.addContact = function (){
        console.log("Adding contact "+$scope.newContact);
        $http.post("/api/v1/contacts",$scope.newContact).then(function (){
            refresh();
        });
        
    };
    
    refresh();

});

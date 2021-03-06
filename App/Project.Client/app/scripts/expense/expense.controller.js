﻿angular.module("app")
    .controller("ExpenseController", [
        "$scope", "UrlService", "HttpService", "AlertService",
        function ($scope, urlService, httpService, alertService) {
            "use strict";

            var init = function () {
                $scope.backdrop = true;
                $scope.promise = null;

                $scope.model = { Description: "", Amount: "" };
                $scope.list = [];
                $scope.loadExpenses();
                $scope.isUpdateMode = false;
                $scope.searchRequest = { Keyword: "", StartDate: "" };
            };

            $scope.loadExpenses = function () {
                $scope.promise = httpService.get(urlService.ExpenseUrl).then(function (data) {
                    console.log(data);
                    $scope.list = data;
                }, function (error) {
                    console.log(error);
                    alertService.showAlert(alertService.alertType.danger, "Expenses load failed, Please refresh the page or check your internet connection", true);
                });
            };

            $scope.save = function () {
                if ($scope.isUpdateMode) $scope.update();

                else {
                    $scope.promise = httpService.add(urlService.ExpenseUrl, $scope.model).then(function (data) {
                        console.log(data);
                        alertService.showAlert(alertService.alertType.success, "Success", false);
                        init();
                    }, function (error) {
                        alertService.showAlert(alertService.alertType.danger, "Failed, Please try again", true);
                        console.log(error);
                    });
                }
            };

            $scope.loadExpense = function (id) {
                $scope.promise = httpService.getByParams(urlService.ExpenseUrl, { request: id }).then(function (data) {
                    console.log(data);
                    $scope.model = data;
                }, function (error) {
                    console.log(error);
                    init();
                    alertService.showAlert(alertService.alertType.danger, "Expense load failed, Please try again or check your internet connection", true);
                });
            };

            $scope.edit = function (id) {
                $scope.loadExpense(id);
                $scope.isUpdateMode = true;
            };


            $scope.update = function () {
                $scope.promise = httpService.update(urlService.ExpenseUrl, $scope.model).then(function (data) {
                    console.log(data);
                    init();
                    alertService.showAlert(alertService.alertType.success, "Success", false);
                }, function (error) {
                    console.log(error);
                    alertService.showAlert(alertService.alertType.danger, "Expense update failed, Please try again!", true);
                });
            };

            $scope.delete = function (id) {
                $scope.promise = httpService.remove(urlService.ExpenseUrl, id).then(function (data) {
                    console.log(data);
                    init();
                    alertService.showAlert(alertService.alertType.success, "Success", false);
                }, function (error) {
                    console.log(error);
                    alertService.showAlert(alertService.alertType.danger, "Expense delete failed, Please try again!", true);
                });
            };

            $scope.remove = function (size, data, action) {
                alertService.showConfirmDialog(size, data, action, false).then(function (response) {
                    console.log(response);
                    if (response.isConfirm) {
                        $scope.delete(response.data.Id);
                    }
                }, function (error) {
                    console.log(error);
                });
            };


            $scope.search = function(status) {
                if (status === 1) {
                    $scope.searchRequest.StartDate = "";
                }
                if (status === 2) {
                    $scope.searchRequest.Keyword = "";
                    $scope.searchRequest.StartDate = $scope.searchRequest.StartDate.toLocaleString();
                }
                $scope.promise = httpService.add(urlService.ExpenseUrl + "/Search", $scope.searchRequest)
                    .then(function(data) {
                            console.log(data);
                            $scope.list = data;
                        },
                        function(error) {
                            console.log(error);
                        });
            };

            $scope.reload = function() {
                if ($scope.searchRequest.Keyword === undefined)
                    init();
            };

            $scope.reset = function() {
                init();
            };

            init();
        }
    ]);
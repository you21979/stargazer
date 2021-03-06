/* global angular, console, StellarSdk */

angular.module('app')
.controller('AccountInflationCtrl', function ($q, $rootScope, $scope, Modal, Reverse, Reviewer, Wallet) {
	'use strict';

	$scope.oldName = Wallet.current.alias;
	$scope.send = {};

	var inflationDest = Wallet.current.inflationDest;
	if (inflationDest) {
		Reverse.lookupAndFill(
			function (res) {$scope.send.destination = res;},
			inflationDest
		);
	}

	$scope.selectRecipient = function () {
		const data = {
			network: Wallet.current.network,
			heading: 'Select Inflation Destination'
		};

		Modal.show('app/core/modals/select-contact.html', data)
		.then(function (dest) {
			$scope.send.destination = dest;
		});
	};

	$scope.setInflation = function () {

		var currentAccount = Wallet.current;
		var source = currentAccount.id;

		currentAccount.horizon().loadAccount(source)
		.then(function (account) {

			var destInfo = $scope.send.destInfo;
			var builder = new StellarSdk.TransactionBuilder(account);
			builder.addOperation(StellarSdk.Operation.setOptions({
				inflationDest: destInfo.id
			}));
			var tx = builder.build();

			return {
				tx: tx,
				network: currentAccount.network
			};
		})

		.then(Reviewer.review)
		.then(function () {
			$rootScope.goBack();
		});

	};
});

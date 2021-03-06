/* global angular, console */

angular.module('app')
.controller('AccountSettingsCtrl', function ($scope, Keychain, Modal, Wallet) {
	'use strict';

	const hasPassword	= Keychain.isEncrypted;
	const accountId		= Wallet.current.id;

	$scope.togglePassword = togglePassword;
	$scope.account = Wallet.current;
	$scope.flag = {
		hasPassword: hasPassword(accountId)
	};

	function togglePassword() {

		if (hasPassword(accountId)) {
			const data = {
				signer: accountId
			};

			Modal.show('app/account-settings/modals/remove-password.html', data)
			.then(function (password) {
				Keychain.removePassword(accountId, password);
			})
			.catch(function () {
				$scope.flag.hasPassword = true;
			});
		}

		else {
			Modal.show('app/account-settings/modals/add-password.html')
			.then(function (password) {
				Keychain.setPassword(accountId, password);
			})
			.then(function () {
				$scope.flag.hasPassword = false;
			});
		}
	}
});

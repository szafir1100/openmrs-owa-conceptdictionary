/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
angular
    	.module('conceptDictionaryApp')
    	.controller('ClassEditController', ClassEditController);
    ClassEditController.$inject =
    	['singleClass', '$routeParams', '$location', 'openmrsRest'];

	function ClassEditController( singleClass, $routeParams, $location, openmrsRest ){
		
		var vm = this;
		//holds class information
		vm.singleClass = singleClass;
		
		vm.class = {
            name : '',
            description : ''
        };
		
		vm.responseMessage = '';
		vm.isError = false;
		
		vm.redirectToList = redirectToList;
		
		vm.editClass = editClass;
		
		vm.cancel = cancel;
		

        function redirectToList() {
            $location.path('/class').search({classAdded: vm.class.name});
        }

        function editClass() {
            vm.class.name = vm.singleClass.name;
            vm.class.description = vm.singleClass.description;
            vm.json = angular.toJson(vm.class);

            openmrsRest.update('conceptclass', {uuid: vm.singleClass.uuid}, vm.json).then(function(success) {
            	vm.responseMessage = success;
                vm.redirectToList();
            }, function(exception) {
            	vm.isError = true;
                vm.responseMessage = exception.data.error.fieldErrors.name[0].message;
            });
        }

        function cancel() {
            vm.class.name = '';
            $location.path('/class').search({classAdded: ''});
        }
	}

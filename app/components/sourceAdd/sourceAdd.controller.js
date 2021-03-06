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
    .controller('SourceAddController', SourceAddController);

SourceAddController.$inject = ['openmrsRest', '$location'];

function SourceAddController (openmrsRest, $location){

    var vm = this;

    vm.source = {
        name:'',
        description:'',
        hl7Code:''
    };


    vm.responseMessage = '';

    vm.cancel = cancel;
    vm.save = save;
    vm.isSavePossible = isSavePossible;

    function cancel () {
        $location.path('/source');
    }

    function isSavePossible () {
        return vm.source.name.length > 0 && vm.source.description.length > 0;
    }

    //Method used to add class with current class params
    function save() {
        vm.json = angular.toJson(vm.source);
        openmrsRest.create('conceptsource', vm.json).then(function(success) {
            vm.success = true;
            $location.path('/source').search({sourceSaved: vm.source.name});
        }, function(exception) {
            //TODO Check exception response
            vm.responseMessage = exception.data.error.fieldErrors.code[0].message;
        });
    }
}
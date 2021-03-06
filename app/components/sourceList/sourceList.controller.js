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
    .controller('SourcesListController', SourcesListController);

SourcesListController.$inject =
    ['sources', '$location', '$routeParams'];

function SourcesListController (sources, $location, $routeParams) {

    var vm = this;


    //array of concept sources
    vm.sources = sources.results;
    //determines whether source class has been saved or deleted in previous view
    vm.sourceSaved = $routeParams.sourceSaved;
    vm.sourceDeleted = $routeParams.sourceDeleted;

    vm.goTo = goTo;

    //redirects to another location
    function goTo (hash){
        $location.path(hash);
    }
}
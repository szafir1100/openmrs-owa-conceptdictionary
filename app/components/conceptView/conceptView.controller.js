/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
(function() {
    'use strict';
    
	angular
		.module('conceptDictionaryApp')
		.controller('ConceptViewController', ConceptViewController)
		
	//serverLocales = avalaible locales obtained from server
ConceptViewController.$inject = ['$scope', 'concept', 'serverLocales', 'conceptsService', '$location'];

	function ConceptViewController ($scope, concept, serverLocales, conceptsService, $location ){

		var vm = this;
		//determines if Numeric content is shown
		vm.isNumeric;
		//determines if coded answer content is shown
		vm.isCoded;
		//holds names and description of concept for currently selected locale
		vm.conceptLocale = {};
		//holds concept
		vm.concept = concept;
		//array of locales of concept
		vm.locales;
		//function invoked when user clicks locale button
		vm.goLocale = goLocale;
		//function invoked when user clicks other concept button
		vm.goTo = goTo;
		
		activate();
		
		//activation function
		function activate(){
			vm.locales = conceptsService.getLocales(vm.concept.names,
					vm.concept.descriptions,
					serverLocales);
			
			checkType();
			goLocale(vm.concept.name.locale);
		}
		//inserts descriptions and names for specified locale into conceptLocale, parsed from concept tables,
		function goLocale (locale) {
			vm.conceptLocale.description 
				= conceptsService.getLocaleDescr(vm.concept.descriptions, locale);
			vm.conceptLocale.names 
				= conceptsService.getLocaleNames(vm.concept.names, locale);
		}
		//checks datatype of concept to determine
		function checkType (){
			vm.isNumeric = (vm.concept.datatype.display == "Numeric");
			vm.isCoded = (vm.concept.datatype.display == "Coded");
		}
		//
		function goTo (hash){
			$location.path(hash);
		}
	};
})();

angular
    .module('conceptDictionaryApp',
		['ngRoute', 'openmrs'])

	.config(['$routeProvider',
                    function($routeProvider, openmrsRest) {
                      $routeProvider.
                        when('/concept-search', {
                            templateUrl: 'partials/concept-search.html',
                            controller: 'ConceptSearchController',
                            controllerAs: 'vm'
                      }).
					  	when('/reference-search', {
						    templateUrl: 'partials/reference-search.html',
						    controller: 'ReferenceSearchController',
						    controllerAs: 'vm'
					  }).
                        when('/class-list', {
                          templateUrl: 'partials/class-list.html',
                          controller: 'ClassesListController',
                          controllerAs: 'vm',
                          resolve: {
                        	  loadClasses : loadClasses
                          }
                        }).
                        when('/class-list/add-class', {
                        	templateUrl: 'partials/class-add.html',
                            controller: 'ClassAddController',
                            controllerAs: 'vm'
                      }).
					    when('/reference/reference-add', {
					  	  templateUrl: 'partials/reference-add.html',
					  	  controller: 'ReferenceAddController',
					  	  controllerAs: 'vm',
						  resolve: {
							  sources : loadSources
						  }
					    }).
                        when('/class-list/:classUUID', {
                        	templateUrl: 'partials/class-edit.html',
                        	controller: 'ClassesEditController',
                        	controllerAs: 'vm',
                        	resolve: {
                        		singleClass : loadClass
                        	}
                        }).
                        when('/datatype-list', {
                        	templateUrl: 'partials/datatype-list.html',
                            controller: 'DataTypesListController',
                        	controllerAs: 'vm',
                            resolve: {
                              	 loadDataTypes : loadDataTypes
                            }
                        }).
                        when('/datatype-list/:dataTypeUUID', {
                        	templateUrl: 'partials/datatype-details.html',
                        	controller: 'DataTypesDetailsController',
                        	controllerAs: 'vm',
                        	resolve: {
                        		loadDataType : loadDataType
                        	}
                        }).
                        when('/concept/add/', {
                        	templateUrl: 'partials/concept-add.html',
                        	controller: 'ConceptAddController',
                        	controllerAs: 'vm',
                        	resolve: {
                        		serverLocales: serverLocales,
                        		loadClasses : loadClasses,
                        		loadDataTypes : loadDataTypes
                        	}
                        }).
					    when('/reference/:referenceUUID/', {
						    templateUrl: 'partials/reference-edit.html',
						    controller: 'ReferenceEditController',
						    controllerAs: 'vm',
						    resolve: {
							    reference : loadReference,
								sources : loadSources
						    }
					    }).
                        when('/concept/:conceptUUID/', {
                        	templateUrl: 'partials/concept.html',
                        	controller: 'ConceptViewController',
                        	controllerAs: 'vm',
                        	resolve: {
                        		concept : loadConcept,
                        		serverLocales: serverLocales
                        	}
                        }).
                        otherwise({
                          redirectTo: '/class-list'
                        });
                    }]);

function loadConcept ($route, openmrsRest){
	return openmrsRest.getFull('concept',
			{uuid : $route.current.params.conceptUUID});
};
function serverLocales(openmrsRest){
	return openmrsRest.getFull('systemsetting',{q : 'locale.allowed.list'})
					  .then(function(response){
						  return response.results[0].value.split(", ");
					  });
};
function loadClasses(openmrsRest){
	  return openmrsRest.listFull('conceptclass');
};
function loadDataTypes (openmrsRest){
	  return openmrsRest.listFull('conceptdatatype');
};
function loadSources (openmrsRest){
	return openmrsRest.listFull('conceptsource');
};
function loadClass ($route, openmrsRest){
	return openmrsRest.getFull('conceptclass',
			{uuid: $route.current.params.classUUID});
};
function loadDataType ($route, openmrsRest){
	return openmrsRest.getFull('conceptdatatype', 
			{uuid: $route.current.params.dataTypeUUID});
};
function loadReference ($route, openmrsRest){
	return openmrsRest.getFull('conceptreferenceterm',
		{uuid: $route.current.params.referenceUUID});
};



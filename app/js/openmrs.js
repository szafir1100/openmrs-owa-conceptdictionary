/**
 * The pattern borrowed from https://gist.github.com/brucecoddington/92a8d4b92478573d0f42
 */
(function() {
	'use strict';

	angular.module('openmrs', ['ngResource'])
		.factory('openmrsApi', openmrsApi)
		.provider('openmrsRest', openmrsRest);

	function openmrsApi($resource) {
		var openmrsApi = {
			defaultConfig: {
				uuid: '@uuid'
			},
			extraMethods: {},
			add: add
		};

		return openmrsApi;

		function add(config) {
			var params, url;

			// If the add() function is called with a
			// String, create the default configuration.
			if (angular.isString(config)) {
				var configObj = {
					resource: config,
					url: '/' + config
				};

				config = configObj;
			}

			// If the url follows the expected pattern, we can set cool defaults.
			if (!config.unnatural) {
				var orig = angular.copy(openmrsApi.defaultConfig);
				params = angular.extend(orig, config.params);
				url = getOpenmrsContextPath() + '/ws/rest/v1' + config.url + '/:uuid';
			} else {
				// Otherwise we have to declare the entire configuration.
				params = config.params;
				url = getOpenmrsContextPath() + '/ws/rest/v1' + config.url + '/:uuid';
			}

			// If we supply a method configuration, use that instead of the default extra.
			var methods = config.methods || openmrsApi.extraMethods;

			openmrsApi[config.resource] = $resource(url, params, methods);
		}

		function getOpenmrsContextPath() {
			var pathname = window.location.pathname;
			return pathname.substring(0, pathname.indexOf("/owa/"));
		}
	}

	function openmrsRest() {
		return {
			list: provideList,
			get: provideGet,
			$get: provideOpenmrsRest,
		};

		function provideList(resource, query) {
			return ['openmrsRest', function (openmrsRest) {
				return openmrsRest.list(resource, query);
			}]
		}

		function provideGet(resource, query) {
			return ['openmrsRest', function (openmrsRest) {
				return openmrsRest.get(resource, query);
			}]
		}

		function provideOpenmrsRest(openmrsApi) {
			var openmrsRest = {
				list: list,
				listFull: listFull,
				listRef: listRef,
				get: get,
				getFull: getFull,
				getRef: getRef,
				create: create,
				update: update,
				remove: remove
			};

			return openmrsRest;

			function list(resource, query) {
				openmrsApi.add(resource);
				return openmrsApi[resource].get(query).$promise.then(function (response) {
					return new PartialList(resource, response);
				});
			}

			function listFull(resource, query) {
				openmrsApi.add(resource);
				query = addMode(query, 'full');
				return openmrsApi[resource].get(query).$promise.then(function (response) {
					return new PartialList(response);
				});
			}

			function listRef(resource, query) {
				openmrsApi.add(resource);
				query = addMode(query, 'ref');
				return openmrsApi[resource].get(query).$promise.then(function (response) {
					return new PartialList(response);
				});
			}

			function get(resource, query) {
				openmrsApi.add(resource);
				return openmrsApi[resource].get(query).$promise;
			}

			function getFull(resource, query) {
				openmrsApi.add(resource);
				query = addMode(query, 'full');
				return openmrsApi[resource].get(query).$promise;
			}

			function getRef(resource, query) {
				openmrsApi.add(resource);
				query = addMode(query, 'ref');
				return openmrsApi[resource].get(query).$promise;
			}

			function create(resource, model) {
				openmrsApi.add(resource);
				return openmrsApi[resource].save(model).$promise;
			}

			function update(resource, query, model) {
				openmrsApi.add(resource);
				return openmrsApi[resource].save(query, model).$promise;
			}

			function remove(resource, query) {
				openmrsApi.add(resource);
				return openmrsApi[resource].remove(query).$promise;
			}

			function addMode(query, type) {
				if (query == null) {
					return {v: type};
				} else {
					return angular.extend(query, {v: type});
				}
			}
		}
	}

	function PartialList(response) {
		var results = response.results;
		var nextQuery = null;
		var previousQuery = null;

		initLinks();

		return {
			results: results,
			hasNext: hasNext,
			nextQuery: nextQuery,
			hasPrevious: hasPrevious,
			previousQuery: previousQuery
		};

		function hasNext() {
			return nextQuery != null;
		}

		function hasPrevious() {
			return previousQuery != null;
		}

		function initLinks() {
			if (response.links != null) {
				for (var i = 0; i < response.links.length; i++) {
					var link = response.links[i];

					if (link.rel === 'next') {
						nextQuery = toQuery(link.href);
					} else if (link.rel === 'prev') {
						previousQuery = toQuery(link.href);
					}
				}
			}
		}

		function toQuery(href) {
			var parser = document.createElement('a');
			parser.href = href;
			var params = parser.search.slice(1).split('&');
			var result = {};
			params.forEach(function(param) {
				param = param.split('=');
				result[param[0]] = decodeURIComponent(param[1] || '');
			});
			return result;
		}
	}
})();
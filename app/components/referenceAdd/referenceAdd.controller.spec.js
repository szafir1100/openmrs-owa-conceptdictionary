/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
'use strict';

/* jasmine specs for controllers go here */
describe('Concept dictionary controllers', function() {

    beforeEach(function(){
        jasmine.addMatchers({
            toEqualData: function(util, customEqualityTesters) {
                return {
                    compare: function(actual, expected) {
                        var passed = angular.equals(actual, expected);
                        return {
                            pass: passed,
                            message: 'Expected ' + actual + (passed ? '' : ' not') + ' to equal ' + expected
                        }
                    }
                }
            }
        });
    });

    beforeEach(module('conceptDictionaryApp'));

    describe('ReferenceAddController', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, openmrsRest) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST('/ws/rest/v1/conceptreferenceterm').
            respond(
                {
                    results:
                    {
                        uuid: '83f9cdf3-b374-42d0-9b70-1a4020a0ee42',
                        display: 'org.openmrs.module.mdrtb: Weight (WEIGHT)',
                        name: 'Weight',
                        conceptSource:
                        {
                            uuid: '17318d62-4237-4d68-86d4-f9d176872859',
                            display: 'org.openmrs.module.mdrtb'
                        },
                        description: 'Weight description',
                        code:'WEIGHT',
                        version: '1',
                        retired: false
                    }
                }
            );
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('components/referenceSearch/referenceSearch.html').respond();

            var sources = {
                uuid: '17318d62-4237-4d68-86d4-f9d176872859',
                display: 'org.openmrs.module.mdrtb'
            };

            scope = $rootScope.$new();

            ctrl = $controller('ReferenceAddController', {$scope: scope, sources: sources});
            ctrl.sources = sources;
        }));

        it('should add new concept reference term ', function() {
            ctrl.save();
            $httpBackend.flush();
            expect(ctrl.success).toEqualData(true);
        });
    });
});
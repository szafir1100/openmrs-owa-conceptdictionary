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

    describe('conceptsService', function(){
    	function findNameObject(name, namesArray){
        	for(var i=0;i<namesArray.length;i++){
        		if(namesArray[i].name === name) return namesArray[i];
        	}
        }
        //declare variables
        var concept1;
        var expectedNames1;
        var expectedDescr1;

        var concept2;
        var expectedNames2;
        var expectedDescr2;
        
        var localizedConcept1;
        var localizedConcept2;
        var validLocalizedConcepts;
        
        var invalidLocalizedConcept;
        
        var serverLocales = ["en", "es", "pt", "it", "fr"];

        beforeEach(function(){
            //initialize variables and insert values
            concept1 = {datatype: { display : 'Numeric'},
                names: [{display: 'engName1', locale: 'en', conceptNameType: 'FULLY_SPECIFIED'},
                    {display: 'engName1', locale: 'en', conceptNameType: 'SHORT'},
                    {display: 'EspName1', locale: 'es', conceptNameType: 'FULLY_SPECIFIED'},
                    {display: 'EspName1', locale: 'es', conceptNameType: 'INDEX_TERM'}],
                descriptions: [{display: "engDescr", locale: "en"},
                    {display: "EspDescr", locale: "es"}]};
            
            expectedNames1={}
            expectedNames1.short = 'engName1';
            expectedNames1.full = 'engName1';
            expectedNames1.synonyms = [];
            expectedNames1.searchTerms = [];

            expectedDescr1 = 'engDescr';

            concept2 = {datatype: { display : "Numeric"},
                names: [{display: "engName2", locale: "en", conceptNameType: "FULLY_SPECIFIED"},
                    {display: "engName2", locale: "es", conceptNameType: "SHORT"},
                    {display: "EspName2", locale: "fr", conceptNameType: "FULLY_SPECIFIED"},
                    {display: "EspName2", locale: "it", conceptNameType: "INDEX_TERM"}],
                descriptions: [{display: "engDescr", locale: "en"},
                    {display: "EspDescr", locale: "es"}]}
            
            expectedNames2={};
            expectedNames2.full = "engName2";
            expectedNames2.synonyms = [];
            expectedNames2.searchTerms = [];
            
            expectedDescr2 = "engDescr";
            
            localizedConcept1 = {locale : "en",
            					fullname : { display : "fullname1"},
            					shortname : { display : "shortname1"},
            					preferredName : {display : "fullname1"},
            					searchTerms : [{ display : "searchTerm1"}, {display : "searchTerm2"}],
            					synonyms : [{display : "synonym1"}, {display : "synonym2"}]}
            localizedConcept2 = {locale : "es",
								fullname : { display : "fullname2"},
								shortname : { display : "shortname2"},
								preferredName : {display :  "synonym2"},
								searchTerms : [{ display : "searchTerm2"}, {display : "searchTerm2"}],
								synonyms : [{display : "synonym2"}, {display : "synonym2"}]}
            validLocalizedConcepts = [localizedConcept1, localizedConcept2];
            
            invalidLocalizedConcept = { potato : "potato"};
            
            
        });

        it('getLocales should return array of locales', inject(function(conceptsService){
            expect(conceptsService.getLocales(concept1.names, concept1.descriptions, serverLocales))
                .toEqualData(["en", "es"]);
            expect(conceptsService.getLocales(concept2.names, concept2.descriptions, serverLocales))
                .toEqualData(["en", "es", "fr", "it"]);
        }));

        it('getLocaleNames should return Object containing english names', inject(function(conceptsService){
            var obtained1 = conceptsService.getLocaleNames(concept1.names, "en");
            expect(obtained1).toEqualData(expectedNames1);
            var obtained2 = conceptsService.getLocaleNames(concept2.names, "en");
            expect(obtained2).toEqualData(expectedNames2);
        }));

        it('getLocaleDescr should return Object containing english descriptions', inject(function(conceptsService){
            var obtained1 = conceptsService.getLocaleDescr(concept1.descriptions, "en");
            expect(obtained1).toEqualData(expectedDescr1);
            var obtained2 = conceptsService.getLocaleDescr(concept2.descriptions, "en");
            expect(obtained2).toEqualData(expectedDescr2);
        }));
        it('getEmptyConceptObject should return empty Concept object', inject(function(conceptsService){
            var emptyConcept = conceptsService.getEmptyConceptObject();
            expect(emptyConcept).toBeDefined();
            expect(emptyConcept.conceptClass).toBeDefined();
            expect(emptyConcept.datatype).toBeDefined();
            expect(emptyConcept.answers).toBeDefined();
            expect(emptyConcept.setMembers).toBeDefined();
            expect(emptyConcept.set).toBeDefined();            
        }));
        it('getEmptyLocaleConceptObject should return empty localized Concept data object', inject(function(conceptsService){
            var emptyConcept = conceptsService.getEmptyLocaleConceptObject("en");
            expect(emptyConcept).toBeDefined();
            expect(emptyConcept.fullname).toBeDefined();
            expect(emptyConcept.preferredName).toBeDefined();
            expect(emptyConcept.searchTerms).toBeDefined();
            expect(emptyConcept.synonyms).toBeDefined();
            expect(emptyConcept.locale).toEqualData("en");           
        }));
        it('parseNames should return table of names', inject(function(conceptsService){
            var names = conceptsService.parseNames(validLocalizedConcepts);
            expect(names.length).toEqual(12);
        }));
    })
});
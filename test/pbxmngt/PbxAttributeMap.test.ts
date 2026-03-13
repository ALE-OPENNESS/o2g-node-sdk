/*
* Copyright 2026 ALE International
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this 
* software and associated documentation files (the "Software"), to deal in the Software 
* without restriction, including without limitation the rights to use, copy, modify, merge, 
* publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
* to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or 
* substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
* BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { PbxAttributeMap } from "../../src/types/pbxmngt/pbx-attr-map";
import { PbxAttribute } from "../../src/types/pbxmngt/pbx-attribute";


describe('PbxAttributeMap', () => {
    describe('Creation methods', () => {
        it('should create an empty PbxAttributeMap using create()', () => {
            const map = PbxAttributeMap.create();
            expect(map.names).toEqual([]);
        });

        it('should create a map with attributes using createWith()', () => {
            const attr1 = PbxAttribute.createInteger('Param1', 1);
            const attr2 = PbxAttribute.createBoolean('Param2', true);
            const map = PbxAttributeMap.createWith([attr1, attr2]);

            expect(map.names).toEqual(['Param1', 'Param2']);
            expect(map.getAttribute('Param1')?.asInteger()).toBe(1);
            expect(map.getAttribute('Param2')?.asBoolean()).toBe(true);
        });

        it('should skip attributes with undefined names in createWith()', () => {
            const attr1 = PbxAttribute.createInteger('Param1', 1);
            const attr2 = new PbxAttribute(); // undefined name
            const map = PbxAttributeMap.createWith([attr1, attr2]);

            expect(map.names).toEqual(['Param1']);
        });
    });

    describe('Adding attributes', () => {
        it('should add attributes and allow chaining', () => {
            const attr1 = PbxAttribute.createInteger('Param1', 10);
            const attr2 = PbxAttribute.createBoolean('Param2', false);

            const map = PbxAttributeMap.create()
                .add(attr1)
                .add(attr2);

            expect(map.names).toEqual(['Param1', 'Param2']);
            expect(map.getAttribute('Param1')?.asInteger()).toBe(10);
            expect(map.getAttribute('Param2')?.asBoolean()).toBe(false);
        });

        it('should skip attributes with undefined name on add()', () => {
            const attr1 = new PbxAttribute(); // undefined name
            const map = PbxAttributeMap.create().add(attr1);

            expect(map.names).toEqual([]);
        });
    });

    describe('JSON methods', () => {
        it('should serialize and deserialize attributes correctly', () => {
            const attr1 = PbxAttribute.createInteger('Param1', 5);
            const attr2 = PbxAttribute.createBoolean('Param2', true);

            const map = PbxAttributeMap.createWith([attr1, attr2]);
            const json = PbxAttributeMap.toJson(map, 'TestMap');

            expect(json.name).toBe('TestMap');
            expect(json.attributes?.length).toBeGreaterThanOrEqual(2);

            const restoredMap = PbxAttributeMap.fromJson(json);
            expect(restoredMap.getAttribute('Param1')?.asInteger()).toBe(5);
            expect(restoredMap.getAttribute('Param2')?.asBoolean()).toBe(true);
        });

        it('should skip attributes with undefined name when deserializing from JSON', () => {
            const json = {
                name: 'TestMap',
                attributes: [
                    { name: 'Param1', value: ['1'] },
                    { value: ['true'] } // undefined name
                ]
            };

            const map = PbxAttributeMap.fromJson(json);
            expect(map.names).toEqual(['Param1']);
        });
    });
});
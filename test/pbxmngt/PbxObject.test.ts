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

import { PbxObject } from "../../src/types/pbxmngt/pbx-object";


describe('PbxObject', () => {

    const json = {
        objectName: 'Subscriber',
        objectId: 'sub123',
        objectNames: ['ACD2_Operator', 'SkillSet'],
        attributes: [
            { name: 'SkillLevel', value: ['2'] },
            { name: 'Skill_Activate', value: ['true'] },
            // Nested attribute example
            { name: 'SkillSet.Skill_Nb', value: ['21'] }
        ]
    };

    it('should create a PbxObject from JSON', () => {
        const pbxObject = PbxObject.fromJson(json);

        expect(pbxObject.name).toBe(json.objectName);
        expect(pbxObject.id).toBe(json.objectId);
        expect(pbxObject.objectNames).toEqual(json.objectNames);
        expect(pbxObject.getAttribute('SkillLevel')?.asInteger()).toBe(2);
        expect(pbxObject.getAttribute('Skill_Activate')?.asBoolean()).toBe(true);
    });

    it('should handle nested attributes as sequences', () => {
        const pbxObject = PbxObject.fromJson(json);

        const skillSet = pbxObject.getAttribute('SkillSet');
        expect(skillSet).toBeDefined();
        expect(skillSet?.asAttributeMap().getAttribute('Skill_Nb')?.asInteger()).toBe(21);
    });

    it('should return null for undefined objectNames, name, or id', () => {
        const emptyJson = {
            attributes: []
        } as any; // simulate missing fields

        const pbxObject = PbxObject.fromJson(emptyJson);

        expect(pbxObject.name).toBeNull();
        expect(pbxObject.id).toBeNull();
        expect(pbxObject.objectNames).toBeNull();
        expect(pbxObject.getAttribute('NonExisting')).toBeUndefined();
    });

});

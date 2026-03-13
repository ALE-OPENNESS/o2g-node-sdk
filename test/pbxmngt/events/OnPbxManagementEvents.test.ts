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

import { OnPbxObjectInstanceCreated, OnPbxObjectInstanceDeleted, OnPbxObjectInstanceModified, PbxObjectDefinition } from "../../../src/types/pbxmngt/pbxmngt-events";


describe('PbxObjectDefinition and PBX events from JSON string', () => {

    it('should parse PbxObjectDefinition from JSON string', () => {
        const jsonString = `{
            "objectName": "Line",
            "objectId": "12345"
        }`;

        const json = JSON.parse(jsonString);
        const obj = PbxObjectDefinition.fromJson(json);

        expect(obj).toBeInstanceOf(PbxObjectDefinition);
        expect(obj.objectName).toBe('Line');
        expect(obj.objectId).toBe('12345');
    });

    it('should parse OnPbxObjectInstanceCreated with parent from JSON string', () => {
        const jsonString = `{
            "objectName": "Line",
            "objectId": "123",
            "father": {
                "objectName": "Group",
                "objectId": "999"
            },
            "nodeId": 42
        }`;

        const json = JSON.parse(jsonString);
        const event = OnPbxObjectInstanceCreated.fromJson(json);

        expect(event).toBeInstanceOf(OnPbxObjectInstanceCreated);
        expect(event.object.objectName).toBe('Line');
        expect(event.parent).not.toBeNull();
        expect(event.parent!.objectName).toBe('Group');
        expect(event.nodeId).toBe(42);
    });

    it('should parse OnPbxObjectInstanceCreated without parent from JSON string', () => {
        const jsonString = `{
            "objectName": "Line",
            "objectId": "123",
            "nodeId": 42
        }`;

        const json = JSON.parse(jsonString);
        const event = OnPbxObjectInstanceCreated.fromJson(json);

        expect(event.parent).toBeNull();
        expect(event.object.objectId).toBe('123');
    });

    it('should parse OnPbxObjectInstanceDeleted and OnPbxObjectInstanceModified', () => {
        const jsonString = `{
            "objectName": "Line",
            "objectId": "123",
            "father": {
                "objectName": "Group",
                "objectId": "999"
            },
            "nodeId": 42
        }`;

        const json = JSON.parse(jsonString);

        const deleted = OnPbxObjectInstanceDeleted.fromJson(json);
        expect(deleted).toBeInstanceOf(OnPbxObjectInstanceDeleted);
        expect(deleted.parent!.objectId).toBe('999');

        const modified = OnPbxObjectInstanceModified.fromJson(json);
        expect(modified).toBeInstanceOf(OnPbxObjectInstanceModified);
        expect(modified.nodeId).toBe(42);
    });
});
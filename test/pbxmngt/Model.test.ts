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

import { Model } from "../../src/types/pbxmngt/model";



describe('Model.fromJson', () => {
    let jsonString: string;
    let modelJson: any;

    beforeEach(() => {
        jsonString = `
    {
      "objectName": "Subscriber",
      "hidden": false,
      "create": true,
      "delete": false,
      "set": true,
      "get": true,
      "otherActions": ["forceDelete", "import"],
      "attributes": [
        {
          "name": "FirstName",
          "mandatory": true,
          "typeValue": "Enumerated",
          "multiValue": false,
          "allowedValues": ["Alice", "Bob"],
          "lengthValue": "0..20",
          "defaultValue": "Alice",
          "filtering": true,
          "usedWhen": "Creation"
        },
        {
          "name": "Age",
          "mandatory": false,
          "typeValue": "Integer",
          "multiValue": false
        }
      ],
      "objects": [
        {
          "objectName": "Address",
          "hidden": false,
          "create": true,
          "delete": true,
          "set": true,
          "get": true,
          "attributes": [
            {
              "name": "Street",
              "mandatory": true,
              "typeValue": "OctetString",
              "multiValue": false,
              "lengthValue": "0..50"
            }
          ]
        }
      ]
    }`;
        modelJson = JSON.parse(jsonString);
    });

    it('should correctly parse a Model from JSON', () => {
        const model = Model.fromJson(modelJson);

        // Top-level properties
        expect(model.name).toBe('Subscriber');
        expect(model.hidden).toBe(false);
        expect(model.canCreate).toBe(true);
        expect(model.canDelete).toBe(false);
        expect(model.canSet).toBe(true);
        expect(model.canGet).toBe(true);
        expect(model.otherActions).toEqual(['forceDelete', 'import']);

        // Attributes
        const firstNameAttr = model.attribute('FirstName');
        expect(firstNameAttr).not.toBeNull();
        expect(firstNameAttr?.name).toBe('FirstName');
        expect(firstNameAttr?.mandatory).toBe(true);
        expect(firstNameAttr?.type).toBe(Model.AttributeType.Enumerated);
        expect(firstNameAttr?.multiValue).toBe(false);
        expect(firstNameAttr?.allowedValues).toEqual(['Alice', 'Bob']);
        expect(firstNameAttr?.defaultValue).toBe('Alice');
        expect(firstNameAttr?.filtering).toBe(true);
        expect(firstNameAttr?.usedWhen).toBe('Creation');

        const ageAttr = model.attribute('Age');
        expect(ageAttr).not.toBeNull();
        expect(ageAttr?.type).toBe(Model.AttributeType.Integer);

        // Child objects
        const addressChild = model.child('Address');
        expect(addressChild).not.toBeUndefined();
        expect(addressChild?.name).toBe('Address');
        expect(addressChild?.canDelete).toBe(true);

        const streetAttr = addressChild?.attribute('Street');
        expect(streetAttr).not.toBeNull();
        expect(streetAttr?.type).toBe(Model.AttributeType.OctetString);
        expect(streetAttr?.mandatory).toBe(true);
    });

    it('should return null for non-existing attribute', () => {
        const model = Model.fromJson(modelJson);
        expect(model.attribute('NonExistent')).toBeNull();
    });

    it('should return undefined for non-existing child', () => {
        const model = Model.fromJson(modelJson);
        expect(model.child('NonExistent')).toBeNull();
    });
});
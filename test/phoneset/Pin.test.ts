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

import { Pin } from "../../src/types/phoneset/pin";


describe('Pin class', () => {
    let pins: Pin[];

    beforeEach(() => {
        const jsonString = `[ 
            { 
                "Pin_Number": "1234", 
                "With_Secret_Code": true, 
                "Pin_Type_Of_Control": "PIN_Category", 
                "Pin_Group": 1 
            },
            { 
                "Pin_Number": "5678", 
                "With_Secret_Code": false, 
                "Pin_Type_Of_Control": "PIN_Restricted_To_Owner_Set", 
                "Pin_Group": 2 
            }
        ]`;

        const parsedJson = JSON.parse(jsonString);
        pins = parsedJson.map((item: any) => Pin.fromJson(item));
    });

    it('should create Pin instances from JSON string', () => {
        expect(pins).toHaveLength(2);

        // First PIN
        expect(pins[0].number).toBe('1234');
        expect(pins[0].withSecretCode).toBe(true);
        expect(pins[0].control).toBe(Pin.Control.ByCategory);
        expect(pins[0].group).toBe(1);

        // Second PIN
        expect(pins[1].number).toBe('5678');
        expect(pins[1].withSecretCode).toBe(false);
        expect(pins[1].control).toBe(Pin.Control.RestrictedToOwner);
        expect(pins[1].group).toBe(2);
    });

    it('should handle unknown or invalid control values safely', () => {
        const invalidJsonString = `[ 
            { 
                "Pin_Number": "9999", 
                "With_Secret_Code": true, 
                "Pin_Type_Of_Control": "INVALID_CONTROL", 
                "Pin_Group": 3 
            }
        ]`;

        const parsedInvalid = JSON.parse(invalidJsonString);
        const pin = Pin.fromJson(parsedInvalid[0]);

        expect(pin.number).toBe('9999');
        expect(pin.withSecretCode).toBe(true);
        expect(pin.control).toBeNull(); // invalid enum maps to null
        expect(pin.group).toBe(3);
    });

    it('should serialize back to JSON correctly', () => {
        const pin = pins[0];
        const jsonOut = Pin.toJson(pin);

        expect(jsonOut.Pin_Number).toBe('1234');
        expect(jsonOut.With_Secret_Code).toBe(true);
        expect(jsonOut.Pin_Type_Of_Control).toBe(Pin.Control.ByCategory);
        expect(jsonOut.Pin_Group).toBe(1);
    });
});
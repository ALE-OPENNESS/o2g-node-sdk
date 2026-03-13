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

import { OnCtiLinkDown, OnCtiLinkUp, OnLicenseExpiration, OnPbxLinkDown, OnPbxLinkUp, OnPbxLoaded, OnServerStart } from "../../../src/types/maint/maint-events";


describe('PBX/CTI Event Classes', () => {

    const jsonString = `{
        "nodeId": "2"
    }`;

    it('OnCtiLinkDown should parse JSON correctly', () => {
        const event = OnCtiLinkDown.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnCtiLinkDown);
        expect(event.nodeId).toBe(2);
    });

    it('OnCtiLinkUp should parse JSON correctly', () => {
        const event = OnCtiLinkUp.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnCtiLinkUp);
        expect(event.nodeId).toBe(2);
    });

    it('OnLicenseExpiration should parse JSON correctly', () => {

        const json = JSON.parse(`{
            "message": "License will expire soon",
            "nbDays": 10
        }`);

        const event = OnLicenseExpiration.fromJson(json);

        expect(event).toBeInstanceOf(OnLicenseExpiration);

        expect(event.message).toBe("License will expire soon");
        expect(event.nbDays).toBe(10);

        const expiredJson = { message: "License expired", nbDays: -5 };
        const expiredEvent = OnLicenseExpiration.fromJson(expiredJson);
        expect(expiredEvent.nbDays).toBe(-5);
    });

    it('OnPbxLoaded should parse JSON correctly', () => {

        const event = OnPbxLoaded.fromJson(JSON.parse(jsonString));
        expect(event).toBeInstanceOf(OnPbxLoaded);
        expect(event.nodeId).toBe(2);
    });

    it('OnPbxLinkDown should parse JSON correctly', () => {
        const event = OnPbxLinkDown.fromJson(JSON.parse(jsonString));
        expect(event).toBeInstanceOf(OnPbxLinkDown);
        expect(event.nodeId).toBe(2);
    });

    it('OnPbxLinkUp should parse JSON correctly', () => {
        const event = OnPbxLinkUp.fromJson(JSON.parse(jsonString));
        expect(event).toBeInstanceOf(OnPbxLinkUp);
        expect(event.nodeId).toBe(2);
    });

    it('OnServerStart should parse JSON correctly', () => {

        const json = JSON.parse(`{
            "serverId": "192.168.1.100"
        }`);

        const event = OnServerStart.fromJson(json);
        expect(event).toBeInstanceOf(OnServerStart);
        expect(event.serverId).toBe("192.168.1.100");
    });

});
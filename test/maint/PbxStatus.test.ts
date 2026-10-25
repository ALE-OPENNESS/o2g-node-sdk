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

import { PbxStatusJson } from "../../src/internal/types/maint/maint-types";
import { CTILinkState } from "../../src/types/maint/cti-link-state";
import { PbxStatus } from "../../src/types/maint/pbx-status";

describe('PbxStatus', () => {

    describe('fromJson', () => {
        it('creates a PbxStatus from an O2G 2.8 json', () => {
            const json: PbxStatusJson = JSON.parse(`{
                "name": "bsbice29",
                "nodeId": 7,
                "mainAddress": {
                    "fqdn": "oxe.lab.main.col",
                    "ip": "10.3.1.120"
                },
                "secondaryAddress": {
                    "fqdn": "oxe.lab.backup.col",
                    "ip": "10.3.1.121"
                },
                "version": "n4.513.9",
                "connected": true,
                "loaded": true,
                "ctiLinkState": "CONNECTED_MAIN",
                "secured": true,
                "monitoredUserNumber": 3879,
                "lmsConnectionStatus": false,
                "ctiSecuredLink": true,
                "afeConnectionStatus": true,
                "afeRTIStatus": true
            }`);

            const pbx = PbxStatus.fromJson(json);

            expect(pbx.name).toBe("bsbice29");
            expect(pbx.nodeId).toBe(7);
            expect(pbx.mainAddress!.fqdn).toBe("oxe.lab.main.col");
            expect(pbx.mainAddress!.ip).toBe("10.3.1.120");
            expect(pbx.secondaryAddress!.fqdn).toBe("oxe.lab.backup.col");
            expect(pbx.secondaryAddress!.ip).toBe("10.3.1.121");
            expect(pbx.version).toBe("n4.513.9");
            expect(pbx.connected).toBe(true);
            expect(pbx.loaded).toBe(true);
            expect(pbx.ctiLinkState).toBe(CTILinkState.CONNECTED_MAIN);
            expect(pbx.secured).toBe(true);
            expect(pbx.monitoredUserNumber).toBe(3879);
            expect(pbx.ctiSecuredLink).toBe(true);
            expect(pbx.afeConnectionStatus).toBe(true);
            expect(pbx.afeRTIStatus).toBe(true);
        });

        it('defaults O2G 2.8 fields to false when absent (pre-2.8 server)', () => {
            const json: PbxStatusJson = JSON.parse(`{
                "name": "bsbice35",
                "nodeId": 9,
                "version": "n4.509.0",
                "connected": true,
                "loaded": true,
                "ctiLinkState": "CONNECTED_MAIN",
                "secured": true,
                "monitoredUserNumber": 4999,
                "lmsConnectionStatus": false
            }`);

            const pbx = PbxStatus.fromJson(json);

            expect(pbx.ctiSecuredLink).toBe(false);
            expect(pbx.afeConnectionStatus).toBe(false);
            expect(pbx.afeRTIStatus).toBe(false);
        });

        it('applies defaults on an empty json', () => {
            const pbx = PbxStatus.fromJson({});

            expect(pbx.name).toBeNull();
            expect(pbx.nodeId).toBe(0);
            expect(pbx.mainAddress).toBeNull();
            expect(pbx.secondaryAddress).toBeNull();
            expect(pbx.version).toBeNull();
            expect(pbx.connected).toBe(false);
            expect(pbx.loaded).toBe(false);
            expect(pbx.ctiLinkState).toBeNull();
            expect(pbx.secured).toBe(false);
            expect(pbx.monitoredUserNumber).toBe(0);
            expect(pbx.ctiSecuredLink).toBe(false);
            expect(pbx.afeConnectionStatus).toBe(false);
            expect(pbx.afeRTIStatus).toBe(false);
        });
    });

});

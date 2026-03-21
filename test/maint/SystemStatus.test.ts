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

import { SystemStatusJson } from "../../src/internal/types/maint/maint-types";
import { SystemStatus } from "../../src/types/maint/sys-status";



// test/users/DndState.test.ts

describe('SystemStatus', () => {

    describe('fromJson', () => {
        it('creates a SystemStatus from json', () => {

            const jsonString = `{
            "logicalAddress": {
                "fqdn": "o2g.main.server.com",
                "ip": "10.0.1.123"
            },
            "startDate": "2025-12-19T16:26:23.940Z",
            "ha": false,
            "primary": "o2g.main.server.com",
            "primaryVersion": "14.7.005.000",
            "primaryServicesStatus": {
                "services": [
                {
                    "name": "apache",
                    "status": "STARTED"
                },
                {
                    "name": "flexlm",
                    "status": "STARTED"
                },
                {
                    "name": "postgresql",
                    "status": "STARTED"
                },
                {
                    "name": "tomcat",
                    "status": "STARTED"
                }
                ],
                "globalIPAdress": "",
                "drbd": ""
            },
            "pbxs": [
                {
                "name": "bsbice29",
                "nodeId": 7,
                "mainAddress": {
                    "fqdn": "oxe.lab.main.col",
                    "ip": "10.3.1.120"
                },
                "secondaryAddress": {},
                "version": "n4.513.9",
                "connected": true,
                "loaded": true,
                "ctiLinkState": "CONNECTED_MAIN",
                "secured": true,
                "monitoredUserNumber": 3879,
                "lmsConnectionStatus": false
                },
                {
                "name": "12.123.6.10",
                "nodeId": 60,
                "mainAddress": {
                    "fqdn": "12.123.6.10",
                    "ip": "12.123.6.10"
                },
                "secondaryAddress": {},
                "version": "n2.514.0",
                "connected": true,
                "loaded": true,
                "ctiLinkState": "CONNECTED_MAIN",
                "secured": true,
                "monitoredUserNumber": 10,
                "lmsConnectionStatus": false
                },
                {
                "name": "bsbice35",
                "nodeId": 9,
                "mainAddress": {
                    "fqdn": "oxe3.system.com",
                    "ip": "30.1.1.23"
                },
                "secondaryAddress": {},
                "version": "n4.509.0",
                "connected": true,
                "loaded": true,
                "ctiLinkState": "CONNECTED_MAIN",
                "secured": true,
                "monitoredUserNumber": 4999,
                "lmsConnectionStatus": false
                },
                {
                "name": "bsbice34",
                "nodeId": 5,
                "mainAddress": {
                    "fqdn": "oxe34.lab.virtt.com",
                    "ip": "172.25.152.34"
                },
                "secondaryAddress": {},
                "version": "n3.521.5",
                "connected": true,
                "loaded": true,
                "ctiLinkState": "CONNECTED_MAIN",
                "secured": true,
                "monitoredUserNumber": 4987,
                "lmsConnectionStatus": false
                }
            ],
            "recordingStatus": {
                "oxrs": [],
                "devices": []
            },
            "license": {
                "type": "FLEXLM",
                "context": "",
                "currentServer": "localhost",
                "status": "NORMAL",
                "statusMessage": "",
                "lics": [
                {
                    "name": "ROXE_HA",
                    "total": 1,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_TOKEN_MODE",
                    "total": 1,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_TEL_BASIC",
                    "total": 200000,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_TEL_ADVANCED",
                    "total": 200000,
                    "currentUsed": 1,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_MESSAGING",
                    "total": 200000,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_MANAGEMENT",
                    "total": 200000,
                    "currentUsed": 13899,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_PHONESETPROG",
                    "total": 200000,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_ANALYTICS",
                    "total": 1,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_CONTACTCENTER_AGENT",
                    "total": 200000,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_CONTACTCENTER_RSI",
                    "total": 200000,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_CLOUD_CONNECTIVITY",
                    "total": 1,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_CONTACTCENTER_SVCS",
                    "total": 1,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                }
                ]
            },
            "systemResources": {
                "fqdn": "o2g.main.server.com",
                "ip": "10.0.1.123"
            },
            "tcollected": false,
            "callCenterFeaturesActive": true,
            "configurationType": "FULL_SERVICES",
            "subscriberFilter": "ALL"
            }`;

            let json: SystemStatusJson = JSON.parse(jsonString);
            const systemStatus = SystemStatus.fromJson(json);

            // Basic checks
            expect(systemStatus.haMode).toBe(false);
            expect(systemStatus.primary).toBe("o2g.main.server.com");
            expect(systemStatus.primaryVersion).toBe("14.7.005.000");

            // Nested object checks
            expect(systemStatus.logicalAddress!.fqdn).toBe("o2g.main.server.com");
            expect(systemStatus.logicalAddress!.ip).toBe("10.0.1.123");

            // Date check
            expect(systemStatus.startDate instanceof Date).toBe(true);
            expect(systemStatus.startDate!.toISOString()).toBe("2025-12-19T16:26:23.940Z");

            // Services array check
            expect(systemStatus.primaryServiceStatus!.services!.length).toBe(4);
            expect(systemStatus.primaryServiceStatus!.services![0].name).toBe("apache");
            expect(systemStatus.primaryServiceStatus!.services![0].status).toBe("STARTED");

            // License check
            expect(systemStatus.license!.type).toBe("FLEXLM");

            expect(systemStatus.systemResources?.fqdn).toBe("o2g.main.server.com");

            // Configuration
            expect(systemStatus.configurationType).toBe("FULL_SERVICES");
            expect(systemStatus.subscriberFilter).toBe("ALL");        
        });
    });

});

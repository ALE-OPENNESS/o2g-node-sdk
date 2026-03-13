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

import { SystemServiceStatusJson } from "../../src/internal/types/maint/maint-types";
import { ServiceStatus } from "../../src/types/maint/service-status";
import { SystemServiceStatus } from "../../src/types/maint/sys-service-status";


describe('SystemServiceStatus', () => {

    it('should parse JSON and create SystemServiceStatus instance', () => {

        const jsonString = `{
            "services": [
            {
                "name": "apache",
                "status": "STARTED"
            },
            {
                "name": "flexlm",
                "status": "STOPPED"
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
        }`;

        const json: SystemServiceStatusJson = JSON.parse(jsonString);
        const systemServiceStatus = SystemServiceStatus.fromJson(json);

        // Assertions
        expect(systemServiceStatus).toBeInstanceOf(SystemServiceStatus);
        expect(systemServiceStatus.services!.length).toBe(4);

        // Check first service
        const firstService = systemServiceStatus.services![0];
        expect(firstService).toBeInstanceOf(ServiceStatus);
        expect(firstService.name).toBe('apache');
        expect(firstService.status).toBe('STARTED');

        // Check second service
        const secondService = systemServiceStatus.services![1];
        expect(secondService.name).toBe('flexlm');
        expect(secondService.status).toBe('STOPPED');
    });

});
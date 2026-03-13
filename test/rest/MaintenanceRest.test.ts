/*
* Copyright 2021 ALE International
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

import MaintenanceRest from "../../src/internal/rest/maint-rest";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { LicenseType } from "../../src/types/maint/license-type";
import { SystemStatus } from "../../src/types/maint/sys-status";



describe('MaintenanceRest', () => {
    let mockHttpClient: jest.Mocked<IHttpClient>;
    let rest: MaintenanceRest;
    const baseUri = 'https://api.example.com/maintenance';

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<IHttpClient>;

        rest = new MaintenanceRest(baseUri, mockHttpClient);
    });

    describe('getSystemStatus', () => {
        it('should return a SystemStatus object when HTTP GET succeeds', async () => {
            const mockJson = `{
                "logicalAddress": { "fqdn": "o2g.example.com", "ip": "192.168.1.1" },
                "startDate": "2026-02-28T10:00:00Z",
                "ha": true,
                "primary": "primary.o2g.com",
                "primaryVersion": "v1.2.3",
                "primaryServicesStatus": {
                    "services": [
                        { "name": "ServiceA", "status": "running", "mode": "auto" },
                        { "name": "ServiceB", "status": "stopped" }
                    ],
                    "globalIPAdress": "10.0.0.1",
                    "drbd": "up"
                },
                "pbxs": [],
                "license": {
                    "type": "FLEXLM",
                    "context": "main",
                    "currentServer": "server1",
                    "status": "OK",
                    "statusMessage": "All good",
                    "lics": [
                        { "name": "LicenseA", "total": 10, "currentUsed": 5, "expiration": "28-feb-2026" }
                    ]
                },
                "configurationType": "FULL_SERVICES",
                "applicationId": "app123",
                "subscriberFilter": "ALL"
            }`;

            mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, mockJson));

            const status = await rest.getSystemStatus();

            expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/status`);
            
            expect(status).toBeInstanceOf(SystemStatus);
            expect(status?.logicalAddress?.fqdn).toBe('o2g.example.com');
            expect(status?.primary).toBe('primary.o2g.com');
            expect(status?.primaryServiceStatus?.services?.length).toBe(2);
            expect(status?.license?.type).toBe(LicenseType.FLEXLM);
            expect(status?.license?.licenses?.[0]?.name).toBe('LicenseA');
        });

        it('should return null when HTTP GET returns no content', async () => {
            mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, null));

            const status = await rest.getSystemStatus();

            expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/status`);
            expect(status).toBeNull();
        });

        it('should return null when HTTP GET fails', async () => {
            mockHttpClient.get.mockRejectedValue(new Error('Network error'));

            await expect(rest.getSystemStatus()).rejects.toThrow('Network error');
        });
    });
});
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

import UsersRest from "../../src/internal/rest/users-rest";
import { HttpContent } from "../../src/internal/util/http-content";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { SupportedLanguages } from "../../src/o2g-node-sdk";
import { DeviceType } from "../../src/types/common/device-type";
import { Preferences } from "../../src/types/users/preferences";
import { User } from "../../src/types/users/user";

describe('UsersRest', () => {
    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: UsersRest;

    const mockJsonString = `{
        "companyPhone": "1000",
        "firstName": "john",
        "lastName": "doo",
        "loginName": "oxe1000",
        "voicemail": {
            "number": "2000",
            "type": "VM_4635"
        },
        "devices": [
            {
                "type": "DESKPHONE",
                "id": "1000",
                "subType": "ALE-300"
            }
        ],
        "nodeId": "2"
    }`;

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        } as jest.Mocked<IHttpClient>;

        service = new UsersRest('/users', mockHttpClient);
    });

    // -----------------------
    // getByLoginName
    // -----------------------
    it("should return a User instance when getByLoginName returns JSON", async () => {
        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, mockJsonString));

        const user = await service.getByLoginName("john");

        expect(mockHttpClient.get).toHaveBeenCalledWith("/users/john");
        expect(user).toBeInstanceOf(User);

        expect(user?.companyPhone).toBe("1000");

        expect(user?.devices).not.toBeNull();
        const devices = user!.devices!;
        expect(devices).toHaveLength(1);
        expect(devices[0].id).toBe("1000");
        expect(devices[0].type).toBe(DeviceType.DESKPHONE);

        expect(user?.voicemail).toBeDefined();
        expect(user?.voicemail?.number).toBe("2000");
    });

    it("should return null when getByLoginName returns no data", async () => {
        mockHttpClient.get.mockResolvedValue(new HttpResponse(404, null, ""));
        const user = await service.getByLoginName("unknown");
        expect(user).toBeNull();
    });

    // -----------------------
    // getLogins
    // -----------------------
    it("should return an array of login names for getLogins", async () => {
        const mockJson = { loginNames: ["user1", "user2"] };
        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, mockJson));

        const result = await service.getLogins([1, 2], true, true);

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            "/logins?nodeIds=1%3B2&onlyACD&onlyWithExtLogin"
        );
        expect(result).toEqual(["user1", "user2"]);
    });

    it("should return null when getLogins returns empty data", async () => {
        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, null));
        const result = await service.getLogins(null, false, false);
        expect(result).toBeNull();
    });

    // -----------------------
    // getByCompanyPhone
    // -----------------------
    it("should return a User instance when getByCompanyPhone returns JSON", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockJsonString)
        );

        const user = await service.getByCompanyPhone("1000");

        expect(mockHttpClient.get).toHaveBeenCalledWith("/users?companyPhone=1000");

        expect(user).toBeInstanceOf(User);

        expect(user?.companyPhone).toBe("1000");

        expect(user?.devices).not.toBeNull();
        const devices = user!.devices!;
        expect(devices).toHaveLength(1);
        expect(devices[0].id).toBe("1000");
        expect(devices[0].type).toBe(DeviceType.DESKPHONE);

        expect(user?.voicemail).toBeDefined();
        expect(user?.voicemail?.number).toBe("2000");
    });

    it("should return null when getByCompanyPhone returns nothing", async () => {

        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, null));
        
        const result = await service.getByCompanyPhone("0000");

        expect(mockHttpClient.get).toHaveBeenCalledWith("/users?companyPhone=0000");
        expect(result).toBeNull();
    });

    // -----------------------
    // getPreferences
    // -----------------------
    it("should return Preferences instance", async () => {
        const mockJson = { guiLanguage: "en", oxeLanguage: "fr" };

        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, mockJson));

        const result = await service.getPreferences("oxe1000");
        expect(mockHttpClient.get).toHaveBeenCalledWith("/users/oxe1000/preferences");

        expect(result).toBeInstanceOf(Preferences);
        expect(result?.guiLanguage).toBe("en");
    });

    // -----------------------
    // getSupportedLanguages
    // -----------------------
    it("should return SupportedLanguages instance", async () => {
        const mockJson = { supportedLanguages: ["en", "fr"], supportedGuiLanguages: ["en"] };
        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, mockJson));

        const result = await service.getSupportedLanguages("oxe1000");
        expect(mockHttpClient.get).toHaveBeenCalledWith("/users/oxe1000/preferences/supportedLanguages");

        expect(result).toBeInstanceOf(SupportedLanguages);
        expect(result?.supportedLanguages).toEqual(["en", "fr"]);
    });

    // -----------------------
    // changePassword
    // -----------------------
    it("should call PUT and return true when password change succeeds", async () => {
        mockHttpClient.put.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.changePassword("oxe1000", "oldpassword", "newpassword");

        expect(mockHttpClient.put).toHaveBeenCalledWith(
            "/users/oxe1000/password",
            new HttpContent(JSON.stringify(
                { 
                    oldPassword: "oldpassword",
                    newPassword: "newpassword"
                }))
        );
        expect(result).toBe(true);
    });

    it("should return false when password change fails", async () => {
        mockHttpClient.put.mockResolvedValue(new HttpResponse(403, null, ''));

        const result = await service.changePassword("oxe1000", "old", "new");
        expect(result).toBe(false);
    });
});
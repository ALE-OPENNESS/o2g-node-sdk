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

import UsersManagementRest from "../../src/internal/rest/users-mngt-rest";
import { HttpContent } from "../../src/internal/util/http-content";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { User } from "../../src/types/users/user";

describe('UsersManagementRest', () => {
    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: UsersManagementRest;

    const mockUserJson = {
        companyPhone: "60200",
        firstName: "John",
        lastName: "Doe",
        loginName: "jdoe",
        nodeId: 1
    };

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        } as jest.Mocked<IHttpClient>;

        service = new UsersManagementRest('/users-management', mockHttpClient);
    });

    // -----------------------
    // getLogins
    // -----------------------
    it("should return login names when called without nodeIds", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, { loginNames: ["jdoe", "jsmith"] })
        );

        const result = await service.getLogins(null);

        expect(mockHttpClient.get).toHaveBeenCalledWith("/users-management");
        expect(result).toEqual(["jdoe", "jsmith"]);
    });

    it("should append nodeIds query when called with a list of node ids", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, { loginNames: ["jdoe"] })
        );

        const result = await service.getLogins([1, 2]);

        expect(mockHttpClient.get).toHaveBeenCalledWith("/users-management?nodeIds=1%3B2");
        expect(result).toEqual(["jdoe"]);
    });

    it("should return null when getLogins returns no data", async () => {
        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, null));

        const result = await service.getLogins(null);

        expect(result).toBeNull();
    });

    // -----------------------
    // getByDeviceNumber
    // -----------------------
    it("should return the login name of the user matching the device number", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, { loginNames: ["jdoe"] })
        );

        const result = await service.getByDeviceNumber("60200");

        expect(mockHttpClient.get).toHaveBeenCalledWith("/users-management?deviceNumber=60200");
        expect(result).toBe("jdoe");
    });

    it("should return null when no user matches the device number", async () => {
        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, null));

        const result = await service.getByDeviceNumber("99999");

        expect(result).toBeNull();
    });

    // -----------------------
    // createUsers
    // -----------------------
    it("should POST to the users-management endpoint with specific device numbers", async () => {
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, { users: [mockUserJson] })
        );

        const result = await service.createUsers(1, ["60200", "60201"]);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/users-management",
            new HttpContent(JSON.stringify({ nodeId: 1, deviceNumbers: ["60200", "60201"] }))
        );
        expect(result).not.toBeNull();
        expect(result).toHaveLength(1);
        expect(result![0]).toBeInstanceOf(User);
        expect(result![0].loginName).toBe("jdoe");
        expect(result![0].companyPhone).toBe("60200");
    });

    it("should set all=true in the body when deviceNumbers is null", async () => {
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, { users: [mockUserJson] })
        );

        await service.createUsers(1, null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/users-management",
            new HttpContent(JSON.stringify({ nodeId: 1, all: true }))
        );
    });

    it("should set all=true in the body when deviceNumbers is an empty array", async () => {
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, { users: [] })
        );

        await service.createUsers(2, []);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/users-management",
            new HttpContent(JSON.stringify({ nodeId: 2, all: true }))
        );
    });

    it("should map each entry in the response to a User instance", async () => {
        const secondUserJson = { companyPhone: "60201", loginName: "jsmith", nodeId: 1 };
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, { users: [mockUserJson, secondUserJson] })
        );

        const result = await service.createUsers(1, ["60200", "60201"]);

        expect(result).toHaveLength(2);
        expect(result![0]).toBeInstanceOf(User);
        expect(result![1]).toBeInstanceOf(User);
        expect(result![1].loginName).toBe("jsmith");
    });

    it("should return null when createUsers fails", async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(500, null, null));

        const result = await service.createUsers(1, ["60200"]);

        expect(result).toBeNull();
    });

    // -----------------------
    // getByLoginName
    // -----------------------
    it("should return a User instance when getByLoginName finds a match", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockUserJson)
        );

        const result = await service.getByLoginName("jdoe");

        expect(mockHttpClient.get).toHaveBeenCalledWith("/users-management/jdoe");
        expect(result).toBeInstanceOf(User);
        expect(result?.loginName).toBe("jdoe");
        expect(result?.companyPhone).toBe("60200");
        expect(result?.firstName).toBe("John");
        expect(result?.lastName).toBe("Doe");
    });

    it("should return null when getByLoginName finds no match", async () => {
        mockHttpClient.get.mockResolvedValue(new HttpResponse(404, null, ""));

        const result = await service.getByLoginName("unknown");

        expect(result).toBeNull();
    });

    // -----------------------
    // deleteUser
    // -----------------------
    it("should return true when deleteUser succeeds", async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ""));

        const result = await service.deleteUser("jdoe");

        expect(mockHttpClient.delete).toHaveBeenCalledWith("/users-management/jdoe");
        expect(result).toBe(true);
    });

    it("should return false when deleteUser fails", async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(404, null, ""));

        const result = await service.deleteUser("jdoe");

        expect(mockHttpClient.delete).toHaveBeenCalledWith("/users-management/jdoe");
        expect(result).toBe(false);
    });
});

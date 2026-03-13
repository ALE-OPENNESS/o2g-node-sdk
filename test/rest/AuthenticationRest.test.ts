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

import AuthenticationRest from "../../src/internal/rest/authentication-rest";
import { O2GAuthenticateResult } from "../../src/internal/types/common/common-types";


describe('AuthenticationRest', () => {
    let mockHttpClient: any;
    let authRest: AuthenticationRest;

    beforeEach(() => {
        // Mock HTTP client with jest.fn()
        mockHttpClient = {
            get: jest.fn()
        };

        authRest = new AuthenticationRest('https://api.o2g.local/auth', mockHttpClient);
    });

    it('should return O2GAuthenticateResult on successful authentication', async () => {
        const expectedResult: O2GAuthenticateResult = {
            credential: 'token123',
            internalUrl: 'https://internal.o2g.local',
            publicUrl: 'https://public.o2g.local'
        };

        // Mock the httpClient.get to return the result wrapped in a resolved Promise
        mockHttpClient.get.mockResolvedValue({ result: expectedResult });

        // Mock getResult to just return the 'result' from the mocked response
        authRest.getResult = (response: any) => response.result;

        const result = await authRest.authenticate('alice', 'password123');

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            'https://api.o2g.local/auth',
            'json',
            expect.objectContaining({
                Authorization: expect.stringContaining('Basic ')
            })
        );

        expect(result).toEqual(expectedResult);
    });

    it('should return null if authentication fails', async () => {
        // Mock httpClient.get to return null result
        mockHttpClient.get.mockResolvedValue({ result: null });
        authRest.getResult = (response: any) => response.result;

        const result = await authRest.authenticate('bob', 'wrongpassword');
        expect(result).toBeNull();
    });

    it('should encode Basic Auth header correctly', async () => {
        const expected: O2GAuthenticateResult = {
            credential: 'tokenXYZ',
            internalUrl: 'https://internal.o2g.local',
            publicUrl: 'https://public.o2g.local'
        };

        mockHttpClient.get.mockResolvedValue({ result: expected });
        authRest.getResult = (r: any) => r.result;

        const login = 'user';
        const password = 'secret';
        const result = await authRest.authenticate(login, password);

        const expectedHeader = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64');
        expect(mockHttpClient.get).toHaveBeenCalledWith(
            expect.any(String),
            'json',
            expect.objectContaining({ Authorization: expectedHeader })
        );

        expect(result).toEqual(expected);
    });
});
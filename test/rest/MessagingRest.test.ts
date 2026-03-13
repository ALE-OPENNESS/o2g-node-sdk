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

import MessagingRest from "../../src/internal/rest/messaging-rest";
import { HttpContent } from "../../src/internal/util/http-content";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";

describe('MessagingRest Full Suite', () => {

    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: MessagingRest;
    const baseUri = 'http://o2g/messaging';

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        } as any;

        service = new MessagingRest(baseUri, mockHttpClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    // ----------------------------
    // getMailboxes
    // ----------------------------

    it('getMailboxes should return MailBox array', async () => {

        const jsonString = `
        {
            "mailboxes": [
                {
                    "id": "100",
                    "name": "MainBox",
                    "capabilities": {
                        "listMessages": true,
                        "delete": true
                    }
                }
            ]
        }`;

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.getMailboxes("oxe1001");

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            `${baseUri}?loginName=oxe1001`
        );

        expect(result).not.toBeNull();
        expect(result!.length).toBe(1);
    });

    it('getMailboxes should return null if no mailboxes array', async () => {

        const jsonString = `{}`;

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.getMailboxes(null);

        expect(result).toBeNull();
    });

    // ----------------------------
    // getMailboxInfo
    // ----------------------------

    it('getMailboxInfo should POST with password body', async () => {

        const jsonString = `
        {
            "totalVoiceMsg": 5,
            "newVoiceMsg": 2,
            "storageUsage": 30
        }`;

        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.getMailboxInfo("100", "1234", "oxe1001");

        const [url, body] = mockHttpClient.post.mock.calls[0];

        expect(url).toBe(`${baseUri}/100?loginName=oxe1001`);
        expect(JSON.parse((body as HttpContent).content)).toEqual({
            password: "1234"
        });

        expect(result).not.toBeNull();
    });

    it('getMailboxInfo should POST with withUserPwd query if no password', async () => {

        const jsonString = `
        {
            "totalVoiceMsg": 3,
            "newVoiceMsg": 1,
            "storageUsage": 10
        }`;

        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.getMailboxInfo("100", null, null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/100?withUserPwd`
        );

        expect(result).not.toBeNull();
    });

    // ----------------------------
    // getVoiceMessages
    // ----------------------------

    it('getVoiceMessages should return VoiceMessage array with all query params', async () => {

        const jsonString = `
        {
            "voicemails": [
                {
                    "voicemailId": "vm1",
                    "duration": 20,
                    "date": "2023-01-01T00:00:00.000Z",
                    "unread": true,
                    "highPriority": false
                }
            ]
        }`;

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.getVoiceMessages(
            "100",
            true,
            10,
            20,
            "oxe1001"
        );

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            `${baseUri}/100/voicemails?loginName=oxe1001&newOnly=true&offset=10&limit=20`
        );

        expect(result).not.toBeNull();
        expect(result!.length).toBe(1);
    });

    it('getVoiceMessages should return null if voicemails missing', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{}`)
        );

        const result = await service.getVoiceMessages("100", false, null, null, null);

        expect(result).toBeNull();
    });

    // ----------------------------
    // downloadVoiceMessage
    // ----------------------------

    it('downloadVoiceMessage should GET arrayBuffer and call downloadFile', async () => {

        const mockResponse = new HttpResponse(200, null, new ArrayBuffer(8));
        mockHttpClient.get.mockResolvedValue(mockResponse);

        const downloadSpy = jest.spyOn(service as any, 'downloadFile')
            .mockResolvedValue("file.wav");

        const result = await service.downloadVoiceMessage("100", "vm1", null, "oxe1001");

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            `${baseUri}/100/voicemails/vm1?loginName=oxe1001`,
            "arrayBuffer"
        );

        expect(downloadSpy).toHaveBeenCalled();
        expect(result).toBe("file.wav");
    });

    // ----------------------------
    // acknowledgeVoiceMessage
    // ----------------------------

    it('acknowledgeVoiceMessage should GET with Range header', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, new ArrayBuffer(2))
        );

        const result = await service.acknowledgeVoiceMessage("100", "vm1", null);

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            `${baseUri}/100/voicemails/vm1`,
            "arrayBuffer",
            { Range: "bytes=0-1" }
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // deleteVoiceMessages
    // ----------------------------

    it('deleteVoiceMessages should DELETE with msgIds query', async () => {

        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(200, null, '')
        );

        const result = await service.deleteVoiceMessages(
            "100",
            ["vm1", "vm2"],
            "oxe1001"
        );

        expect(mockHttpClient.delete).toHaveBeenCalledWith(
            `${baseUri}/100/voicemails?loginName=oxe1001&msgIds=vm1%3Bvm2`
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // deleteVoiceMessage
    // ----------------------------

    it('deleteVoiceMessage should DELETE single voicemail', async () => {

        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(200, null, '')
        );

        const result = await service.deleteVoiceMessage(
            "100",
            "vm1",
            null
        );

        expect(mockHttpClient.delete).toHaveBeenCalledWith(
            `${baseUri}/100/voicemails/vm1`
        );

        expect(result).toBe(true);
    });

});
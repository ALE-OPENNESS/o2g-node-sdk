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

import RoutingRest from "../../src/internal/rest/routing-rest";
import { HttpContent } from "../../src/internal/util/http-content";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { ForwardCondition } from "../../src/types/routing/forward-condition";
import { OverflowCondition } from "../../src/types/routing/overflow-condition";


describe('RoutingRest Full Suite', () => {

    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: RoutingRest;
    const baseUri = 'http://o2g/routing';

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        } as any;

        service = new RoutingRest(baseUri, mockHttpClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    // ----------------------------
    // DND
    // ----------------------------

    it('activateDnd should POST with loginName', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.activateDnd("john");

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/dnd?loginName=john`
        );

        expect(result).toBe(true);
    });

    it('cancelDnd should DELETE without loginName', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.cancelDnd(null);

        expect(mockHttpClient.delete).toHaveBeenCalledWith(
            `${baseUri}/dnd`
        );

        expect(result).toBe(true);
    });

    it('getDndState should return DndState', async () => {

        const jsonString = `
        {
            "activate": true
        }`;

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.getDndState(null);

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            `${baseUri}/dnd`
        );

        expect(result).not.toBeNull();
    });

    // ----------------------------
    // Capabilities
    // ----------------------------

    it('getCapabilities should return RoutingCapabilities', async () => {

        const jsonString = `
        {
            "presentationRoute": true,
            "forwardRoute": true,
            "overflowRoute": false,
            "dnd": true
        }`;

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.getCapabilities("john");

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            `${baseUri}?loginName=john`
        );

        expect(result).not.toBeNull();
    });

    // ----------------------------
    // Forward
    // ----------------------------

    it('getForward should return Forward from JSON', async () => {

        const jsonString = `
        {
            "forwardType": "IMMEDIATE",
            "destinations": [
                { "type": "NUMBER", "number": "1234", "selected": true }
            ]
        }`;

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.getForward(null);

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            `${baseUri}/forwardroute`
        );

        expect(result).not.toBeNull();
    });

    it('cancelForward should DELETE forwardroute', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.cancelForward("john");

        expect(mockHttpClient.delete).toHaveBeenCalledWith(
            `${baseUri}/forwardroute?loginName=john`
        );

        expect(result).toBe(true);
    });

    it('forwardOnNumber should POST correct payload', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        await service.forwardOnNumber("5555", ForwardCondition.IMMEDIATE, null);

        const [url, body] = mockHttpClient.post.mock.calls[0];

        expect(url).toBe(`${baseUri}/forwardroute`);

        const parsed = JSON.parse((body as HttpContent).content);

        expect(parsed.forwardRoute).toBeDefined();
    });

    // ----------------------------
    // Overflow
    // ----------------------------

    it('overflowOnVoiceMail should POST correct payload', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        await service.overflowOnVoiceMail(OverflowCondition.BUSY, null);

        const [url, body] = mockHttpClient.post.mock.calls[0];

        expect(url).toBe(`${baseUri}/overflowroute`);

        const parsed = JSON.parse((body as HttpContent).content);

        expect(parsed.overflowRoutes).toBeDefined();
    });

    it('getOverflow should return Overflow from JSON', async () => {

        const jsonString = `
        {
            "overflowType": "BUSY",
            "destinations": [
                { "type": "VOICEMAIL", "selected": true }
            ]
        }`;

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.getOverflow(null);

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            `${baseUri}/overflowroute`
        );

        expect(result).not.toBeNull();
    });

    it('cancelOverflow should DELETE overflowroute', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.cancelOverflow(null);

        expect(mockHttpClient.delete).toHaveBeenCalledWith(
            `${baseUri}/overflowroute`
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // Remote Extension
    // ----------------------------

    it('setRemoteExtensionActivation should POST correct payload', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        await service.setRemoteExtensionActivation(true, null);

        const [url, body] = mockHttpClient.post.mock.calls[0];

        expect(url).toBe(`${baseUri}`);

        expect(JSON.parse((body as HttpContent).content)).toEqual({
            presentationRoutes: [
                {
                    destinations: [
                        { type: "MOBILE", selected: true }
                    ]
                }
            ]
        });
    });

    // ----------------------------
    // Routing State
    // ----------------------------

    it('getRoutingState should return RoutingState', async () => {

        const jsonString = `
        {
            "presentationRoutes": [],
            "forwardRoutes": [],
            "overflowRoutes": [],
            "dndState": { "activate": false }
        }`;

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.getRoutingState("john");

        expect(mockHttpClient.get).toHaveBeenCalledWith(
            `${baseUri}/state?loginName=john`
        );

        expect(result).not.toBeNull();
    });

    it('requestSnapshot should POST to snapshot endpoint', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.requestSnapshot(null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/state/snapshot`
        );

        expect(result).toBe(true);
    });

});
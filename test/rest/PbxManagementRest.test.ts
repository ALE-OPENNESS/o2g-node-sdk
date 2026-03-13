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

import PbxManagementRest from "../../src/internal/rest/pbx-mngt-rest";
import { HttpContent } from "../../src/internal/util/http-content";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { AttributeFilter } from "../../src/types/pbxmngt/attribute-filter";
import { InstanceFilter } from "../../src/types/pbxmngt/instance-filter";
import { Model } from "../../src/types/pbxmngt/model";
import { Pbx } from "../../src/types/pbxmngt/pbx";
import { PbxAttribute } from "../../src/types/pbxmngt/pbx-attribute";
import { PbxObject } from "../../src/types/pbxmngt/pbx-object";

describe('PbxManagementRest', () => {
    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: PbxManagementRest;
    const baseUri = 'https://api.example.com/pbxs';

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        }
        service = new PbxManagementRest(baseUri, mockHttpClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    // GetPbx
    it('getPbxs should return array of nodeIds', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "nodeIds": ["1","2","3"]
            }`)
        );

        const result = await service.getPbxs();
        expect(mockHttpClient.get).toHaveBeenCalledWith(baseUri);

        expect(result).toEqual([1, 2, 3]);
    });

    // Get a Pbx
    it('getPbx should return a Pbx instance', async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "fqdn": "oxe.main",
                "nodeId": 1
            }`)
        );

        const pbx = await service.getPbx(1);

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/1`);

        expect(pbx).toBeInstanceOf(Pbx);
        expect(pbx?.nodeId).toBe(1);
        expect(pbx?.fqdn).toBe("oxe.main");
    });

    // Get Object model
    it('getObjectModel with objectName should call correct URI', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "objectName": "Subscribers",
                "create": true
            }`)
        );

        const model = await service.getObjectModel(42, 'Subscribers');
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/42/model/Subscribers`);

        expect(model).toBeInstanceOf(Model);
        expect(model?.name).toBe("Subscribers");
        expect(model?.canCreate).toBe(true);
    });

    // getNodeObject
    it('getNodeObject should call correct URI', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "objectName": "root"
            }`)
        );

        const pbxObject = await service.getNodeObject(42);
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/42/instances`);

        expect(pbxObject).toBeInstanceOf(PbxObject);
    });

    // getObject
    it('getObject should call correct URI with list of attributes', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "objectName": "Subscribers",
                "objectId": "31000"
            }`)
        );

        const pbxObject = await service.getObject(1, "Subscribers", "31000", "Station_Type");
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/1/instances/Subscribers/31000?attributes=Station_Type`);

        expect(pbxObject).toBeInstanceOf(PbxObject);
        expect(pbxObject?.name).toBe("Subscribers");
    });

    // getObject
    it('getObject should call correct URI with list of PbxAttributes', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "objectName": "Subscribers",
                "objectId": "31000"
            }`)
        );

        const pbxObject = await service.getObject(1, "Subscribers", "31000", [new PbxAttribute("Station_Type"), new PbxAttribute("Multi_line")]);
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/1/instances/Subscribers/31000?attributes=Station_Type%2CMulti_line`);

        expect(pbxObject).toBeInstanceOf(PbxObject);
        expect(pbxObject?.name).toBe("Subscribers");
    });

    // getObjectInstances
    it('getObjectInstances should call correct URI', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "objectIds": ["31000", "31001", "31003"]
            }`)
        );

        const instances = await service.getObjectInstances(1, "Subscribers", null);
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/1/instances/Subscribers`);

        expect(instances).toEqual(["31000", "31001", "31003"]);
    });

    // getObjectInstances
    it('getObjectInstances should call correct URI with a filter', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "objectIds": ["31000", "31001", "31003"]
            }`)
        );

        const filter = InstanceFilter.create("Directory_Name", AttributeFilter.StartsWith, "f");

        const instances = await service.getObjectInstances(1, "Subscribers", filter);
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/1/instances/Subscribers?filter=Directory_Name%3D%3Df*`);

        expect(instances).toEqual(["31000", "31001", "31003"]);
    });

    // getObjectInstances
    it('getObjectInstances should call correct URI with a string filter', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "objectIds": ["31000", "31001", "31003"]
            }`)
        );

        const instances = await service.getObjectInstances(1, "Subscribers", "Directory_Name==f*");
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/1/instances/Subscribers?filter=Directory_Name%3D%3Df*`);

        expect(instances).toEqual(["31000", "31001", "31003"]);
    });

    // set Object
    it('setObject should call PUT with correct payload', async () => {

        mockHttpClient.put.mockResolvedValue(
            new HttpResponse(200, null, '')
        );

        const attr = new PbxAttribute("Directory_Name");
        attr.setString("John Doe");

        const result = await service.setObject(1, 'Subscribers', '31000', [attr]);

        expect(mockHttpClient.put).toHaveBeenCalledWith(
            `${baseUri}/1/instances/Subscribers/31000`,
            new HttpContent(JSON.stringify(
                {
                    attributes: [
                        {
                            name: "Directory_Name",
                            value: ["John Doe"]
                        }
                    ]
                }))
        );
        expect(result).toBe(true);
    });

    // create Object
    it('createObject should call PUT with correct payload', async () => {

        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, '')
        );

        const attr = new PbxAttribute("Directory_Name");
        attr.setString("John Doe");
        const result = await service.createObject(1, 'Subscribers/31000', [attr]);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/1/instances/Subscribers/31000`,
            new HttpContent(JSON.stringify(
                {
                    attributes: [
                        {
                            name: "Directory_Name",
                            value: ["John Doe"]
                        }
                    ]
                }))
        );
        expect(result).toBe(true);
    });

    // delete Object
    it('deleteObject with forceDelete=true should append query', async () => {

        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(200, null, '')
        );

        const result = await service.deleteObject(1, "Subscribers", "31000", false);

        expect(mockHttpClient.delete).toHaveBeenCalledWith(`${baseUri}/1/instances/Subscribers/31000`);
        expect(result).toBe(true);
    });
});
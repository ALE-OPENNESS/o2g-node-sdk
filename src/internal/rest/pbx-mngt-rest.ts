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

import { RestService } from './rest-service';
import { HttpContent } from '../util/http-content';
import UtilUri from '../util/util-uri';
import { AssertUtil } from '../util/assert';
import { Model } from '../../types/pbxmngt/model';
import { PbxObject } from '../../types/pbxmngt/pbx-object';
import { PbxAttribute } from '../../types/pbxmngt/pbx-attribute';
import { InstanceFilter } from '../../types/pbxmngt/instance-filter';
import {
    ObjectModelJson,
    PbxAttributeJson,
    PbxJson,
    PbxObjectIdsJson,
    PbxObjectJson,
} from '../types/pbxmngt/pbxmngt-types';
import { Pbx } from '../../types/pbxmngt/pbx';
import { IHttpClient } from '../util/IHttpClient';

/** @internal */
type PbxsJson = {
    nodeIds: string[];
};

/** @internal */
export default class PbxManagementRest extends RestService {
    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getPbxs(): Promise<Array<number> | null> {
        const pbxs = this.getResult<PbxsJson>(await this._httpClient.get(this._uri));
        if (pbxs && Array.isArray(pbxs.nodeIds)) {
            return pbxs.nodeIds.map((e) => parseInt(e));
        } else {
            return null;
        }
    }

    async getPbx(nodeId: number): Promise<Pbx | null> {
        const uriGet = UtilUri.appendPath(this._uri, AssertUtil.positive(nodeId, 'nodeId').toString());

        const _json = this.getResult<PbxJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return Pbx.fromJson(_json);
    }

    async getObjectModel(nodeId: number, objectName: string | null): Promise<Model | null> {
        let uriGet = UtilUri.appendPath(this._uri, AssertUtil.positive(nodeId, 'nodeId').toString(), 'model');
        if (objectName) {
            uriGet = UtilUri.appendPath(uriGet, objectName);
        }

        const _json = this.getResult<ObjectModelJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return Model.fromJson(_json);
    }

    async getNodeObject(nodeId: number): Promise<PbxObject | null> {
        let uriGet = UtilUri.appendPath(this._uri, AssertUtil.positive(nodeId, 'nodeId').toString(), 'instances');

        const _json = this.getResult<PbxObjectJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return PbxObject.fromJson(_json);
    }

    async getObject(
        nodeId: number,
        objectInstanceDefinition: string,
        objectId: string,
        attributes: string | PbxAttribute[] | null
    ): Promise<PbxObject | null> {
        let uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'instances',
            AssertUtil.notNullOrEmpty(objectInstanceDefinition, 'objectInstanceDefinition'),
            AssertUtil.notNullOrEmpty(objectId, 'objectId')
        );

        if (attributes) {
            if (Array.isArray(attributes)) {
                // Array of PbxAttribute
                uriGet = UtilUri.appendQuery(uriGet, 'attributes', attributes.map((attr) => attr.name).join(','));
            } else {
                uriGet = UtilUri.appendQuery(uriGet, 'attributes', attributes);
            }
        }

        const _json = this.getResult<PbxObjectJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return PbxObject.fromJson(_json);
    }

    async getObjectInstances(
        nodeId: number,
        objectInstanceDefinition: string,
        filter: string | InstanceFilter | null
    ): Promise<string[] | null> {
        let uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'instances',
            AssertUtil.notNullOrEmpty(objectInstanceDefinition, 'objectInstanceDefinition')
        );

        if (filter) {
            if (filter instanceof InstanceFilter) {
                // Considered as a Filter object
                uriGet = UtilUri.appendQuery(uriGet, 'filter', filter.value);
            } else {
                uriGet = UtilUri.appendQuery(uriGet, 'filter', filter);
            }
        }

        const _json = this.getResult<PbxObjectIdsJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return _json.objectIds;
    }

    async setObject(
        nodeId: number,
        objectInstanceDefinition: string,
        objectId: string,
        attributes: PbxAttribute[]
    ): Promise<boolean> {
        const uriPut = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'instances',
            AssertUtil.notNullOrEmpty(objectInstanceDefinition, 'objectInstanceDefinition'),
            AssertUtil.notNullOrEmpty(objectId, 'objectId')
        );

        const o2GPbxAttributeList: Array<PbxAttributeJson> = new Array<PbxAttributeJson>();
        attributes.forEach((a) => o2GPbxAttributeList.push(...PbxAttribute.toJson(a)));

        const json = JSON.stringify({
            attributes: o2GPbxAttributeList,
        });

        const httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async createObject(nodeId: number, objectInstanceDefinition: string, attributes: PbxAttribute[]): Promise<boolean> {
        const uriPost = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'instances',
            AssertUtil.notNullOrEmpty(objectInstanceDefinition, 'objectInstanceDefinition')
        );

        const o2GPbxAttributeList: Array<PbxAttributeJson> = new Array<PbxAttributeJson>();
        attributes.forEach((a) => o2GPbxAttributeList.push(...PbxAttribute.toJson(a)));

        const json = JSON.stringify({
            attributes: o2GPbxAttributeList,
        });

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async deleteObject(
        nodeId: number,
        objectInstanceDefinition: string,
        objectId: string,
        forceDelete: boolean
    ): Promise<boolean> {
        let uriDelete = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'instances',
            AssertUtil.notNullOrEmpty(objectInstanceDefinition, 'objectInstanceDefinition'),
            AssertUtil.notNullOrEmpty(objectId, 'objectId')
        );

        if (forceDelete) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'force');
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }
}

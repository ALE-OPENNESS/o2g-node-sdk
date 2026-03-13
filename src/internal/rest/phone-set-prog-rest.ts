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
import UtilUri from '../util/util-uri';
import { AssertUtil } from '../util/assert';
import { HttpContent } from '../util/http-content';
import { Device } from '../../types/common/device';
import { ProgrammeableKey } from '../../types/phoneset/prog-key';
import { SoftKey } from '../../types/phoneset/soft-key';
import { DynamicStateJson, PinCodeJson, ProgrammeableKeyJson, SoftKeyJson } from '../types/phoneset/phoneset-types';
import { Pin } from '../../types/phoneset/pin';
import { DynamicState } from '../../types/phoneset/dynamic-state';
import { DeviceJson } from '../types/common/common-types';
import { IHttpClient } from '../util/IHttpClient';

/** @internal */
type DeviceListJson = {
    devices: DeviceJson[];
};

/** @internal */
type ProgrammeableKeyListJson = {
    pkeys: ProgrammeableKeyJson[];
};

/** @internal */
type SoftKeyListJson = {
    skeys: SoftKeyJson[];
};

/** @internal */
export default class PhoneSetProgrammingRest extends RestService {
    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getDevices(loginName: string | null): Promise<Device[] | null> {
        const uriGet = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(loginName, 'loginName'), 'devices');

        const devices = this.getResult<DeviceListJson>(await this._httpClient.get(uriGet));
        if (devices && Array.isArray(devices.devices)) {
            return devices.devices.map(Device.fromJson);
        } else {
            return null;
        }
    }

    async getDevice(loginName: string | null, deviceId: string): Promise<Device | null> {
        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId')
        );

        return this.getResult<Device>(await this._httpClient.get(uriGet));
    }

    async getProgrammableKeys(loginName: string | null, deviceId: string): Promise<ProgrammeableKey[] | null> {
        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'programmeableKeys'
        );

        const json = this.getResult<ProgrammeableKeyListJson>(await this._httpClient.get(uriGet));
        if (json && Array.isArray(json.pkeys)) {
            return json.pkeys.map(ProgrammeableKey.fromJson);
        } else {
            return null;
        }
    }

    async getProgrammedKeys(loginName: string | null, deviceId: string): Promise<ProgrammeableKey[] | null> {
        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'programmedKeys'
        );

        const json = this.getResult<ProgrammeableKeyListJson>(await this._httpClient.get(uriGet));
        if (json && Array.isArray(json.pkeys)) {
            return json.pkeys.map((pk) => ProgrammeableKey.fromJson(pk));
        } else {
            return null;
        }
    }

    async setProgrammableKey(loginName: string | null, deviceId: string, key: ProgrammeableKey): Promise<boolean> {
        const uriPut = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'programmeableKeys',
            AssertUtil.positiveStrict(AssertUtil.notNull(key, 'key').position, 'key.position').toString()
        );

        const json = JSON.stringify(key.toJson());

        const httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async deleteProgrammableKey(loginName: string | null, deviceId: string, position: number): Promise<boolean> {
        const uriDelete = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'programmeableKeys',
            AssertUtil.positiveStrict(position, 'position').toString()
        );

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async getSoftKeys(loginName: string | null, deviceId: string): Promise<SoftKey[] | null> {
        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'softKeys'
        );

        const json = this.getResult<SoftKeyListJson>(await this._httpClient.get(uriGet));
        if (json && Array.isArray(json.skeys)) {
            return json.skeys.map(SoftKey.fromJson);
        } else {
            return null;
        }
    }

    async setSoftKey(loginName: string | null, deviceId: string, key: SoftKey): Promise<boolean> {
        const uriPut = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'softKeys',
            AssertUtil.positiveStrict(AssertUtil.notNull(key, 'key').position, 'key.position').toString()
        );

        const json = JSON.stringify(key.toJson());

        const httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async deleteSoftKey(loginName: string | null, deviceId: string, position: number): Promise<boolean> {
        const uriDelete = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'softKeys',
            AssertUtil.positiveStrict(position, 'position').toString()
        );

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    private async _doDeviceAction(
        loginName: string | null,
        deviceId: string,
        action: string,
        activate: boolean
    ): Promise<boolean> {
        let uriPut = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            action
        );

        uriPut = UtilUri.appendQuery(uriPut, 'activate', activate ? 'true' : 'false');

        const httpResponse = await this._httpClient.put(uriPut);
        return httpResponse.isSuccessStatusCode();
    }

    async lockDevice(loginName: string | null, deviceId: string): Promise<boolean> {
        return this._doDeviceAction(loginName, deviceId, 'lock', true);
    }

    async unlockDevice(loginName: string | null, deviceId: string): Promise<boolean> {
        return this._doDeviceAction(loginName, deviceId, 'lock', false);
    }

    async enableCampon(loginName: string | null, deviceId: string): Promise<boolean> {
        return this._doDeviceAction(loginName, deviceId, 'campon', true);
    }

    async disableCampon(loginName: string | null, deviceId: string): Promise<boolean> {
        return this._doDeviceAction(loginName, deviceId, 'campon', false);
    }

    async getPinCode(loginName: string | null, deviceId: string): Promise<Pin | null> {
        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'pin'
        );

        const _json = this.getResult<PinCodeJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return Pin.fromJson(_json);
    }

    async setPinCode(loginName: string | null, deviceId: string, code: Pin): Promise<boolean> {
        const uriPut = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'pin'
        );

        const json = JSON.stringify(Pin.toJson(code));

        const httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async getDynamicState(loginName: string | null, deviceId: string): Promise<DynamicState | null> {
        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'dynamicState'
        );

        const _json = this.getResult<DynamicStateJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return DynamicState.fromJson(_json);
    }

    async setAssociate(loginName: string | null, deviceId: string, associate: string): Promise<boolean> {
        const uriPut = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(loginName, 'loginName'),
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'associate'
        );

        const json = JSON.stringify({
            associate: AssertUtil.notNullOrEmpty(associate, 'associate'),
        });

        const httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async activateRemoteExtension(loginName: string | null, deviceId: string): Promise<boolean> {
        return this._doDeviceAction(loginName, deviceId, 'REActive', true);
    }

    async deactivateRemoteExtension(loginName: string | null, deviceId: string): Promise<boolean> {
        return this._doDeviceAction(loginName, deviceId, 'REActive', false);
    }
}

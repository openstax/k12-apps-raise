/* tslint:disable */
/* eslint-disable */
/**
 * RAISE Events API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface Response
 */
export interface Response {
}

/**
 * Check if a given object implements the Response interface.
 */
export function instanceOfResponse(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ResponseFromJSON(json: any): Response {
    return ResponseFromJSONTyped(json, false);
}

export function ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): Response {
    return json;
}

export function ResponseToJSON(value?: Response | null): any {
    return value;
}


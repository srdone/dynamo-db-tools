import { DynamoDB } from 'aws-sdk';
import * as https from 'https';

export const ATTRIBUTE_TYPES = {
    STRING: "S",
    NUMBER: "N",
    BINARY: "B",
    STRING_SET: "SS",
    NUMBER_SET: "NS",
    BINARY_SET: "BS",
    MAP: "M",
    LIST: "L",
    NULL: "NULL",
    BOOLEAN: "BOOL"
}

const attributeMappers = {
    [ATTRIBUTE_TYPES.STRING]: (val: any) => {
        if (typeof val === 'string') {
            return val;
        }
    },
    [ATTRIBUTE_TYPES.NUMBER]: (val: any) => {
        if (typeof val === 'number') {
            return val.toString();
        }
    },
    [ATTRIBUTE_TYPES.BINARY]: (val: any) => {
        if (typeof val === 'string') {
            return val;
        }
    },
    [ATTRIBUTE_TYPES.STRING_SET]: (val: any) => {
        if (val instanceof Array && val.every(v => typeof v === 'string')) {
            return val;
        }
    },
    [ATTRIBUTE_TYPES.NUMBER_SET]: (val: any) => {
        if (val instanceof Array && val.every(v => typeof v === 'number')) {
            return val.map(v => v.toString());
        }
    },
    [ATTRIBUTE_TYPES.BINARY_SET]: (val: any) => {
        if (val instanceof Array && val.every(v => typeof v === 'string')) {
            return val.toString();
        }
    },
    [ATTRIBUTE_TYPES.MAP]: (val: any) => {
        return val;
    },
    [ATTRIBUTE_TYPES.LIST]: (val: any) => {
        if (val instanceof Array) {
            return val;
        }
    },
    [ATTRIBUTE_TYPES.NULL]: (val: any) => {
        return true;
    },
    [ATTRIBUTE_TYPES.BOOLEAN]: (val: any) => {
        return !!val
    }
}

export function getDynamoDBInstance() {
    return new DynamoDB({
        httpOptions: {
            agent: new https.Agent({
                rejectUnauthorized: true,
                keepAlive: true
            })
        }
    })
}

export function toPromise<T, R, V>(func: (param: T, cb: (err: any, data: V) => void) => R, param: T) {
    return new Promise((resolve, reject) => {
        func(param, function (err, data) {
            if (err !== null) {
                return void reject(err);
            }
            resolve(data);
        })
    })
}

export function createSchemaMapper(schema: any) {
    return (obj: any) => {
        return Object.entries(obj).reduce((prev, [key, value]) => {
            if (schema[key]) {
                return Object.assign({}, prev, {
                    [key]: {
                        [schema[key]]: attributeMappers[schema[key]](value)
                    }
                })
            }
            return prev
        }, {})
    }
}



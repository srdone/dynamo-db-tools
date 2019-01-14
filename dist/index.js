"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const https = require("https");
exports.ATTRIBUTE_TYPES = {
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
};
const attributeMappers = {
    [exports.ATTRIBUTE_TYPES.STRING]: (val) => {
        if (typeof val === 'string') {
            return val;
        }
    },
    [exports.ATTRIBUTE_TYPES.NUMBER]: (val) => {
        if (typeof val === 'number') {
            return val.toString();
        }
    },
    [exports.ATTRIBUTE_TYPES.BINARY]: (val) => {
        if (typeof val === 'string') {
            return val;
        }
    },
    [exports.ATTRIBUTE_TYPES.STRING_SET]: (val) => {
        if (val instanceof Array && val.every(v => typeof v === 'string')) {
            return val;
        }
    },
    [exports.ATTRIBUTE_TYPES.NUMBER_SET]: (val) => {
        if (val instanceof Array && val.every(v => typeof v === 'number')) {
            return val.map(v => v.toString());
        }
    },
    [exports.ATTRIBUTE_TYPES.BINARY_SET]: (val) => {
        if (val instanceof Array && val.every(v => typeof v === 'string')) {
            return val.toString();
        }
    },
    [exports.ATTRIBUTE_TYPES.MAP]: (val) => {
        return val;
    },
    [exports.ATTRIBUTE_TYPES.LIST]: (val) => {
        if (val instanceof Array) {
            return val;
        }
    },
    [exports.ATTRIBUTE_TYPES.NULL]: (val) => {
        return true;
    },
    [exports.ATTRIBUTE_TYPES.BOOLEAN]: (val) => {
        return !!val;
    }
};
function getDynamoDBInstance() {
    return new aws_sdk_1.DynamoDB({
        httpOptions: {
            agent: new https.Agent({
                rejectUnauthorized: true,
                keepAlive: true
            })
        }
    });
}
exports.getDynamoDBInstance = getDynamoDBInstance;
function toPromise(func, param) {
    return new Promise((resolve, reject) => {
        func(param, function (err, data) {
            if (err !== null) {
                return void reject(err);
            }
            resolve(data);
        });
    });
}
exports.toPromise = toPromise;
function createSchemaMapper(schema) {
    return (obj) => {
        return Object.entries(obj).reduce((prev, [key, value]) => {
            const dataType = schema[key];
            if (dataType && !Object.values(exports.ATTRIBUTE_TYPES).includes(dataType) && obj[key]) {
                return Object.assign({}, prev, {
                    [key]: {
                        [exports.ATTRIBUTE_TYPES.MAP]: createSchemaMapper(schema[key])(obj[key])
                    }
                });
            }
            if (dataType) {
                return Object.assign({}, prev, {
                    [key]: {
                        [dataType]: attributeMappers[dataType](value)
                    }
                });
            }
            return prev;
        }, {});
    };
}
exports.createSchemaMapper = createSchemaMapper;

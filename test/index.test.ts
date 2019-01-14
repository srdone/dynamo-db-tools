import { expect } from 'chai';
import { createSchemaMapper, ATTRIBUTE_TYPES } from '../index';

describe('createSchemaMapper()', () => {

    it('should return a function', () => {
        expect(createSchemaMapper({})).to.be.a('function');
    });

    it('should take an object and map it to the defined schema structure for sending to DynamoDB', () => {
        const testObj = {
            name: 'Stephen',
            money: 100,
            friends: ['Ben', 'Tyler'],
            notInSchema: "Blah"
        }
        const schema = {
            name: ATTRIBUTE_TYPES.STRING,
            money: ATTRIBUTE_TYPES.NUMBER,
            friends: ATTRIBUTE_TYPES.STRING_SET
        }

        const expectedResult = {
            "name": {
                "S": 'Stephen'
            },
            "money": {
                "N": "100"
            },
            "friends": {
                "SS": ["Ben", "Tyler"]
            }
        }

        expect(createSchemaMapper(schema)(testObj)).to.eql(expectedResult);
    });

    it('should support nested schemas', () => {
        const testObj = {
            name: 'Stephen',
            money: 100,
            friends: ['Ben', 'Tyler'],
            mother: {
                name: 'Susan',
                age: 56,
                childAges: [25, 37]
            },
            notInSchema: "Blah"
        }
        const schema = {
            name: ATTRIBUTE_TYPES.STRING,
            money: ATTRIBUTE_TYPES.NUMBER,
            mother: {
                name: ATTRIBUTE_TYPES.STRING,
                age: ATTRIBUTE_TYPES.NUMBER,
                childAges: ATTRIBUTE_TYPES.NUMBER_SET
            },
            friends: ATTRIBUTE_TYPES.STRING_SET
        }

        const expectedResult = {
            "name": {
                "S": 'Stephen'
            },
            "mother": {
                "M": {
                    "name": {
                        "S": "Susan"
                    },
                    "age": {
                        "N": "56"
                    },
                    "childAges": {
                        "NS": ["25", "37"]
                    }
                }
            },
            "money": {
                "N": "100"
            },
            "friends": {
                "SS": ["Ben", "Tyler"]
            }
        }

        expect(createSchemaMapper(schema)(testObj)).to.eql(expectedResult);
    })

});
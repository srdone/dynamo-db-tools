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
                [ATTRIBUTE_TYPES.STRING]: 'Stephen'
            },
            "money": {
                [ATTRIBUTE_TYPES.NUMBER]: "100"
            },
            "friends": {
                [ATTRIBUTE_TYPES.STRING_SET]: ["Ben", "Tyler"]
            }
        }

        expect(createSchemaMapper(schema)(testObj)).to.eql(expectedResult);
    });

});
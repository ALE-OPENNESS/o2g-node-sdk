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

import { PbxAttributeMap } from "../../src/types/pbxmngt/pbx-attr-map";
import { PbxAttribute } from "../../src/types/pbxmngt/pbx-attribute";



describe('PbxAttribute', () => {
    describe('Primitive attributes', () => {
        it('should create a string attribute and get its value', () => {
            const attr = PbxAttribute.createString('Name', 'Alice');
            expect(attr.name).toBe('Name');
            expect(attr.asString()).toBe('Alice');
        });

        it('should create a boolean attribute and get its value', () => {
            const attr = PbxAttribute.createBoolean('Active', true);
            expect(attr.name).toBe('Active');
            expect(attr.asBoolean()).toBe(true);
        });

        it('should create an integer attribute and get its value', () => {
            const attr = PbxAttribute.createInteger('Age', 42);
            expect(attr.name).toBe('Age');
            expect(attr.asInteger()).toBe(42);
        });
    });

    describe('Set of strings', () => {
        it('should create a set of strings attribute', () => {
            const attr = PbxAttribute.createSetOfStrings('Tags', ['tag1', 'tag2']);
            expect(attr.name).toBe('Tags');
            expect(() => attr.asString()).toThrow(); // Corrected
        });
    });

    describe('Sequences and sets of sequences', () => {
        it('should create a sequence attribute and retrieve it', () => {
            const sequenceMap = new PbxAttributeMap();
            const nestedAttr = PbxAttribute.createInteger('Skill_Level', 2);
            sequenceMap.add(nestedAttr);

            const attr = PbxAttribute.createSequence('Skill', sequenceMap);
            expect(attr.name).toBe('Skill');
            expect(attr.asAttributeMap()).toBe(sequenceMap);
        });

        it('should create a set of sequences and retrieve items', () => {
            const seq1 = new PbxAttributeMap();
            seq1.add(PbxAttribute.createInteger('Skill_Nb', 1));
            const seq2 = new PbxAttributeMap();
            seq2.add(PbxAttribute.createInteger('Skill_Nb', 2));

            const attr = PbxAttribute.createSequenceSet('Skills', [seq1, seq2]);
            expect(attr.name).toBe('Skills');
            const list = attr.asListOfMaps();
            expect(list.length).toBe(2);
            expect(list[0].getAttribute('Skill_Nb')!.asInteger()).toBe(1);
            expect(list[1].getAttribute('Skill_Nb')!.asInteger()).toBe(2);
        });

        it('getAt should retrieve the correct sequence in a set', () => {
            const seq1 = new PbxAttributeMap();
            seq1.add(PbxAttribute.createInteger('Skill_Nb', 1));
            const seq2 = new PbxAttributeMap();
            seq2.add(PbxAttribute.createInteger('Skill_Nb', 2));

            const attr = PbxAttribute.createSequenceSet('Skills', [seq1, seq2]);
            const firstSeq = attr.getAt(0);
            expect(firstSeq.getAttribute('Skill_Nb')!.asInteger()).toBe(1);
        });
    });

    describe('Error handling', () => {
        it('asBoolean should throw for invalid value', () => {
            const attr = PbxAttribute.createString('InvalidBool', 'notabool');
            expect(() => attr.asBoolean()).toThrow();
        });

        it('asInteger should throw for invalid value', () => {
            const attr = PbxAttribute.createString('InvalidInt', 'abc');
            expect(() => attr.asInteger()).toThrow();
        });

        it('getAt should throw if attribute is not a set', () => {
            const attr = PbxAttribute.createString('Single', 'value');
            expect(() => attr.getAt(0)).toThrow();
        });

        it('asAttributeMap should throw if attribute is not a sequence', () => {
            const attr = PbxAttribute.createString('Single', 'value');
            expect(() => attr.asAttributeMap()).toThrow();
        });

        it('asListOfMaps should throw if attribute is not a sequence set', () => {
            const attr = PbxAttribute.createString('Single', 'value');
            expect(() => attr.asListOfMaps()).toThrow();
        });
    });
});
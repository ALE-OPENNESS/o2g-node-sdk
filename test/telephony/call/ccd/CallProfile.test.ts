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

import { CallProfile } from "../../../../src/types/telephony/call/ccd/call-profile";


describe('CallProfile', () => {

    describe('constructor', () => {

        it('should create an empty profile', () => {
            const profile = new CallProfile();
            expect(profile.skills).toHaveLength(0);
            expect(profile.skillNumbers.size).toBe(0);
        });

        it('should create profile using varargs', () => {
            const skill1 = new CallProfile.Skill(101, 3, true);
            const skill2 = new CallProfile.Skill(102, 2, false);

            const profile = new CallProfile(skill1, skill2);

            expect(profile.skills).toHaveLength(2);
            expect(profile.contains(101)).toBe(true);
            expect(profile.contains(102)).toBe(true);
        });

        it('should create profile from an array', () => {
            const skill1 = new CallProfile.Skill(201, 1, false);
            const skill2 = new CallProfile.Skill(202, 4, true);
            const skillsArray = [skill1, skill2];

            const profile = new CallProfile(skillsArray);

            expect(profile.skills).toHaveLength(2);
            expect(profile.contains(201)).toBe(true);
            expect(profile.contains(202)).toBe(true);
        });

        it('should ignore null/undefined skills in constructor', () => {
            const skill1 = new CallProfile.Skill(1, 1, false);
            const profile = new CallProfile(skill1, undefined as any, null as any);

            expect(profile.skills).toHaveLength(1);
            expect(profile.contains(1)).toBe(true);
        });

    });

    describe('get()', () => {

        it('should return the correct skill', () => {
            const skill = new CallProfile.Skill(300, 5, true);
            const profile = new CallProfile(skill);

            const result = profile.get(300);

            expect(result).toBeDefined();
            expect(result?.number).toBe(300);
            expect(result?.level).toBe(5);
            expect(result?.mandatory).toBe(true);
        });

        it('should return undefined if skill does not exist', () => {
            const profile = new CallProfile();
            expect(profile.get(999)).toBeUndefined();
        });

    });

    describe('contains()', () => {

        it('should return true if skill exists', () => {
            const profile = new CallProfile(new CallProfile.Skill(400, 2, false));
            expect(profile.contains(400)).toBe(true);
        });

        it('should return false if skill does not exist', () => {
            const profile = new CallProfile();
            expect(profile.contains(123)).toBe(false);
        });

    });

    describe('skillNumbers', () => {

        it('should return all skill numbers', () => {
            const profile = new CallProfile(
                new CallProfile.Skill(1, 1, false),
                new CallProfile.Skill(2, 2, false)
            );

            const numbers = profile.skillNumbers;

            expect(numbers.has(1)).toBe(true);
            expect(numbers.has(2)).toBe(true);
            expect(numbers.size).toBe(2);
        });

        it('should not allow modification of returned set to affect profile', () => {
            const profile = new CallProfile(new CallProfile.Skill(10, 1, false));
            const numbers = profile.skillNumbers as Set<number>;
            numbers.add(99);

            expect(profile.contains(99)).toBe(false);
        });

    });

    describe('skills', () => {

        it('should return all skills', () => {
            const s1 = new CallProfile.Skill(10, 1, false);
            const s2 = new CallProfile.Skill(20, 2, true);

            const profile = new CallProfile(s1, s2);
            const skills = profile.skills;

            expect(skills).toHaveLength(2);
            expect(skills.map(s => s.number)).toEqual(expect.arrayContaining([10, 20]));
        });

        it('should not allow modification of returned array to affect profile', () => {
            const profile = new CallProfile(new CallProfile.Skill(50, 1, false));
            const skills = profile.skills as CallProfile.Skill[];
            skills.push(new CallProfile.Skill(99, 9, true));

            expect(profile.contains(99)).toBe(false);
        });

    });

});
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

import { AgentSkill } from "../../src/types/cc-agent/agent-skill";
import { AgentSkillSet } from "../../src/types/cc-agent/agent-skill-set";


describe("AgentSkillSet", () => {
    let skillSet: AgentSkillSet;

    beforeEach(() => {

        const jsonString = `[ 
            { "number": 1, "level": 3, "active": true },
            { "number": 2, "level": 2, "active": true }
        ]`;

        skillSet = AgentSkillSet.fromJson(JSON.parse(jsonString));
    });

    test("fromJson creates a skill set from JSON", () => {
        expect(skillSet).toBeInstanceOf(AgentSkillSet);
        expect(skillSet.skillsNumbers).toEqual(new Set([1, 2]));
        expect(skillSet.skills.length).toBe(2);
    });


    test("get() returns the correct AgentSkill", () => {
        const skill1 = skillSet.get(1);
        const skill2 = skillSet.get(2);
        const skill3 = skillSet.get(99); // nonexistent

        expect(skill1).toBeInstanceOf(AgentSkill);
        expect(skill1?.number).toBe(1);
        expect(skill2?.number).toBe(2);
        expect(skill3).toBeNull();
    });

    test("contains() correctly checks for skill existence", () => {
        expect(skillSet.contains(1)).toBe(true);
        expect(skillSet.contains(2)).toBe(true);
        expect(skillSet.contains(99)).toBe(false);
    });

    test("getSkillsNumbers() returns all skill numbers", () => {
        const numbers = skillSet.skillsNumbers;
        expect(numbers).toEqual(new Set([1, 2]));
    });

    test("getSkills() returns all AgentSkill instances", () => {
        const skills = skillSet.skills;
        expect(skills.length).toBe(2);
        expect(skills.every((s) => s instanceof AgentSkill)).toBe(true);
    });

    test("fromJson handles empty array", () => {
        const emptySet = AgentSkillSet.fromJson([]);
        expect(emptySet.skills.length).toBe(0);
        expect(emptySet.skillsNumbers.size).toBe(0);
    });
});
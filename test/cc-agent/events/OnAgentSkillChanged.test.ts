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

import { AgentSkill } from "../../../src/types/cc-agent/agent-skill";
import { AgentSkillSet } from "../../../src/types/cc-agent/agent-skill-set";
import { OnAgentSkillChanged } from "../../../src/types/cc-agent/cc-agent-events";



describe("OnAgentSkillChanged", () => {

    const jsonString = `{
        "loginName": "agent007",
        "skills": [ 
            { "number": 1, "level": 3, "active": true },
            { "number": 2, "level": 2, "active": false }
        ]
    }`;

    it("should create an instance from JSON", () => {
        const event = OnAgentSkillChanged.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnAgentSkillChanged);
        expect(event.loginName).toBe("agent007");
        expect(event.skills).toBeInstanceOf(AgentSkillSet);

        // Check that the skills are correctly parsed
        const skillsArray = event.skills.skills;
        expect(skillsArray.length).toBe(2);
        expect(skillsArray[0]).toBeInstanceOf(AgentSkill);
        expect(skillsArray[0].number).toBe(1);
        expect(skillsArray[0].level).toBe(3);
        expect(skillsArray[0].active).toBe(true);
        expect(skillsArray[1].number).toBe(2);
        expect(skillsArray[1].level).toBe(2);
        expect(skillsArray[1].active).toBe(false);
    });

    it("should handle empty skills array", () => {
        const jsonWithNoSkills = { loginName: "agentX", skills: [] };
        const event = OnAgentSkillChanged.fromJson(jsonWithNoSkills);

        expect(event.loginName).toBe("agentX");
        expect(event.skills.skills.length).toBe(0);
    });

    it("should handle missing skills field", () => {
        const jsonWithoutSkills = { loginName: "agentY" } as any;
        const event = OnAgentSkillChanged.fromJson(jsonWithoutSkills);

        expect(event.loginName).toBe("agentY");
        expect(event.skills.skills.length).toBe(0);
    });
});
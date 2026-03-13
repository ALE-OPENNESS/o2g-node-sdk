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

import { AgentGroups } from "../../src/types/cc-agent/agent-groups";
import { AgentSkillSet } from "../../src/types/cc-agent/agent-skill-set";
import { OperatorConfig } from "../../src/types/cc-agent/operator-config";
import { OperatorType } from "../../src/types/cc-agent/operator-type";


describe("OperatorConfig", () => {

    const jsonString = `{
        "type": "AGENT",
        "proacd": "23000",
        "processingGroups": { "preferred": "33000", "groups": ["33000", "33001"] },
        "skills": {
            "skills": [ 
                { "number": 1, "level": 3, "active": true },
                { "number": 2, "level": 2, "active": false }
            ]
        },
        "selfAssign": true,
        "headset": false,
        "help": true,
        "multiline": true
    }`;

    // -------------------------------------------------
    // Happy path
    // -------------------------------------------------
    it("should correctly create an instance from JSON", () => {

        const config = OperatorConfig.fromJson(JSON.parse(jsonString));

        // Type + basic
        expect(config.type).toBe(OperatorType.AGENT);
        expect(config.proacd).toBe("23000");

        // Processing groups
        expect(config.processingGroups).toBeInstanceOf(AgentGroups);
        expect(config.processingGroups!.preferred).toBe("33000");
        expect(config.processingGroups!.groups).toEqual(["33000", "33001"]);

        // Skills
        expect(config.skills).toBeInstanceOf(AgentSkillSet);

        const skillNumbers = config.skills!.skillsNumbers;
        expect(skillNumbers.has(1)).toBe(true);
        expect(skillNumbers.has(2)).toBe(true);
        expect(skillNumbers.size).toBe(2);

        // Boolean flags
        expect(config.selfAssign).toBe(true);
        expect(config.headset).toBe(false);
        expect(config.help).toBe(true);
        expect(config.multiline).toBe(true);
    });

    // -------------------------------------------------
    // Empty skills
    // -------------------------------------------------
    it("should handle empty skills array", () => {

        const jsonWithNoSkills = {
            ...JSON.parse(jsonString),
            skills: { skills: [] }
        };

        const config = OperatorConfig.fromJson(jsonWithNoSkills);

        expect(config.skills).toBeInstanceOf(AgentSkillSet);
        expect(config.skills!.skillsNumbers.size).toBe(0);
    });

    // -------------------------------------------------
    // Missing optional properties
    // -------------------------------------------------
    it("should return null for optional objects if not provided", () => {

        const minimalJson = {
            type: OperatorType.AGENT
        };

        const config = OperatorConfig.fromJson(minimalJson as any);

        expect(config.proacd).toBeNull();
        expect(config.processingGroups).toBeNull();
        expect(config.skills).toBeNull();
    });

    // -------------------------------------------------
    // Default boolean fallback
    // -------------------------------------------------
    it("should default boolean flags to false if undefined", () => {

        const minimalJson = {
            type: OperatorType.AGENT
        };

        const config = OperatorConfig.fromJson(minimalJson as any);

        expect(config.selfAssign).toBe(false);
        expect(config.headset).toBe(false);
        expect(config.help).toBe(false);
        expect(config.multiline).toBe(false);
    });

    // -------------------------------------------------
    // Supervisor type
    // -------------------------------------------------
    it("should support SUPERVISOR type", () => {

        const supervisorJson = {
            ...JSON.parse(jsonString),
            type: OperatorType.SUPERVISOR
        };

        const config = OperatorConfig.fromJson(supervisorJson);

        expect(config.type).toBe(OperatorType.SUPERVISOR);
    });

    // -------------------------------------------------
    // Null nested structures
    // -------------------------------------------------
    it("should handle null processingGroups and skills", () => {

        const json = {
            type: OperatorType.AGENT,
            processingGroups: null,
            skills: null
        };

        const config = OperatorConfig.fromJson(json as any);

        expect(config.processingGroups).toBeNull();
        expect(config.skills).toBeNull();
    });

});
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculations_1 = require("../calculations");
const types_1 = require("../../native-app/data/types");
describe('calculatePartHealth', () => {
    it('calculates part health correctly', () => {
        const machineName = types_1.MachineType.WeldingRobot;
        const part = { name: types_1.WeldingRobotPart.ErrorRate, value: 0.5 };
        const expectedHealth = 72.22222222222223;
        const result = (0, calculations_1.calculatePartHealth)(machineName, part);
        expect(result).toBe(expectedHealth);
    });
});
describe('calculateMachineHealth', () => {
    it('calculates machine health correctly', () => {
        const machineName = types_1.MachineType.WeldingRobot;
        const parts = [
            { name: types_1.WeldingRobotPart.ErrorRate, value: 0.5 },
            { name: types_1.WeldingRobotPart.VibrationLevel, value: 4.0 },
            { name: types_1.WeldingRobotPart.ElectrodeWear, value: 0.8 },
            { name: types_1.WeldingRobotPart.ShieldingPressure, value: 12.0 },
            { name: types_1.WeldingRobotPart.WireFeedRate, value: 7.5 },
            { name: types_1.WeldingRobotPart.ArcStability, value: 92.0 },
            { name: types_1.WeldingRobotPart.SeamWidth, value: 1.5 },
            { name: types_1.WeldingRobotPart.CoolingEfficiency, value: 85.0 },
        ];
        const expectedHealth = 76.70138888888889;
        const result = (0, calculations_1.calculateMachineHealth)(machineName, parts);
        expect(result).toBe(expectedHealth);
    });
});

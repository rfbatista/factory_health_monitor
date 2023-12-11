"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.machineNames = exports.QualityControlStationPart = exports.AssemblyLinePart = exports.PaintingStationPart = exports.WeldingRobotPart = exports.MachineType = void 0;
var MachineType;
(function (MachineType) {
    MachineType["WeldingRobot"] = "weldingRobot";
    MachineType["PaintingStation"] = "paintingStation";
    MachineType["AssemblyLine"] = "assemblyLine";
    MachineType["QualityControlStation"] = "qualityControlStation";
})(MachineType || (exports.MachineType = MachineType = {}));
// Enum for Welding Robot part names
var WeldingRobotPart;
(function (WeldingRobotPart) {
    WeldingRobotPart["ErrorRate"] = "errorRate";
    WeldingRobotPart["VibrationLevel"] = "vibrationLevel";
    WeldingRobotPart["ElectrodeWear"] = "electrodeWear";
    WeldingRobotPart["ShieldingPressure"] = "shieldingPressure";
    WeldingRobotPart["WireFeedRate"] = "wireFeedRate";
    WeldingRobotPart["ArcStability"] = "arcStability";
    WeldingRobotPart["SeamWidth"] = "seamWidth";
    WeldingRobotPart["CoolingEfficiency"] = "coolingEfficiency";
})(WeldingRobotPart || (exports.WeldingRobotPart = WeldingRobotPart = {}));
// Enum for Painting Station part names
var PaintingStationPart;
(function (PaintingStationPart) {
    PaintingStationPart["FlowRate"] = "flowRate";
    PaintingStationPart["Pressure"] = "pressure";
    PaintingStationPart["ColorConsistency"] = "colorConsistency";
    PaintingStationPart["NozzleCondition"] = "nozzleCondition";
})(PaintingStationPart || (exports.PaintingStationPart = PaintingStationPart = {}));
// Enum for Assembly Line part names
var AssemblyLinePart;
(function (AssemblyLinePart) {
    AssemblyLinePart["AlignmentAccuracy"] = "alignmentAccuracy";
    AssemblyLinePart["Speed"] = "speed";
    AssemblyLinePart["FittingTolerance"] = "fittingTolerance";
    AssemblyLinePart["BeltSpeed"] = "beltSpeed";
})(AssemblyLinePart || (exports.AssemblyLinePart = AssemblyLinePart = {}));
// Enum for Quality Control Station part names
var QualityControlStationPart;
(function (QualityControlStationPart) {
    QualityControlStationPart["CameraCalibration"] = "cameraCalibration";
    QualityControlStationPart["LightIntensity"] = "lightIntensity";
    QualityControlStationPart["SoftwareVersion"] = "softwareVersion";
    QualityControlStationPart["CriteriaSettings"] = "criteriaSettings";
})(QualityControlStationPart || (exports.QualityControlStationPart = QualityControlStationPart = {}));
//Machine enum value to name mapping
exports.machineNames = {
    [MachineType.WeldingRobot]: 'Welding Robot',
    [MachineType.PaintingStation]: 'Painting Station',
    [MachineType.AssemblyLine]: 'Assembly Line',
    [MachineType.QualityControlStation]: 'Quality Control Station',
};

import React, { useCallback, useState } from "react";
import { Button, Platform, StyleSheet, TextInput } from "react-native";

import { Text, View } from "./Themed";
import { MachineType } from "../data/types";
import { useMachineData } from "../app/useMachineData";
import { useFocusEffect } from "expo-router";
import Picker from "./Picker";
import useAxios from "../infrastructure/httpClient";
import { MachineDataLog } from "../entities/machine";

export default function EditScreenInfo({ path }: { path: string }) {
  const [machineName, setMachineName] = useState("");
  const [partName, setPartName] = useState("");
  const [partValue, setPartValue] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const axiosInstance = useAxios();
  const { machineData, updateMachineData, loadMachineData } = useMachineData();

  const machineNames = [
    { label: "Welding Robot", value: MachineType.WeldingRobot },
    { label: "PaintingStation", value: MachineType.PaintingStation },
    { label: "Assembly Line", value: MachineType.AssemblyLine },
    {
      label: "Quality Control Station",
      value: MachineType.QualityControlStation,
    },
  ];

  const partNames = [
    { value: "arcStability", label: "Arc Stability" },
    {
      value: "coolingEfficiency",
      label: "Cooling Efficiency",
    },
    { value: "electrodeWear", label: "Electrode Wear" },
    { value: "seamWidth", label: "Seam Width" },
    {
      value: "shieldingPressure",
      label: "Shielding Pressure",
    },
    { value: "vibrationLevel", label: "Vibration Level" },
    { value: "wireFeedRate", label: "Wire Feed Rate" },
    {
      value: "colorConsistency",
      label: "Color Consistency",
    },
    { value: "flowRate", label: "Flow Rate" },
    {
      value: "nozzleCondition",
      label: "Nozzle Condition",
    },
    { value: "pressure", label: "Pressure" },
    {
      value: "alignmentAccuracy",
      label: "Alignment Accuracy",
    },
    { value: "beltSpeed", label: "Belt Speed" },
    {
      value: "fittingTolerance",
      label: "Fitting Tolerance",
    },
    { value: "speed", label: "Speed" },
    {
      value: "cameraCalibration",
      label: "Camera Calibration",
    },
    {
      value: "criteriaSettings",
      label: "Criteria Settings",
    },
    {
      value: "lightIntensity",
      label: "Light Intensity",
    },
    {
      value: "softwareVersion",
      label: "Software Version",
    },
  ];

  const savePart = useCallback(async () => {
    try {
      const payload = MachineDataLog.create({
        machineName,
        partName,
        value: Number(partValue),
      });
      const res = await axiosInstance.post(
        "/api/v1/machine/log",
        payload.toDto(),
      );
      console.log(res.data);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (error) {
      console.error(error.response.data);
    }
  }, [machineData, updateMachineData, machineName, partName, partValue]);

  //Doing this because we're not using central state like redux
  useFocusEffect(
    useCallback(() => {
      loadMachineData();
    }, []),
  );

  return (
    <View>
      <Text style={styles.label}>Machine Name</Text>
      <Picker
        value={machineName}
        onSetValue={setMachineName}
        items={machineNames}
      />

      <Text style={styles.label}>Part Name</Text>
      <Picker value={partName} onSetValue={setPartName} items={partNames} />

      <Text style={styles.label}>Part Value</Text>
      <TextInput
        style={styles.input}
        value={partValue}
        onChangeText={(text) => setPartValue(text)}
        placeholder="Enter part value"
      />

      <Button title="Save" onPress={savePart} />

      {isSaved && <Text style={styles.healthScore}>Saved ✔️</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  healthScore: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
});

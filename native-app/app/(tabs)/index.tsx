import { Link, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Button, StyleSheet } from "react-native";
import { MachineScore } from "../../components/MachineScore";
import { PartsOfMachine } from "../../components/PartsOfMachine";
import { Text, View } from "../../components/Themed";
import useAxios from "../../infrastructure/httpClient";
import { useSession } from "../../shared/context";
import { useMachineData } from "../useMachineData";

export default function StateScreen() {
  const axiosClient = useAxios();
  const { machineData, resetMachineData, setScores } =
    useMachineData();
  const { signOut } = useSession();

  //Doing this because we're not using central state like redux
  /* useFocusEffect( */
  /*   useCallback(() => { */
  /*     loadMachineData(); */
  /*   }, []), */
  /* ); */

  const calculateHealth = useCallback(async () => {
    try {
      console.log(machineData)
      const response = await axiosClient.post('/api/v1/machine/health', {
        machines: machineData?.machines,
      });

      if (response.data?.factory) {
        setScores(response.data);
      }
    } catch (error) {
      console.error(error);
      console.log(
        `There was an error calculating health. ${
          error.toString() === "AxiosError: Network Error"
            ? "Is the api server started?"
            : error
        }`,
      );
    }
  }, [machineData]);

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      {!machineData && (
        <Link href="/two" style={styles.link}>
          <Text style={styles.linkText}>
            Please log a part to check machine health
          </Text>
        </Link>
      )}
      {machineData && (
        <>
          <PartsOfMachine
            machineName={"Welding Robot"}
            parts={machineData?.machines?.weldingRobot}
          />
          <PartsOfMachine
            machineName={"Assembly Line"}
            parts={machineData?.machines?.assemblyLine}
          />
          <PartsOfMachine
            machineName={"Painting Station"}
            parts={machineData?.machines?.paintingStation}
          />
          <PartsOfMachine
            machineName={"Quality Control Station"}
            parts={machineData?.machines?.qualityControlStation}
          />
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <Text style={styles.title}>Factory Health Score</Text>
          <Text style={styles.text}>
            {machineData?.scores?.factory
              ? machineData?.scores?.factory
              : "Not yet calculated"}
          </Text>
          {machineData?.scores?.machineScores && (
            <>
              <Text style={styles.title2}>Machine Health Scores</Text>
              {Object.keys(machineData?.scores?.machineScores).map((key) => (
                <MachineScore
                  key={key}
                  machineName={key}
                  score={machineData?.scores?.machineScores[key]}
                />
              ))}
            </>
          )}
        </>
      )}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button title="Calculate Health" onPress={calculateHealth} />
      <View style={styles.resetButton}>
        <Button
          title="Reset Machine Data"
          onPress={async () => await resetMachineData()}
          color="#FF0000"
        />
      </View>
      <Button title="Signout" onPress={() => signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 17,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
  text: {},
  link: {
    paddingBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  resetButton: {
    marginTop: 10,
  },
});

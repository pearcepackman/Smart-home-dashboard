import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { LineChart } from 'react-native-chart-kit';



type SensorData = {
  temperature: number;
  humidity: number;
  air_quality: number;
  motion: number;
  light: string;
};

export default function HomeScreen() {
  const [data, setData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);


  useEffect(() => {
    const fetchData = async () => {
  try {
    const [latestRes, historyRes] = await Promise.all([
      fetch("http://10.0.0.45:3000/latest"),
      fetch("http://10.0.0.45:3000/history")
    ]);

    const latestJson = await latestRes.json();
    const historyJson: SensorData[] = await historyRes.json();

    setData(latestJson);
    setHistory(historyJson);
  } catch (err) {
    console.error("ERROR: ", err);
  }
};


    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  
  const sensorArray = data
  ? [
      {
        title: "Temperature",
        value: `${data.temperature}°`,
        data: history.map(h => h.temperature),
        suffix: "°"
      },
      {
        title: "Humidity",
        value: `${data.humidity}%`,
        data: history.map(h => h.humidity),
        suffix: "%"
      },
      {
        title: "Air Quality",
        value: `${data.air_quality}`,
        data: history.map(h => h.air_quality),
        suffix: ""
      },
      {
        title: "Light",
        value: `${data.light}`,
        data: history.map(h => {
          const val = parseInt(h.light);
          return isNaN(val) ? 0 : val; // replace NaN with 0
        }),
        suffix: ""
      },

      {
        title: "Motion",
        value: data.motion === 1 ? "Detected" : "None",
        data: history.map(h => h.motion),
        suffix: ""
      },
    ]
  : [];


  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Hello, <Text style={styles.name}>Pearce</Text>
      </Text>
      <Text style={styles.dashboardtitle}>Dashboard</Text>

      {data ? (
        <FlatList
        
          data={sensorArray}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.graphcontainer}
          renderItem={({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardValue}>{item.value}</Text>

    {item.data.length > 1 && (
      <LineChart
        data={{
          labels: [],
          datasets: [{ data: item.data.slice(-15) }], // last 15 points
        }}
        width={140}          // make it fit inside the card
        height={80}
        yAxisSuffix={item.suffix}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={false}
        withHorizontalLabels={false}
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: () => "#0077b6",
          propsForBackgroundLines: {
            stroke: "#e0e0e0",
          },
        }}
        style={{
          marginTop: 10,
          borderRadius: 8,
        }}
      />
    )}
  </View>
)}

        />
      ) : (
        <Text>Loading sensor data...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingTop: 50,
    backgroundColor: "#f4f6f8",
    flex: 1,
  },
  header: {
    fontSize: 40,
    fontWeight: "500",
    paddingLeft: 10,
  },
  name: {
    fontSize: 40,
    fontWeight: "800",
    marginLeft: 10,
  },
  dashboardtitle: {
    fontSize: 32,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 2,
    paddingLeft: 18,
  },
  graphcontainer: {
    paddingBottom: 40,
    gap: 5,
  },
  card: {
    backgroundColor: "#ffffff",
    flex: 1,
    margin: 8,
    borderRadius: 12,
    padding: 16,
    minWidth: "45%",
    height: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212529",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0077b6",
    marginTop: 8,
  },
});

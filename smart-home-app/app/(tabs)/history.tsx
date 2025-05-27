import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { LineChart } from 'react-native-chart-kit';


//Setting the type of each type of data i'm getting
type SensorData = {
  temperature: number;
  humidity: number;
  air_quality: number;
  motion: number;
  light: string;
};
//downsample helps to compress the data, allowing it to be shown easily
const downsample = (arr: number[], maxPoints: number = 150) => {
  if (arr.length <= maxPoints) return arr;
  const step = Math.floor(arr.length / maxPoints);
  return arr.filter((_, i) => i % step === 0);
};
//rollingAverage helps to smooth the data, makes trends easier to see
const rollingAverage = (arr: number[], windowSize: number = 5) => {
  return arr.map((_, i) => {
    const start = Math.max(0, i - windowSize + 1);
    const window = arr.slice(start, i + 1);
    const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
    return avg;
  });
};

export default function HomeScreen() {
  const [data, setData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);

  //Fetching data from history
  useEffect(() => {
    const fetchData = async () => {
  try {
    const [latestRes, historyRes] = await Promise.all([
      fetch("http://10.0.0.45:3000/latest"),
      fetch("http://10.0.0.45:3000/history?limit=3600") //Getting the last hour of info
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

  
  const smoothed = rollingAverage(history.map(h => h.temperature), 5);
  const avgSmoothed = smoothed.reduce((acc, val) => acc + val, 0) / smoothed.length;

  const sensorArray = data
  ? [
      {
        title: "Temperature",
        value: `${data.temperature}°`,
        data: downsample(rollingAverage(history.map(h => h.temperature), 60), 150),
        average: (() => { //Calculating an average here, makes the data easier to look at
          const arr = rollingAverage(history.map(h => h.temperature), 60);
          return arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : "N/A";
        })(),
        suffix: "°"
      },
      {
        title: "Humidity",
        value: `${data.humidity}%`,
        data: downsample(rollingAverage(history.map(h => h.humidity), 60), 150),
        average: (() => {
          const arr = rollingAverage(history.map(h => h.humidity), 60);
          return arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : "N/A";
        })(),
        suffix: "%"
      },
      {
        title: "Air Quality",
        value: `${data.air_quality}`,
        data: downsample(rollingAverage(history.map(h => h.air_quality), 60), 150),
        average: (() => {
          const arr = rollingAverage(history.map(h => h.air_quality), 60);
          return arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : "N/A";
        })(),
        suffix: ""
      },
      {
        title: "Light",
        value: data.light === "light" ? "Light" : "Dark",
        data: downsample(rollingAverage(history.map(h => {
          const val = h.light?.toLowerCase();
          return val === "light" ? 1 : 0;
        }), 60), 150),
        average: (() => {
          const arr = rollingAverage(history.map(h => {
            const val = h.light?.toLowerCase();
            return val === "light" ? 1 : 0;
          }), 60);
          return arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : "N/A";
        })(),
        suffix: ""
      },
      {
        title: "Motion",
        value: data.motion === 1 ? "Detected" : "None",
        data: downsample(rollingAverage(history.map(h => h.motion), 60), 150),
        average: (() => {
          const arr = rollingAverage(history.map(h => h.motion), 60);
          return arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : "N/A";
        })(),
        suffix: ""
      },
    ]
  : [];


  


  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Hello, <Text style={styles.name}>Pearce</Text>
      </Text>
      <Text style={styles.dashboardtitle}>History - Bedroom</Text>

      {data ? (
        <FlatList
        
          data={sensorArray}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
          contentContainerStyle={styles.graphcontainer}
          renderItem={({ item }) => (
            
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Average {item.title} (60 Min)</Text>
    <Text style={styles.cardValue}>{item.average}{item.suffix}</Text>

    {item.data.length > 1 && (
      <LineChart
        data={{
          labels: [],
          datasets: [{ data: item.data.slice(-300) }], //Getting the last 300 pieces to show
        }}
        width={330} 
        height={215}
        bezier
        yAxisSuffix={item.suffix}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={false}
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: () => "#0077b6",
          propsForBackgroundLines: {
            stroke: "#e0e0e0",
            paddingRight: 0,
          },
        }}
        style={{
          marginTop: 10,
          borderRadius: 8,
          alignSelf: "center",
          overflow: "hidden",
          paddingRight: 0,
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
//Style information
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
    minWidth: "80%",
    height: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#212529",
  },
  cardValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0077b6",
    marginTop: 8,
  },
});

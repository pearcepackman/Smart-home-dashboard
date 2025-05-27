import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { LineChart } from 'react-native-chart-kit';


//Setting the type of each type of data that's being recieved
type SensorData = {
  temperature: number;
  humidity: number;
  air_quality: number;
  motion: number;
  light: string;
};

//downsample helps to compress the data, allowing it to be shown easily
//reduces number of data points
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
  //Fetching the data from the server
  useEffect(() => {
    const fetchData = async () => {
  try {
    const [latestRes, historyRes] = await Promise.all([
      fetch("http://10.0.0.45:3000/latest"),
      fetch("http://10.0.0.45:3000/history?limit=60")
    ]);
    //Parsing the JSON
    const latestJson = await latestRes.json();
    const historyJson: SensorData[] = await historyRes.json();
    //Updates the state variables with data
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

  //Creating array of sensor objects
  const sensorArray = data
  ? [
      {//Each object keeps information about the sensor's data
        title: "Temperature",
        value: `${data.temperature}°`,
        //Downsample and rollingAverage are applied to smooth and ease data
        data: downsample(rollingAverage(history.map(h => h.temperature), 5), 60),
        suffix: "°"
      },
      {
        title: "Humidity",
        value: `${data.humidity}%`,
        data: downsample(rollingAverage(history.map(h => h.humidity), 5), 60),
        suffix: "%"
      },
      {
        title: "Air Quality",
        value: `${data.air_quality}`,
        data: downsample(rollingAverage(history.map(h => h.air_quality), 5), 60),
        suffix: ""
      },
      {
        title: "Light",
        value:  data.light === "light" ? "Light" : "Dark", //Converts light to either 1 or 0
        data: history.map(h => {
          const val = h.light?.toLowerCase();
          return val === "light" ? 1 : 0; // replace NaN with 0
        }),
        suffix: ""
      },

      {
        title: "Motion",
        value: data.motion === 1 ? "Detected" : "None",
        data: downsample(rollingAverage(history.map(h => h.motion), 5), 60),
        suffix: ""
      },
    ]
  : [];

  


  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Hello, <Text style={styles.name}>Pearce</Text>
      </Text>
      <Text style={styles.dashboardtitle}>Overview - Bedroom</Text>

      {data ? (
        <FlatList
          //Flatlist was easiest to use for the tiles here
          data={sensorArray}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.graphcontainer}
          renderItem={({ item }) => (
  //Creating the cards/tiles
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardValue}>{item.value}</Text>

    {item.data.length > 1 && (
      //Line chart is created to fit inside of the cards
      <LineChart
        data={{
          labels: [],
          datasets: [{ data: item.data.slice(-60) }], //get last 60 entries on homepage
        }}
        width={140}
        height={115}
        bezier
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

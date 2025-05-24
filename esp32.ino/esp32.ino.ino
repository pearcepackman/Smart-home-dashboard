#include <ArduinoJson.h> //include library for json
#include "DHT.h" //include library for temp sensor

//defining which pins do what
#define LIGHT_SENSOR_PIN 5
#define DHTPIN 4
#define DHTTYPE DHT11
#define MOTION_PIN 19
#define BUZZER_PIN 23
#define MQ135_PIN 34

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // setting pins to do things and beginning collection
  pinMode(LIGHT_SENSOR_PIN, INPUT);
  pinMode(MOTION_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(115200);
  delay(2000);
  dht.begin();
}

void loop() {
  // reading and writing data values, some logic too
  float temp = dht.readTemperature(true);
  float hum = dht.readHumidity();
  int lightState = digitalRead(LIGHT_SENSOR_PIN);
  int motion = digitalRead(MOTION_PIN);
  int airValue = analogRead(MQ135_PIN);
  /*if(motion == HIGH) {
    Serial.println("Motion Detected, BUZZER!");
    //digitalWrite(BUZZER_PIN, HIGH);
  }
  else{
    Serial.println("No Motion.");
    //digitalWrite(BUZZER_PIN, LOW);
  }
  Serial.println(lightState == LOW ? "Light Detected" : "Darkness Detected");
  Serial.print("Air Quality: ");
  Serial.println(airValue);
  Serial.print("Temp: ");
  Serial.println(temp);
  Serial.print("Humidity: ");
  Serial.println(hum);
  Serial.println("\n");*/

  StaticJsonDocument<200> doc;
  doc["temperature"] = temp;
  doc["humidity"] = hum;
  doc["air_quality"] = airValue;
  doc["motion"] = motion;
  doc["light"] = lightState == LOW ? "light" : "dark";

  String output;
  serializeJson(doc, output);
  Serial.println(output);

  // delay of one second i believe
  delay(1000);
}

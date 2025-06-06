import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        //tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            marginBottom: 0,
            paddingTop: 5,
            fontSize: 10,
          },
          default: {},
        }),
      }}>
      

      <Tabs.Screen
        name="index"
        options={{
          title:"Overview",
          tabBarIcon: ({ color, focused }) => (
          <IconSymbol 
          size={35} 
          name = {focused ? "house.fill" : "house"} 
          color = {color}
          />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
            marginTop: 3,
          },
          tabBarStyle: {
            backgroundColor: "#ffffff",
            
          }
        }}
        />
        

        <Tabs.Screen
        name="history"
        options={{
          title:"History",
          tabBarIcon: ({ color, focused }) => (
          <IconSymbol 
          size={35} 
          name = {focused ? "chart.bar.fill" : "chart.bar"} 
          color = {color}
          />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
            marginTop: 3,
          },
          tabBarStyle: {
            backgroundColor: "#ffffff",
            
          }
        }}
        />
    </Tabs>
  );
}

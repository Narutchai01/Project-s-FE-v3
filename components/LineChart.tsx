import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

interface LineChartComponentProps {
  title: string;
  data: any;
}

const fixedColors = [
  "#A685E2",
  "#4169E1",
  "#1E90FF", 
  "#2F4F4F",
  "#4B3869", 
  "#6D5B95", 
];

export default function LineChartComponent({ title, data }: LineChartComponentProps) {
  const screenWidth = Dimensions.get("window").width - 80;

  const legends: string[] = Array.from(new Set(data?.legend || []));
  const half = Math.ceil(legends.length / 2);
  const firstRow = legends.slice(0, half);
  const secondRow = legends.slice(half);

  return (
    <View className="bg-white shadow-md p-4 rounded-xl mb-6 w-full max-w-md mx-auto flex items-center justify-center">
      
      {data?.datasets?.[0]?.data?.length > 0 ? (
        <LineChart
          data={{ 
            ...data, 
            legend: legends, 
            datasets: data.datasets.map((dataset: any, index: number) => ({
              ...dataset,
              color: () => fixedColors[index % fixedColors.length], 
            }))
          }}
          width={screenWidth}
          height={200}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
        />
      ) : (
        <Text className="text-center text-gray-500">No Data Available</Text>
      )}

      <View className="mt-4">
        {[firstRow, secondRow].map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-center w-full mb-1">
            {row.map((legend: string, index: number) => (
              <View key={index} className="flex-row items-center m-1 w-1/3">
                <View
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: fixedColors[index + (rowIndex * half)] }}
                />
                <Text>{legend}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

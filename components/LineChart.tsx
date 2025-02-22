import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface Genre {
  label: string;
  data: number[];
}

interface LineChartProps {
  title: string;
  labels: string[];
  genres: Genre[];
}

export default function LineChartComponent({ title, labels, genres }: LineChartProps) {
  const screenWidth: number = Dimensions.get("window").width - 10;
  const chartWidth: number = screenWidth;

  const legends: string[] = genres.map((genre) => genre.label);
  const half: number = Math.ceil(legends.length / 2);
  const firstRow: string[] = legends.slice(0, half);
  const secondRow: string[] = legends.slice(half);

  const fixedColors: string[] = [
    "#A685E2", "#4169E1", "#1E90FF", "#2F4F4F", "#4B3869", "#6D5B95",
  ];

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForLabels: { fontSize: 11, fontWeight: "bold" },
    strokeWidth: 3,
    barPercentage: 5,
  };

  return (
    <View className="bg-white shadow-md p-4 rounded-xl mb-10 w-full max-w-md mx-auto flex items-center justify-center">
      <Text className="text-Heading3 font-bold text-center mb-6 mt-2">{title}</Text>

      <View className="w-full items-center overflow-hidden">
        {genres.length > 0 && genres[0].data.length > 0 ? (
          <LineChart
            data={{
              labels,
              datasets: genres.map((genre, index) => ({
                ...genre,
                label: undefined,
                color: () => fixedColors[index % fixedColors.length],
              })),
              legend: undefined,
            }}
            width={chartWidth}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
            style={{ alignSelf: "center", marginLeft: 20, marginRight: 0 }}
          />
        ) : (
          <Text className="text-center text-gray-500 text-label2">No Data Available</Text>
        )}
      </View>

      <View className="mt-2 flex items-center justify-center w-full">
        {[firstRow, secondRow].map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-center w-full">
            {row.map((legend, index) => (
              <View key={`${legend}-${index}`} className="flex-row items-center m-2">
                <View
                  className="w-4 h-4 rounded-full mr-2"
                  style={{
                    backgroundColor: fixedColors[(index + rowIndex * half) % fixedColors.length],
                  }}
                />
                <Text className="text-label2 text-gray-700 font-semibold">{legend}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

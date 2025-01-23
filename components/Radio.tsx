import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useState } from "react";
import "../global.css";

export function RadioComponents() {
  const [selected, setSelected] = useState<number | null>(null);

  const RadioValue = [
    { id: 1, label: "Sensitive", value: true },
    { id: 2, label: "Not Sensitive", value: false },
  ];

  return (
    <View style={{ flexDirection: "row" }}>
      {RadioValue.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => setSelected(item.id)}
          style={{
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <View
            style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: "#000",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selected === item.id && (
              <View
                style={{
                  height: 14,
                  width: 14 ,
                  borderRadius: 6,
                  backgroundColor: "#000",
                }}
              />
            )}
          </View>
          <Text>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
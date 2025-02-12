import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useRouter } from "expo-router";

export default function FaceScan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("Camera permission status:", status);
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    console.log("CameraView Ref:", cameraRef.current);
  }, [isCameraReady]);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      const photo = await cameraRef.current.takePictureAsync();

      if (!photo || !photo.uri) {
        console.error("Failed to capture photo.");
        return;
      }

      console.log("Captured Photo:", photo.uri);

      router.push(`/analysis?photo=${encodeURIComponent(photo.uri)}`);
    }
  };

  if (hasPermission === null) {
    return (
      <Text className="text-center text-white">
        requesting permission to use the camera...
      </Text>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg text-center">
          Please grant camera access from Settings.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="front"
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View className="absolute top-32 w-4/5 h-1/2 border-2 border-white rounded-full border-dashed self-center" />

        <TouchableOpacity
          className="absolute bottom-14 left-1/2 transform -translate-x-1/2"
          onPress={takePicture}
        >
          <View className="w-20 h-20 bg-white rounded-full border-4 border-gray-400" />
        </TouchableOpacity>

        <View className="absolute bottom-32 w-4/5 left-1/2 transform -translate-x-1/2">
          <Text className="text-white text-label4 font-bold text-center">
            Advice for Face Scanning
          </Text>
          <Text className="text-white text-center text-label4">
            1. Look at your face in a bright light.
          </Text>
          <Text className="text-white text-center text-label4">
            2. Choose a simple background.
          </Text>
          <Text className="text-white text-center text-label4">
            3. Make sure nothing is blocking your face.
          </Text>
          <Text className="text-white text-center text-label4">
            4. Make sure your face is in the allotted frame.
          </Text>
        </View>
      </CameraView>
    </View>
  );
}

import { AddPhoto } from "@/components/Card";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";


export default function CreateReviewPost() {
  const [image, setImage] = useState<string | null>(null); 

  return (
    <SafeAreaView>
      <AddPhoto image={image} setImage={setImage} />
    </SafeAreaView>
  );
}
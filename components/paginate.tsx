import { FC, useEffect } from "react";
import { View, Animated } from "react-native";
import { Dot } from "lucide-react-native";
import { ImagePaginationProps } from "@/interface/paginate";

export const ImagePagination: FC<ImagePaginationProps> = (props) => {
  const { data = [], currImage } = props; 
  
  const dotAnimations = data.map(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel(
      dotAnimations.map((anim: Animated.Value) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      )
    ).start();

    const animations = [];

    if (currImage >= 0 && currImage < data.length) {
      animations.push(
        Animated.timing(dotAnimations[currImage], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      );
    }

    if (currImage - 1 >= 0) {
      animations.push(
        Animated.timing(dotAnimations[currImage - 1], {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        })
      );
    }

    if (currImage + 1 < data.length) {
      animations.push(
        Animated.timing(dotAnimations[currImage + 1], {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        })
      );
    }

    if (currImage - 2 >= 0) {
      animations.push(
        Animated.timing(dotAnimations[currImage - 2], {
          toValue: 0.4,
          duration: 200,
          useNativeDriver: true,
        })
      );
    }

    if (currImage + 2 < data.length) {
      animations.push(
        Animated.timing(dotAnimations[currImage + 2], {
          toValue: 0.4,
          duration: 200,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [currImage]);

  const getDotSize = (index: number): number => {
    const distance = Math.abs(index - currImage);
    if (distance === 0) return 34;
    if (distance === 1) return 24;
    if (distance === 2) return 20;
    if (distance === 3) return 15;
    return 10;
  };

  const getDotColor = (index: number): string => {
    return index === currImage ? "#FF6F61" : "#D3D3D3";
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        height: 24,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {data.map((_: any, index: number) => {
          const scale = dotAnimations[index].interpolate({
            inputRange: [0, 0.4, 0.7, 1],
            outputRange: [0.5, 0.7, 0.85, 1],
          });

          return (
            <Animated.View
              key={index.toString()}
              style={{
                transform: [{ scale }],
                marginHorizontal: -6,
                minWidth: 0,
              }}
            >
              <View className="flex justify-center items-center">
              <Dot size={getDotSize(index)} color={getDotColor(index)} />
              </View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

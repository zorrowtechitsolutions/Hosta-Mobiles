import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";

const { width } = Dimensions.get("window");

const AdSwiper = ({ adImages }: { adImages: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(1);

  const animationDuration = 50000;
  const slideInterval = 5000;

  const goToNextSlide = () => {
    const nextIndex = (currentIndex + 1) % adImages.length;

    // Start fade-out animation
    Animated.timing(fadeAnim, {
      toValue: 0, // Fade out
      duration: animationDuration,
      useNativeDriver: true,
    }).start(() => {
      // Update image index after fade-out
      setCurrentIndex(nextIndex);

      // Start fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, slideInterval);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: adImages[currentIndex] }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.imageIndex}>
          {currentIndex + 1} / {adImages.length}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  slide: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imageIndex: {
    position: "absolute",
    bottom: 10,
    right: 10,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
});

export default AdSwiper;

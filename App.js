import { StatusBar } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { pickOneImage } from "./utils/PickImage";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const [image, setImage] = useState(null);
  const [ready, setReady] = useState();

  const handlePickImage = async () => {
    const result = await pickOneImage();
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const loadBackgroundAssets = async () => {
    console.log("Loading heavy assets in the background");
  };

  const readyApp = async () => {
    try {
      // console.log(
      //   "Trigger the Splash Screen visible till this try block resolves the promise"
      // );
      await SplashScreen.preventAutoHideAsync();

      await loadBackgroundAssets();

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (e) {
      console.warn(e);
    } finally {
      // console.log("Render the application screen");
      setReady(true);
    }
  };

  useEffect(() => {
    readyApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      // console.log("Hide the splash screen immediately");
      await SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }
  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Text style={{ paddingVertical: 12, fontSize: 22, fontWeight: "500" }}>
          Tải lên avatar của bạn
        </Text>
        <Image
          style={styles.avatar}
          source={{
            uri: image
              ? image
              : "https://t4.ftcdn.net/jpg/05/49/98/39/240_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
          }}
        />
        <TouchableOpacity style={styles.btn}>
          <Text
            style={{ color: "#fff", fontSize: 18 }}
            onPress={handlePickImage}
          >
            Thêm ảnh
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles.btn, backgroundColor: "#fff" }}>
          <Text style={{ color: "#333", fontSize: 18 }}>Hoàn thành</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  btn: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#1877f2",
    marginTop: 12,
  },
  avatar: {
    height: 180,
    width: 180,
    borderRadius: 2000,
    borderColor: "#fff",
    borderWidth: 5,
    marginLeft: "28%",
    marginBottom: 64,
  },
});

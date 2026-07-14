import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import mobileAds, {
  BannerAd,
  BannerAdSize,
  MaxAdContentRating,
  TestIds,
} from "react-native-google-mobile-ads";

const ADMOB_BANNER_ID = "ca-app-pub-8914844189894814/9356715454";
const bannerUnitId = __DEV__ ? TestIds.BANNER : ADMOB_BANNER_ID;

export default function App() {
  const [adsReady, setAdsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    mobileAds()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      })
      .then(() => mobileAds().initialize())
      .then(() => {
        if (!cancelled) setAdsReady(true);
      })
      .catch((error) => {
        console.warn("AdMob init failed", error);
        if (!cancelled) setAdsReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webviewWrap}>
        <WebView
          source={{ uri: "https://headache-app.vercel.app" }}
          bounces={false}
          overScrollMode="never"
          style={styles.webview}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#7c4dff" />
            </View>
          )}
        />
      </View>

      {adsReady ? (
        <View style={styles.adBar}>
          <BannerAd
            unitId={bannerUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdFailedToLoad={(error) => {
              console.warn("Banner failed to load", error);
            }}
          />
        </View>
      ) : null}

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121d2a",
  },
  webviewWrap: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "#121d2a",
  },
  adBar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121d2a",
    paddingBottom: Platform.OS === "android" ? 4 : 0,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121d2a",
  },
});

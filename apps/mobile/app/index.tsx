import { Redirect } from "expo-router";
import { useAuth } from "../src/auth/AuthContext";
import { LoadingOverlay } from "../src/components/ui/LoadingOverlay";

export default function Index() {
  const { status } = useAuth();
  if (status === "loading") return <LoadingOverlay />;
  if (status === "authed") return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/sign-in" />;
}

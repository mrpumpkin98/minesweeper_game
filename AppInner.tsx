import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Beginner from "./src/screen/Beginner";

const Tab = createBottomTabNavigator();

export default function AppInner() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <>
          <Tab.Screen
            name="Beginner"
            component={Beginner}
            options={{ title: "8x8" }}
          />
        </>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

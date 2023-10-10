import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Beginner from "./src/screen/Beginner";
import Intermediate from "./src/screen/Intermediate";
import Expert from "./src/screen/Expert";

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
          <Tab.Screen
            name="Intermediate"
            component={Intermediate}
            options={{ title: "10x14" }}
          />
          <Tab.Screen
            name="Expert"
            component={Expert}
            options={{ title: "14x32" }}
          />
        </>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

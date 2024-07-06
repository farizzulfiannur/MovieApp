// src/navigations/FavoriteStackNavigation.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Favorite from "../screens/Favorite";
import MovieDetail from "../screens/MovieDetail";

const Stack = createNativeStackNavigator();

const FavoriteStackNavigation = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name="FavoriteList" // Ubah dari "Favorite" menjadi "FavoriteList"
      component={Favorite}
      options={{ title: "Favorite Movies" }}
    />
    <Stack.Screen
      name="MovieDetail"
      component={MovieDetail}
      options={{ title: "Movie Detail" }}
    />
  </Stack.Navigator>
);

export default FavoriteStackNavigation;

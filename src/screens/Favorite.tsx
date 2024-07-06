import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, StackActions } from "@react-navigation/native"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import MovieItem from "../components/movies/MovieItem"; 
import type { Movie } from "../types/app";

const Favorite = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]); 
  const navigation = useNavigation(); 

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getFavoriteMovies(); 
    });
    return unsubscribe; 
  }, [navigation]); 

  const getFavoriteMovies = async () => {
    try {
      const favoriteList = await AsyncStorage.getItem("@FavoriteList");
      if (favoriteList !== null) {
        setFavoriteMovies(JSON.parse(favoriteList)); 
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handlePress = (movie: Movie) => {
    const pushAction = StackActions.push("MovieDetail", { id: movie.id }); 
    navigation.dispatch(pushAction); 
  };

  return (
    <View style={styles.container}>
      {favoriteMovies.length > 0 ? ( 
        <FlatList
          data={favoriteMovies}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePress(item)} 
              style={styles.kotak}
            >
              <MovieItem
                movie={item}
                size={{ width: 150, height: 220 }}
                coverType="poster"
              />
            </TouchableOpacity>
          )}
          numColumns={2} 
          keyExtractor={(item) => item.id.toString()} 
          contentContainerStyle={styles.flatListContent} 
        />
      ) : (
        <Text style={styles.noFavoritesText}>Belum ada film favorit.</Text> 
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  noFavoritesText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  flatListContent: {
    paddingHorizontal: 8, 
    paddingBottom: 16, 
  },
  kotak: {
    margin: 5,
  },
});

export default Favorite; 

import React, { useEffect, useState, useCallback } from "react"; 
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import axios from "axios"; 
import { FontAwesome } from "@expo/vector-icons"; 
import { LinearGradient } from "expo-linear-gradient"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { useIsFocused } from "@react-navigation/native"; 
import { API_ACCESS_TOKEN } from "@env"; 
import MovieList from "../components/movies/MovieList"; 
import type { Movie } from "../types/app"; 

const MovieDetail = ({ route }: any): JSX.Element => {

  const { id } = route.params; 
  const [movie, setMovie] = useState<any>(null); 
  const [loading, setLoading] = useState(true); 
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]); 
  const isFocused = useIsFocused(); 

  const fetchMovieData = useCallback(async () => {
    try {
      setLoading(true); 
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}`,
        {
          headers: {
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          },
        }
      ); 
      setMovie(movieResponse.data); 
    } catch (error) {
      console.error("Error fetching movie:", error); 
    } finally {
      setLoading(false); 
    }
  }, [id]); 

  const getFavoriteMovies = useCallback(async () => {
    try {
      const favoriteList = await AsyncStorage.getItem("@FavoriteList"); 
      if (favoriteList !== null) {
        setFavoriteMovies(JSON.parse(favoriteList)); 
      }
    } catch (error) {
      console.error("Error fetching favorites:", error); 
    }
  }, []); 

  useEffect(() => {
    fetchMovieData(); 
  }, [fetchMovieData, isFocused]);

  useEffect(() => {
    getFavoriteMovies(); 
  }, [getFavoriteMovies, isFocused]);

  const addFavorite = async (movie: Movie) => {
    const updatedFavorites = [...favoriteMovies, movie];
    setFavoriteMovies(updatedFavorites); 
    await AsyncStorage.setItem(
      "@FavoriteList",
      JSON.stringify(updatedFavorites)
    ); 
  };

  const removeFavorite = async (movieId: number) => {
    const updatedFavorites = favoriteMovies.filter(
      (movie) => movie.id !== movieId
    ); 
    setFavoriteMovies(updatedFavorites); 
    await AsyncStorage.setItem(
      "@FavoriteList",
      JSON.stringify(updatedFavorites)
    ); 
  };

  const isFavorite = (movieId: number) => {
    return favoriteMovies.some((movie) => movie.id === movieId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movie && (
        <>
          <ImageBackground
            resizeMode="cover"
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageStyle}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
          >
            <LinearGradient
              colors={["#00000000", "rgba(0, 0, 0, 0.7)"]}
              locations={[0.6, 0.8]}
              style={styles.gradientStyle}
            >
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={16} color="yellow" />
                <Text style={styles.rating}>
                  {movie.vote_average.toFixed(1)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={
                  isFavorite(movie.id)
                    ? () => removeFavorite(movie.id)
                    : () => addFavorite(movie)
                }
                style={styles.favoriteButton}
              >
                <FontAwesome
                  name={isFavorite(movie.id) ? "heart" : "heart-o"}
                  size={24}
                  style={styles.favorite}
                />
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
          <View style={styles.detailContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailHeading}>Original Language:</Text>
                <Text style={styles.detailText}>{movie.original_language}</Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailHeading}>Popularity:</Text>
                <Text style={styles.detailText}>{movie.popularity}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailHeading}>Release Date:</Text>
                <Text style={styles.detailText}>
                  {new Date(movie.release_date).toDateString()}
                </Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailHeading}>Vote Count:</Text>
                <Text style={styles.detailText}>{movie.vote_count}</Text>
              </View>
            </View>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        </>
      )}
      <View style={styles.recommendationHeader}>
        <MovieList
          title="Recommendation"
          path={`movie/${id}/recommendations`}
          coverType="poster"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
  },
  container: {
    flex: 1, 
    backgroundColor: "#fff", 
  },
  backgroundImage: {
    width: "100%", 
    height: 400, 
    marginBottom: 16, 
  },
  backgroundImageStyle: {
    borderRadius: 8,
  },
  gradientStyle: {
    flex: 1, 
    justifyContent: "flex-end", 
    paddingBottom: 16, 
    paddingHorizontal: 16, 
  },
  movieTitle: {
    fontSize: 32, 
    color: "white", 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row", 
    alignItems: "center", 
  },
  rating: {
    marginLeft: 8, 
    color: "white", 
    fontSize: 20, 
  },
  detailContainer: {
    paddingHorizontal: 16, 
    paddingBottom: 16, 
  },
  detailRow: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 16,
  },
  detailColumn: {
    flex: 1, 
    marginHorizontal: 8, 
  },
  detailHeading: {
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16, 
    color: "#555", 
  },
  overview: {
    fontSize: 16, 
    color: "#333", 
    marginTop: 16, 
    lineHeight: 24, 
  },
  recommendationHeader: {
    marginTop: 16, 
  },
  favoriteButton: {
    position: "absolute", 
    bottom: 16, 
    right: 16, 
  },
  favorite: {
    color: "red", 
  },
});

export default MovieDetail; 

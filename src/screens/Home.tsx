import React from "react";
import { ScrollView, View, StatusBar, StyleSheet } from "react-native";
import type { MovieListProps } from "../types/app";
import MovieList from "../components/movies/MovieList";

const movieLists: MovieListProps[] = [
  {
    title: "Now Playing in Theater",
    path: "movie/now_playing?language=en-US&page=1",
    coverType: "backdrop",
  },
  {
    title: "Upcoming Movies",
    path: "movie/upcoming?language=en-US&page=1",
    coverType: "poster",
  },
  {
    title: "Top Rated Movies",
    path: "movie/top_rated?language=en-US&page=1",
    coverType: "poster",
  },
  {
    title: "Popular Movies",
    path: "movie/popular?language=en-US&page=1",
    coverType: "poster",
  },
];

const Home = (): JSX.Element => {
  return (
    <ScrollView>
      <View style={styles.container}>
        {movieLists.map((movieList) => (
          <MovieList
            title={movieList.title} // Mengirimkan properti title ke komponen MovieList
            path={movieList.path} // Mengirimkan properti path ke komponen MovieList
            coverType={movieList.coverType} // Mengirimkan properti coverType ke komponen MovieList
            key={movieList.title} // Menambahkan properti key untuk setiap elemen MovieList
          />
        ))}
        <StatusBar translucent={false} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight ?? 32, // Mengatur margin top dengan tinggi StatusBar atau 32 jika StatusBar.currentHeight undefined
    alignItems: "center", // Mengatur alignItems menjadi center
    justifyContent: "center", // Mengatur justifyContent menjadi center
    rowGap: 16, // Mengatur jarak antar baris menjadi 16
  },
}); // Mendefinisikan gaya untuk komponen menggunakan StyleSheet

export default Home; // Mengekspor komponen Home sebagai default

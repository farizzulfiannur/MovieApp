import React, { useEffect, useState, useCallback } from "react"; // Mengimpor React dan beberapa hooks dari React, seperti useEffect, useState, dan useCallback
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native"; // Mengimpor beberapa komponen dari React Native
import axios from "axios"; // Mengimpor axios untuk melakukan HTTP requests
import { FontAwesome } from "@expo/vector-icons"; // Mengimpor ikon dari FontAwesome melalui expo
import { LinearGradient } from "expo-linear-gradient"; // Mengimpor LinearGradient dari expo untuk efek gradasi
import AsyncStorage from "@react-native-async-storage/async-storage"; // Mengimpor AsyncStorage untuk penyimpanan data lokal
import { useIsFocused } from "@react-navigation/native"; // Mengimpor useIsFocused untuk mengetahui apakah layar saat ini sedang difokuskan
import { API_ACCESS_TOKEN } from "@env"; // Mengimpor token akses API dari variabel lingkungan
import MovieList from "../components/movies/MovieList"; // Mengimpor komponen MovieList dari folder components
import type { Movie } from "../types/app"; // Mengimpor tipe data untuk props dan objek Movie

const MovieDetail = ({ route }: any): JSX.Element => {
  // Mendefinisikan komponen MovieDetail yang menerima props route

  const { id } = route.params; // Mengambil parameter id dari route
  const [movie, setMovie] = useState<any>(null); // Menggunakan state untuk menyimpan data movie, dimulai dengan null
  const [loading, setLoading] = useState(true); // Menggunakan state untuk menyimpan status loading, dimulai dengan true
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]); // Menggunakan state untuk menyimpan daftar film favorit, dimulai dengan array kosong
  const isFocused = useIsFocused(); // Menggunakan hook useIsFocused untuk mengetahui apakah layar ini sedang difokuskan

  const fetchMovieData = useCallback(async () => {
    // Mendefinisikan fungsi untuk mengambil data movie dari API
    try {
      setLoading(true); // Mengatur status loading menjadi true
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}`,
        {
          headers: {
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          },
        }
      ); // Mengambil data movie dari API menggunakan axios dengan header otorisasi
      setMovie(movieResponse.data); // Menyimpan data movie ke state
    } catch (error) {
      console.error("Error fetching movie:", error); // Menangani error jika terjadi kesalahan saat mengambil data
    } finally {
      setLoading(false); // Mengatur status loading menjadi false setelah selesai mengambil data
    }
  }, [id]); // useCallback dengan dependensi id untuk memanggil ulang fungsi jika id berubah

  const getFavoriteMovies = useCallback(async () => {
    // Mendefinisikan fungsi untuk mengambil daftar film favorit dari AsyncStorage
    try {
      const favoriteList = await AsyncStorage.getItem("@FavoriteList"); // Mengambil data daftar film favorit dari AsyncStorage
      if (favoriteList !== null) {
        setFavoriteMovies(JSON.parse(favoriteList)); // Menyimpan daftar film favorit ke state jika tidak null
      }
    } catch (error) {
      console.error("Error fetching favorites:", error); // Menangani error jika terjadi kesalahan saat mengambil data
    }
  }, []); // useCallback tanpa dependensi untuk memastikan fungsi ini tidak berubah

  useEffect(() => {
    fetchMovieData(); // Memanggil fungsi fetchMovieData ketika komponen pertama kali dirender dan ketika isFocused berubah
  }, [fetchMovieData, isFocused]);

  useEffect(() => {
    getFavoriteMovies(); // Memanggil fungsi getFavoriteMovies ketika komponen pertama kali dirender dan ketika isFocused berubah
  }, [getFavoriteMovies, isFocused]);

  const addFavorite = async (movie: Movie) => {
    // Mendefinisikan fungsi untuk menambahkan film ke daftar favorit
    const updatedFavorites = [...favoriteMovies, movie]; // Mengupdate daftar favorit dengan menambahkan film baru
    setFavoriteMovies(updatedFavorites); // Menyimpan daftar favorit yang telah diperbarui ke state
    await AsyncStorage.setItem(
      "@FavoriteList",
      JSON.stringify(updatedFavorites)
    ); // Menyimpan daftar favorit yang telah diperbarui ke AsyncStorage
  };

  const removeFavorite = async (movieId: number) => {
    // Mendefinisikan fungsi untuk menghapus film dari daftar favorit
    const updatedFavorites = favoriteMovies.filter(
      (movie) => movie.id !== movieId
    ); // Mengupdate daftar favorit dengan menghapus film yang sesuai dengan movieId
    setFavoriteMovies(updatedFavorites); // Menyimpan daftar favorit yang telah diperbarui ke state
    await AsyncStorage.setItem(
      "@FavoriteList",
      JSON.stringify(updatedFavorites)
    ); // Menyimpan daftar favorit yang telah diperbarui ke AsyncStorage
  };

  const isFavorite = (movieId: number) => {
    // Mendefinisikan fungsi untuk memeriksa apakah film ada dalam daftar favorit
    return favoriteMovies.some((movie) => movie.id === movieId);
  };

  if (loading) {
    // Menampilkan indikator loading jika status loading adalah true
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
    flex: 1, // Gaya untuk kontainer loading
    alignItems: "center", // Gaya untuk kontainer loading
    justifyContent: "center", // Gaya untuk kontainer loading
  },
  container: {
    flex: 1, // Gaya untuk kontainer utama
    backgroundColor: "#fff", // Gaya untuk kontainer utama
  },
  backgroundImage: {
    width: "100%", // Gaya untuk gambar latar belakang
    height: 400, // Gaya untuk gambar latar belakang
    marginBottom: 16, // Gaya untuk gambar latar belakang
  },
  backgroundImageStyle: {
    borderRadius: 8, // Gaya untuk gambar latar belakang yang diubah
  },
  gradientStyle: {
    flex: 1, // Gaya untuk efek gradasi
    justifyContent: "flex-end", // Gaya untuk efek gradasi
    paddingBottom: 16, // Gaya untuk efek gradasi
    paddingHorizontal: 16, // Gaya untuk efek gradasi
  },
  movieTitle: {
    fontSize: 32, // Gaya untuk judul film
    color: "white", // Gaya untuk judul film
    fontWeight: "bold", // Gaya untuk judul film
    textAlign: "center", // Gaya untuk judul film
    marginBottom: 8, // Gaya untuk judul film
  },
  ratingContainer: {
    flexDirection: "row", // Gaya untuk kontainer rating
    alignItems: "center", // Gaya untuk kontainer rating
  },
  rating: {
    marginLeft: 8, // Gaya untuk teks rating
    color: "white", // Gaya untuk teks rating
    fontSize: 20, // Gaya untuk teks rating
  },
  detailContainer: {
    paddingHorizontal: 16, // Gaya untuk kontainer detail film
    paddingBottom: 16, // Gaya untuk kontainer detail film
  },
  detailRow: {
    flexDirection: "row", // Gaya untuk baris detail film
    justifyContent: "space-between", // Gaya untuk baris detail film
    marginBottom: 16, // Gaya untuk baris detail film
  },
  detailColumn: {
    flex: 1, // Gaya untuk kolom detail film
    marginHorizontal: 8, // Gaya untuk kolom detail film
  },
  detailHeading: {
    fontSize: 16, // Gaya untuk heading detail film
    fontWeight: "bold", // Gaya untuk heading detail film
    marginBottom: 4, // Gaya untuk heading detail film
  },
  detailText: {
    fontSize: 16, // Gaya untuk teks detail film
    color: "#555", // Gaya untuk teks detail film
  },
  overview: {
    fontSize: 16, // Gaya untuk overview film
    color: "#333", // Gaya untuk overview film
    marginTop: 16, // Gaya untuk overview film
    lineHeight: 24, // Gaya untuk overview film
  },
  recommendationHeader: {
    marginTop: 16, // Gaya untuk header rekomendasi film
  },
  favoriteButton: {
    position: "absolute", // Gaya untuk tombol favorit
    bottom: 16, // Gaya untuk tombol favorit
    right: 16, // Gaya untuk tombol favorit
  },
  favorite: {
    color: "red", // Gaya untuk ikon favorit
  },
});

export default MovieDetail; // Mengekspor komponen MovieDetail sebagai default

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, StackActions } from "@react-navigation/native"; // Import hooks dari React Navigation untuk navigasi
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage untuk menyimpan data lokal
import MovieItem from "../components/movies/MovieItem"; // Import komponen MovieItem untuk menampilkan item film
import type { Movie } from "../types/app"; // Import tipe data Movie dari aplikasi

const Favorite = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]); // State untuk menyimpan daftar film favorit
  const navigation = useNavigation(); // Menggunakan hook useNavigation untuk mendapatkan objek navigasi

  useEffect(() => {
    // Efek samping untuk mendapatkan daftar film favorit saat layar difokuskan
    const unsubscribe = navigation.addListener("focus", () => {
      getFavoriteMovies(); // Panggil fungsi getFavoriteMovies untuk mengambil daftar film favorit dari AsyncStorage
    });
    return unsubscribe; // Membersihkan efek samping saat komponen tidak lagi digunakan
  }, [navigation]); // Bergantung pada navigation agar efek samping dapat dipanggil saat layar difokuskan

  const getFavoriteMovies = async () => {
    // Fungsi async untuk mengambil daftar film favorit dari AsyncStorage
    try {
      const favoriteList = await AsyncStorage.getItem("@FavoriteList"); // Ambil data dari AsyncStorage dengan kunci "@FavoriteList"
      if (favoriteList !== null) {
        setFavoriteMovies(JSON.parse(favoriteList)); // Jika data tersedia, ubah dari JSON ke array dan simpan dalam state
      }
    } catch (error) {
      console.error("Error fetching favorites:", error); // Tangani kesalahan jika gagal mengambil data
    }
  };

  const handlePress = (movie: Movie) => {
    // Fungsi untuk menangani ketika pengguna menekan item film favorit
    const pushAction = StackActions.push("MovieDetail", { id: movie.id }); // Buat aksi push untuk navigasi ke layar MovieDetail dengan ID film yang dipilih
    navigation.dispatch(pushAction); // Eksekusi aksi navigasi
  };

  return (
    <View style={styles.container}>
      {favoriteMovies.length > 0 ? ( // Tampilkan daftar film favorit jika ada film yang tersimpan
        <FlatList
          data={favoriteMovies}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePress(item)} // Panggil handlePress saat item dipilih
              style={styles.kotak}
            >
              <MovieItem
                movie={item}
                size={{ width: 150, height: 220 }} // Sesuaikan ukuran untuk penampilan visual yang lebih baik
                coverType="poster"
              />
            </TouchableOpacity>
          )}
          numColumns={2} // Tentukan jumlah kolom untuk tata letak yang lebih baik
          keyExtractor={(item) => item.id.toString()} // Ekstrak kunci unik dari setiap item untuk digunakan sebagai key dalam daftar
          contentContainerStyle={styles.flatListContent} // Atur gaya konten daftar untuk menambahkan padding
        />
      ) : (
        <Text style={styles.noFavoritesText}>Belum ada film favorit.</Text> // Tampilkan pesan jika tidak ada film favorit yang tersimpan
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
    paddingHorizontal: 8, // Tambahkan padding horizontal untuk jarak antar item
    paddingBottom: 16, // Tambahkan padding bawah untuk jarak antar item
  },
  kotak: {
    margin: 5,
  },
});

export default Favorite; // Ekspor komponen Favorite untuk digunakan di tempat lain dalam aplikasi

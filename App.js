import React, { createContext, useContext, useReducer } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


const places = [
  { id: 1, name: "Бурдж-Халифа", category: "Достопримечательности", description: "Самое высокое здание в мире с панорамными видами на город.", imageUrl: 'https://cdnn21.img.ria.ru/images/07e8/06/05/1950790840_0:0:1153:2048_1920x0_80_0_0_799208c1699cfd10419e4587ede9ec5e.jpg', rating: 4.9 },
  { id: 2, name: "Дубай Молл", category: "Шопинг", description: "Огромный торговый центр с аквариумом и катком.", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgQJVuw33KoPmousgfenw-vpIGboKuSifyXA&s', rating: 4.8 },
  { id: 3, name: "Пальма Джумейра", category: "Достопримечательности", description: "Искусственный остров в форме пальмы с отелями и ресторанами.", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCjjcVmfmpE1cXF3tHzswLQPBQjA88DDAMzA&s', rating: 4.7 },

  { id: 4, name: "At.mosphere", category: "Рестораны", description: "Ресторан на 122-м этаже Бурдж-Халифы с потрясающим видом.", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw4uCawj7OhJ5OxobUtPwFBBaccHKOUYwpUw&s', rating: 4.9 },
  { id: 5, name: "Pierchic", category: "Рестораны", description: "Рыбный ресторан на пирсе с видом на Персидский залив.", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPmkvbkaQak_HYr6I1Y8RaBWgvJPBo9xznsw&s', rating: 4.8 },
  { id: 6, name: "Al Fanar", category: "Рестораны", description: "Аутентичная кухня Эмиратов с уютной атмосферой.", imageUrl: 'https://media-cdn.tripadvisor.com/media/photo-m/1280/22/b0/63/d3/al-fanar-al-seef.jpg', rating: 4.7 },

  { id: 7, name: "Парк Заабиль", category: "Парки", description: "Большой парк с ландшафтным дизайном и площадками для пикника.", imageUrl: 'https://static.tildacdn.com/tild3234-6464-4333-b635-613566323965/zabeel-park4.jpg', rating: 4.8 },
  { id: 8, name: "Парк Крик", category: "Парки", description: "Парк с видом на залив и Дубайский дельфинариум.", imageUrl: 'https://cdn-cpkbd.nitrocdn.com/mmAGQfqanUBSPtSjTeGkTrQKCSDcaNPz/assets/images/optimized/rev-7680f1a/rentacheapcardubai.com/wp-content/uploads/2024/06/Artboard-2-100.jpg', rating: 4.7 },
  { id: 9, name: "Мушриф Парк", category: "Парки", description: "Огромный парк с тематическими деревнями и аттракционами.", imageUrl: 'https://kidpassage.com/images/activity/mushrif-park/mushrif-park_621878778.jpg', rating: 4.6 }
];



const categories = ["Достопримечательности", "Парки", "Рестораны"];

// ========== CONTEXT API ==========
const PlacesContext = createContext();

const initialState = { places, categories, selectedCategory: null, selectedPlace: null };

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CATEGORY': return { ...state, selectedCategory: action.payload };
    case 'SELECT_PLACE': return { ...state, selectedPlace: action.payload };
    default: return state;
  }
};

const PlacesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <PlacesContext.Provider value={{ state, dispatch }}>{children}</PlacesContext.Provider>;
};

const usePlaces = () => useContext(PlacesContext);

// ========== КОМПОНЕНТЫ ==========
const CategoryCard = ({ title, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const PlaceItem = ({ place, onPress }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: place.imageUrl }} style={[styles.image, { width: isTablet ? 150 : 100, height: isTablet ? 150 : 100 }]} />
      <Text style={styles.text}>{place.name}</Text>
    </TouchableOpacity>
  );
};

// ========== ЭКРАНЫ ==========
const CategoriesScreen = ({ navigation }) => {
  const { state, dispatch } = usePlaces();
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {state.categories.map(category => (
        <CategoryCard key={category} title={category} onPress={() => {
          dispatch({ type: 'SELECT_CATEGORY', payload: category });
          navigation.navigate('Places', { category });
        }} />
      ))}
    </ScrollView>
  );
};

const PlacesScreen = ({ navigation, route }) => {
  const { category } = route.params;
  const { state, dispatch } = usePlaces();
  const placesInCategory = state.places.filter(place => place.category === category);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {placesInCategory.map(place => (
        <PlaceItem key={place.id} place={place} onPress={() => {
          dispatch({ type: 'SELECT_PLACE', payload: place });
          navigation.navigate('PlaceDetails', { id: place.id });
        }} />
      ))}
    </ScrollView>
  );
};

const PlaceDetailScreen = ({ route }) => {
  const { id } = route.params;
  const { state } = usePlaces();
  const place = state.places.find(p => p.id == id);

  return (
    <View style={styles.container}>
      <Image source={{ uri: place.imageUrl }} style={styles.imageLarge} />
      <Text style={styles.title}>{place.name}</Text>
      <Text style={styles.description}>{place.description}</Text>
      <Text style={styles.rating}>Рейтинг: {place.rating}</Text>
    </View>
  );
};

// ========== НАВИГАЦИЯ ==========
const Stack = createStackNavigator();

export default function App() {
  return (
    <PlacesProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Categories" component={CategoriesScreen} />
          <Stack.Screen name="Places" component={PlacesScreen} />
          <Stack.Screen name="PlaceDetails" component={PlaceDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PlacesProvider>
  );
}

// ========== СТИЛИ ==========
const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  card: { backgroundColor: '#ddd', padding: 20, marginVertical: 10, borderRadius: 8, width: '90%', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
  image: { borderRadius: 8, marginTop: 10 },
  imageLarge: { width: '100%', height: 200, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  description: { fontSize: 16, marginTop: 5 },
  rating: { fontSize: 16, marginTop: 5 },
});
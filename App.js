import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import Produtos from './Produtos';
import Vendas from './Vendas';
import Categorias from './Categorias';
import ListaVendas from './ListaVendas';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="Produto" component={Produtos} options={{ headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="Venda" component={Vendas} options={{ headerBackVisible: false, headerShown: false}} />
        <Stack.Screen name="ListaVenda" component={ListaVendas} options={{ headerBackVisible: false, headerShown: false}} />
        <Stack.Screen name="Categoria" component={Categorias} options={{ headerBackVisible: false, headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
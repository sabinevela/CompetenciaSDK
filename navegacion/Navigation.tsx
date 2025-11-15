import { StyleSheet, ActivityIndicator, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { User } from '@supabase/supabase-js'
import { supabase } from '../security/supabase'
import FirstPage from '../screens/FirstPage'
import HomeScreen from '../screens/HomeScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import ProfileScreen from '../screens/ProfileScreen'
import PredictScreen from '../screens/PredictScreen'
import MapaScreen from '../screens/MapaScreen'
import EducacionScreen from '../screens/EducacionScreen'
import EmergenciaScreen from '../screens/EmergenciaScreen'
import AccionesScreen from '../screens/AccionesScreen'
import FeedScreen from '../screens/FeedScreen'
import VolcanoesScreen from '../screens/VolcanoesScreen'
import TiktokScreen from '../screens/TiktokScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Bottom Tab: FirstPage, Tiktok, Profile
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any
          if (route.name === 'FirstPage') iconName = 'home'
          else if (route.name === 'ClimTok') iconName = 'logo-tiktok'
          else if (route.name === 'Profile') iconName = 'person-circle'
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="FirstPage" component={FirstPage} />
      <Tab.Screen name="ClimTok" component={TiktokScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      setUser(session?.user ?? null)
    })
    
    return () => subscription?.unsubscribe()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user:', user?.email)
      setUser(user ?? null)
    } catch (error) {
      console.error('Error checking auth:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Principal" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {/* BottomTabs con FirstPage, Tiktok y Profile */}
            <Stack.Screen name="Tabs" component={BottomTabs} />

            {/* Todas las demás pantallas mantienen su lugar */}
            <Stack.Screen name="Home" component={FirstPage} />
            <Stack.Screen name="Predict" component={PredictScreen} />
            <Stack.Screen name="Mapa" component={MapaScreen} />
            <Stack.Screen name="Educacion" component={EducacionScreen} />
            <Stack.Screen name="Emergencia" component={EmergenciaScreen} />
            <Stack.Screen name="Acciones" component={AccionesScreen} />
            <Stack.Screen name="Feed" component={FeedScreen} />
            <Stack.Screen name="Volcanes" component={VolcanoesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
})

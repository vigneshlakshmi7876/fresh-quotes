import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import { Home } from './screens/Home';
import { Intro } from './screens/Intro';
import { NotFound } from './screens/NotFound';
import { Profile } from './screens/Profile';
import { SignIn } from '@/auth/screens/SignIn';
import { SignUp } from '@/auth/screens/SignUp';
import { ForgotPassword } from '@/auth/screens/ForgotPassword';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        headerShown: false,
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
      },
    },
    Profile: {
      screen: Profile,
      options: {
        headerShown: false,
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
      },
    },
  },
  screenOptions: {
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarStyle: Platform.select({
      ios: {
        // Use a transparent background on iOS to show the blur effect
      },
      default: {},
    }),
  },
});

const AuthStack = createNativeStackNavigator({
  screens: {
    SignIn: {
      screen: SignIn,
      options: {
        headerShown: false,
      },
      linking: {
        path: '/signin',
      },
    },
    SignUp: {
      screen: SignUp,
      options: {
        headerShown: false,
      },
      linking: {
        path: '/signup',
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      options: {
        headerShown: false,
      },
      linking: {
        path: '/forgot-password',
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Intro: {
      screen: Intro,
      options: {
        headerShown: false,
      },
      linking: {
        path: '/intro',
      },
    },
    Auth: {
      screen: AuthStack,
      options: {
        headerShown: false,
      },
    },
    HomeTabs: {
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: '404',
      },
      linking: {
        path: '*',
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

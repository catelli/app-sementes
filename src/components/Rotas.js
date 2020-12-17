import { Animated , Easing } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import CenaPrincipal from './CenaPrincipal';
import CenaPedido1 from './CenaPedido1';
import CenaPedido2 from './CenaPedido2';
import CenaListaPedidos from './CenaListaPedidos';
import CenaPedido4 from './CenaPedido4';
import CenaPedido5 from './CenaPedido5';

import CenaCliente1 from './CenaCliente1';
import CenaCliente2 from './CenaCliente2';

import CenaMeusClientes from './CenaMeusClientes';
import CenaMeusPedidos from './CenaMeusPedidos';

import AdicionarFazenda from './MeusClientes/AdicionarFazenda';
import EditarCliente from './MeusClientes/EditarCliente';
import ListaFazendas from './MeusClientes/ListaFazendas';

import CenaAtualizaDados from './CenaAtualizaDados';
import CenaEnviarPedidosClientes from './CenaEnviarPedidosClientes';
import CenaLogin from './CenaLogin';
import CenaCliente3 from './CenaCliente3';

const MainNav = createStackNavigator({
        "login" : {
            screen: CenaLogin,
        },
        "cenaprincipal" : {
            screen: CenaPrincipal,
        },
        "pedido1" : {
            screen: CenaPedido1,
        },
        "pedido2" : {
            screen: CenaPedido2,
        },
        "listaPedidos" : {
            screen: CenaListaPedidos,
        },
        "pedido4" : {
            screen: CenaPedido4,
        },
        "pedido5" : {
            screen: CenaPedido5,
        },
        "cliente1" : {
            screen: CenaCliente1,
        },
        "cliente2" : {
            screen: CenaCliente2,
        },
        "cliente3" : {
            screen: CenaCliente3,
        },
        "meusClientes" : {
            screen: CenaMeusClientes,
        },
        "meusPedidos" : {
            screen: CenaMeusPedidos,
        },
        "adicionarFazenda" : {
            screen: AdicionarFazenda,
        },
        "editarCliente" : {
            screen: EditarCliente,
        },
        "listaFazendas" : {
            screen: ListaFazendas,
        },
        "atualizaDados" : {
            screen: CenaAtualizaDados,
        },
        "enviarPedidosClientes" : {
            screen: CenaEnviarPedidosClientes,
        }
    },
    {
    initialRouteName: 'cenaprincipal',
    headerMode: 'none',
    mode: 'modal',
    defaultNavigationOptions: {
        gesturesEnabled: false,
    },
    transitionConfig: () => ({
        transitionSpec: {
            duration: 300,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const { index } = scene;

            const height = layout.initHeight;
            const translateY = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [height, 0, 0],
            });

            const opacity = position.interpolate({
            inputRange: [index - 1, index - 0.99, index],
            outputRange: [0, 1, 1],
            });

            return { opacity, transform: [{ translateY }] };
        },
        }),

    }
  );

const MainSignin = createStackNavigator({
        "login" : {
            screen: CenaLogin,
        },
    },
    {
        headerMode: 'none',
        mode: 'modal',
    }
); 

export const createRootNavigator = (signedIn = false) => {
    return createSwitchNavigator(
      {
        MainNav: {
          screen: MainNav
        },
        MainSignin: {
          screen: MainSignin
        }
      },
      {
        initialRouteName: signedIn?"MainNav":"MainSignin"
      }
    );
  };





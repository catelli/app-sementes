/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import React, { Component } from "react";
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableHighlight } from "react-native-gesture-handler";
import SQLite from 'react-native-sqlite-storage';
import SideMenu from 'react-native-side-menu';
import MenuPrincipal from "./MenuPrincipal";
import { getUser, onSignOut } from "./Auth";
import { initDB, closeDatabase } from './AuthDB';

/*let db = SQLite.openDatabase({ 
  name:"petrovina_sementes_v2.20", 
  createFromLocation: '~www/petrovina.sqlite3', 
  location:"Library" 
});*/

const dimension = Dimensions.get("window");
export default class CenaPrincipal extends Component {  

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      /* menu */
      isOpen: false,
      selectedItem: "",
      countClientes: 0,
      countFazendas: 0,
      countPrecos: 0,
      countClassificacoes: 0,
      countCidades: 0,

      usuarioLogado: {},
      FlatListItemsPedido: [],

      FlatListItemsC: [],
      FlatListItemsF: [],
      FlatListItemsP: [],
      FlatListItemsCl: [],
      FlatListItemsCi: [],
      FlatListItemsR: []
    };

     //db.transaction(tx => {

      /*tx.executeSql("SELECT * FROM pedidos", [], (tx, results) => {
        var tempPedido = [];
        for (let i = 0; i < results.rows.length; ++i) {
          tempPedido.push(results.rows.item(i));
        }
        this.setState({
          FlatListItemsPedido: tempPedido
        });
      });*/

      /*tx.executeSql("SELECT * FROM clientes", [], (tx, results) => {
        var tempC = [];
        for (let i = 0; i < results.rows.length; ++i) {
          tempC.push(results.rows.item(i));
        }
        this.setState({
          FlatListItemsC: tempC
        });
      });*/
      /*tx.executeSql("DELETE FROM fazendas", [], (tx, resultss) => {
        var tempF = [];
        for (let i = 0; i < resultss.rows.length; ++i) {
          tempF.push(resultss.rows.item(i));
        }
        this.setState({
          FlatListItemsF: tempF
        });
      });*/
     /* tx.executeSql("SELECT * FROM precos", [], (tx, results) => {
        var tempP = [];
        for (let i = 0; i < results.rows.length; ++i) {
          tempP.push(results.rows.item(i));
        }
        this.setState({
          FlatListItemsP: tempP
        });
      });
      tx.executeSql("SELECT * FROM classificacoes", [], (tx, results) => {
        var tempCl = [];
        for (let i = 0; i < results.rows.length; ++i) {
          tempCl.push(results.rows.item(i));
        }
        this.setState({
          FlatListItemsCl: tempCl
        });
      });
      tx.executeSql("SELECT * FROM cidades", [], (tx, results) => {
        var tempCi = [];
        for (let i = 0; i < results.rows.length; ++i) {
          tempCi.push(results.rows.item(i));
        }
        this.setState({
          FlatListItemsCi: tempCi
        });
      });
      tx.executeSql("DELETE FROM regioes", [], (tx, results) => {
        var tempR = [];
        for (let i = 0; i < results.rows.length; ++i) {
          tempR.push(results.rows.item(i));
        }
        this.setState({
          FlatListItemsR: tempR
        });
      });*/
    //});
  }

  //LOGIN-LOGOUT
  userInformations = async () => {
    const user = await getUser();
    this.setState({usuarioLogado: user});
  }

  async logout() {
    await onSignOut();
    this.props.navigation.navigate("MainSignin");
  }

  fill() {
    return new Promise(
    () => {
      initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT COUNT(idapp) as quantidade FROM clientes', [], (tx, results) => {
            this.setState({countClientes: results.rows.item(0).quantidade});
          });

          tx.executeSql('SELECT COUNT(idapp) as quantidade FROM fazendas', [], (tx, resultss) => {
            this.setState({countFazendas: resultss.rows.item(0).quantidade});
          });

          tx.executeSql('SELECT COUNT(id) as quantidade FROM precos', [], (tx, resultsss) => {
            this.setState({countPrecos: resultsss.rows.item(0).quantidade});
          });

          tx.executeSql('SELECT COUNT(id) as quantidade FROM classificacoes ', [], (tx, resultssss) => {
            this.setState({countClassificacoes: resultssss.rows.item(0).quantidade});
          });

          tx.executeSql('SELECT COUNT(id) as quantidade FROM cidades ', [], (tx, resultsssss) => {
            this.setState({countCidades: resultsssss.rows.item(0).quantidade});
          });
          
        }).then((result) => {
          closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
     });
  }

  componentDidMount() {
    this.userInformations();
    this.fill();
    loc(this);
  }

  componentWillMount() {
    rol();
  }

  /* menu */
  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item
    });

  selectedLineHeightDimensions = () => {
    if (dimension.width === 1080) {
      return 25;
    } else if (dimension.width === 1600) {
      return 35;
    }
  };

  // eslint-disable-next-line class-methods-use-this
  /* menu */
  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  /* menu */
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { navigation } = this.props;
    const menuPrincipal = <MenuPrincipal navigation={navigation} logado={this.state.usuarioLogado} logout={this.logout} />; 
    //console.log('pedidos');
    //console.log(this.state.FlatListItemsPedido);
    //console.log(this.state.countClientes);
    //console.log('clientes');
    //console.log(this.state.FlatListItemsC);
    //console.log('fazendas');
    //console.log(this.state.FlatListItemsF);
    //console.log('precos');
    //console.log(this.state.FlatListItemsP);
    //console.log('classificacoes');
    //console.log(this.state.FlatListItemsCl);
    //console.log('cidades');
    //console.log(this.state.FlatListItemsCi);
    //console.log('regioes');
    //console.log(this.state.FlatListItemsR);
    return (
      <SideMenu
        menu={menuPrincipal}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}
        menuPosition="right"
        edgeHitWidth={0}
      >
        <View style={styles.container}>
          <ImageBackground
            style={styles.backgroundImg}
            source={require("../../imgs/background.png")}
          >
            <View style={styles.viewTopo}>
              <TouchableHighlight
                onPress={() => {
                  this.toggle();
                }}
              >
                <Image
                  style={styles.menu}
                  source={require("../../imgs/btn_menu.png")}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.viewLogo}>
              <Image
                style={styles.logo}
                source={require("../../imgs/logo.png")}
              />
            </View>
            <View style={styles.viewText}>
              <Text adjustsFontSizeToFit style={styles.txtViewText}>
                Seja Bem - vindo. Aproveite todos os Beneficios do aplicativo
                Petrovina.
              </Text>
            </View>
            <View style={styles.viewRodape}>
              <TouchableHighlight
                underlayColor={"#B9C941"}
                activeOpacity={0.3}
                onPress={() => {
                  if(this.state.countClientes > 0 && 
                    this.state.countFazendas > 0 && 
                    this.state.countPrecos > 0 &&
                    this.state.countClassificacoes > 0 
                    ){
                    this.props.navigation.navigate('pedido1')      
                  }else{
                    Alert.alert('Não é possivel avançar',
                      'Favor, fazer as importações no menu ATUALIZAÇÕES.',
                      [
                        {text: 'Ok'},
                      ],
                      { cancelable: false }
                    );
                  }  
                }}
              >
                <View style={styles.botaoPedido}>
                  <Text style={styles.txtBotaoPedido}> NOVO PEDIDO </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={"#B9C941"}
                activeOpacity={0.3}
                onPress={() => {
                  if(this.state.countCidades > 0){
                    this.props.navigation.navigate('cliente1');
                  }else{
                    Alert.alert('Não é possivel avançar',
                      'Favor, fazer as importações no menu ATUALIZAÇÕES.',
                      [
                        {text: 'Ok'},
                      ],
                      { cancelable: false }
                    );
                  }  
                }}
              >
                <View style={styles.botaoCliente}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.txtBotaoCliente}
                  >
                    NOVO CLIENTE
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </ImageBackground>
        </View>
      </SideMenu>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImg: {
    width: "100%",
    height: "100%",
  },
  viewTopo: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-start"
  },
  menu: {
    width: wp("10%"),
    height: hp("5.5%"),
    resizeMode: "stretch",
    margin: 20
  },
  logo: { width: wp("80%"), height: hp("15%"), resizeMode: "center" },
  viewLogo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  viewText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  txtViewText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: hp("3%"),
    lineHeight: this.selectedLineHeightDimensions
  },
  viewRodape: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  botaoPedido: {
    width: wp("46%"),
    height: hp("13%"),
    backgroundColor: "#018A3C",
    marginLeft: "2%",
    marginTop: "25.5%",
    alignItems: "center",
    justifyContent: "center"
  },
  botaoCliente: {
    width: wp("46%"),
    height: hp("13%"),
    backgroundColor: "#935E34",
    marginRight: "1%",
    marginTop: "25.5%",
    alignItems: "center",
    justifyContent: "center"
  },
  txtBotaoPedido: {
    fontSize: wp("5%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    color: "#D2D926",
    textAlign: "center",
    marginBottom: "8%",
  },
  txtBotaoCliente: {
    fontSize: wp("5%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    color: "#FFF",
    textAlign: "center",
    marginBottom: "8%",
  }
});



/* eslint-disable linebreak-style */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable arrow-parens */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-else-return */
/* eslint-disable no-use-before-define */
/* eslint-disable default-case */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable global-require */
/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable arrow-body-style */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  StatusBar,
  Modal,
  Image,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import SideMenu from "react-native-side-menu";
import CenaMeusClientesItens from "./CenaMeusClientesItens";
import BarraNavegacao from "./BarraNavegacao";
import Menu from "./Menu";
import { getUser, onSignOut } from "./Auth";
import { initDB, closeDatabase } from "./AuthDB";

const lista = require("../../imgs/lista.png");
const editar = require("../../imgs/editar.png");
const insert = require("../../imgs/insert-file.png");
const fechar = require("../../imgs/close.png");

export default class CenaMeusClientes extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.toggleModalOpcao = this.toggleModalOpcao.bind(this);
    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    
    this.state = {
      listaItens: [],
      itemSelecionado: "",
      isOpenModalOpcao: false,

      /*search*/
      text: "",

      /* menu */
      isOpen: false,
      selectedItem: "About",

      /* pagination */
      loading: true,
      fetching_from_server: false,
      usuarioLogado:{}

    };

    /*search*/
    this.arrayholder = [];

    /* pagination */
    this.offset = 1;
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
      const temp = [];
      initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM clientes WHERE idbanco = 0', [], (tx, results) => {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            if(this._isMounted){
              this.setState({
                listaItens: temp,
              },() => {
                this.arrayholder = temp;
              });
            }
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
    this._isMounted = true;
    this.userInformations();
    this.fill();
    /*this.props.navigation.addListener("didFocus", () => {
      this.fillClientes();
    });*/
    loc(this);
  }

  componentWillMount() {
    rol();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /* menu */
  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item
    });

  /* menu */
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  /* menu */
  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  setModalOpcaoVisible(visible) {
    this.setState({ isOpenModalOpcao: visible });
  }

  toggleModalOpcao(item) {
    this.setState({
      isOpenModalOpcao: !this.state.isOpenModalOpcao,
      itemSelecionado: item
    });
  }

  searchFilterFunction(text) {
    const newData = this.arrayholder.filter(item => {
      const itemData = item.nome.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      listaItens: newData,
      text: text
    });
  }

  render() {
    const { navigation } = this.props;
    const param = navigation.getParam('parametro');
    const menu = <Menu navigation={navigation} logado={this.state.usuarioLogado} logout={this.logout} />;

    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}
        menuPosition="right"
        edgeHitWidth={0}
      >
        <View style={styles.container}>
          <StatusBar backgroundColor="#33723D" />
          <BarraNavegacao
            voltar
            navigation={navigation}
            toggle={this.toggle}
          />
          <View style={styles.searchBoxContainer}>
            <TextInput
              style={styles.searchBoxTextInput}
              onChangeText={text => this.searchFilterFunction(text)}
              underlineColorAndroid="#409551"
              placeholderTextColor="#925E33"
              value={this.state.text}
              placeholder="Pesquisar Clientes Inseridos"
              returnKeyType="done"
              clearButtonMode="always"
            />
          </View>
          <View style={styles.viewItens}>
            <ScrollView>
              {this.state.listaItens.map(item => {
                return (
                  <CenaMeusClientesItens
                    key={item.idapp}
                    publicacao={item}
                    toggleModalOpcao={this.toggleModalOpcao}
                  />
                );
              })}
            </ScrollView>
          </View>

          {/* MODAL item selecionado opcoes*/}
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isOpenModalOpcao}
            onRequestClose={() => {
              this.props.navigation.goBack();
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            >
              <View style={styles.listaModalPicker}>
              <TouchableWithoutFeedback
                onPress={() => {
                    this.setModalOpcaoVisible(!this.state.isOpenModalOpcao);
                }}
                  >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={styles.txtTitulo}>
                    {this.state.itemSelecionado.nome}
                  </Text>
                  <View style={styles.fecharBotao}>
                      <Image source={fechar} style={styles.fecharStyle} />
                  </View>
                </View>
                </TouchableWithoutFeedback>
                <View style={styles.grupo1}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.push("editarCliente", { idCliente: this.state.itemSelecionado.idapp, nomeCliente: this.state.itemSelecionado.nome });
                      this.setModalOpcaoVisible(!this.state.isOpenModalOpcao);
                    }} 
                  >
                    <View style={styles.itemPickerModal}>
                        <Image source={editar} style={styles.imageStyle} />
                        <Text style={styles.txtStyle}>Editar Cliente</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.push("listaFazendas", { idCliente: this.state.itemSelecionado.idapp, nomeCliente: this.state.itemSelecionado.nome  });
                      this.setModalOpcaoVisible(!this.state.isOpenModalOpcao);
                    }}
                  > 
                    <View style={styles.itemPickerModal}>
                        <Image source={lista} style={styles.imageStyle} />
                        <Text style={styles.txtStyle}>Lista de Fazenda</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.grupo2}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.push("adicionarFazenda", { idCliente: this.state.itemSelecionado.idapp, nomeCliente: this.state.itemSelecionado.nome  });
                      this.setModalOpcaoVisible(!this.state.isOpenModalOpcao);
                    }}  
                  >
                    <View style={styles.itemPickerModal}>
                        <Image source={insert} style={styles.imageStyle} />
                        <Text style={styles.txtStyle}>Incluir Fazenda</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SideMenu>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", flex: 1 },
  searchBoxContainer: {
    width: wp("100%"),
    height: hp("10%"),
    flexWrap: "nowrap",
    paddingHorizontal: "1.5%",
    paddingVertical: "2.5%",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: "1%"
  },
  searchBoxTextInput: {
    backgroundColor: "#fff",
    fontSize: wp("5%"),
    height: hp("7.5%"),
    margin: 0,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    color: "#979c9c"
  },
  viewItens: {
    flex: 1,
    marginTop: "1%"
  },

  /*modal opcoes*/
  txtTitulo: {
    fontSize: wp("4%"),
    marginLeft: "3%",
    marginTop: "3%",
    color: "#925E33",
    fontWeight: "500"
  },
  fecharBotao: { marginTop: "3%", marginRight: "3%" },
  fecharStyle: {
    width: wp("5%"),
    height: hp("3%"),
    resizeMode: "stretch",
    alignSelf: "flex-end"
  },
  listaModalPicker: {
    flexDirection: "column",
    backgroundColor: "#FFF",
    height: hp("75%"),
    width: wp("90%"),
    borderWidth: 1,
    borderColor: "#FFF",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    },
    elevation: 3
  },
  grupo1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  grupo2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  itemPickerModal: {
    width: wp("40%"),
    height: hp("30%"),
    backgroundColor: "#409551",
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  imageStyle: {
    width: wp("17%"),
    height: hp("10%"),
    resizeMode: "stretch"
  },
  txtStyle: {
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    fontSize: wp("4%"),
    color: "#FFF",
    textAlign: "center",
    marginTop: "10%"
  }
});

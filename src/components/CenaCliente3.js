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
  View,
  StatusBar,
  Modal
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import SideMenu from "react-native-side-menu";
import BarraNavegacao from "./BarraNavegacao";
import Menu from "./Menu";
import { getUser, onSignOut } from "./Auth";

import { initDB, closeDatabase } from "./AuthDB";
import CenaCliente3Itens from "./CenaCliente3Itens";

export default class CenaCliente3 extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      listaItens: [],
      cliente: {},
      usuarioLogado:{},

      /* modal mensagem */
      alertVisibility: false,

      /* menu */
      isOpen: false,
      selectedItem: "About"
    };
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
    (resolve) => {
      const { navigation } = this.props;
      const cliente_idapp = navigation.getParam('idapp');
      console.log('ESSE É O INSERT ID ->>>>>>> '+ cliente_idapp);
      const tempFazendas = [];
      initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT fazendas.idapp, fazendas.nome as fazenda, fazendas.endereco, fazendas.complemento, fazendas.inscricao, fazendas.email, fazendas.cep, fazendas.telefone, cidades.nome as cidade, cidades.estado '+
            'FROM fazendas '+
            'LEFT JOIN cidades on cidades.id = fazendas.codigomunicipio '+
            'WHERE fazendas.cliente_idapp = ?',
          [cliente_idapp], 
          (tx, results) => {
            for (let i = 0; i < results.rows.length; ++i) {
              tempFazendas.push(results.rows.item(i));
            }
            if(this._isMounted) {
              this.setState({ listaItens: tempFazendas });
            }
          });

          tx.executeSql('SELECT nome, cnpj_cpf FROM clientes where idapp = ?', [cliente_idapp], (tx, results) => {
            if(this._isMounted) {
              this.setState({ cliente: results.rows.item(0)});
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
    loc(this);
  }

  componentWillMount() {
    this.fill();
    rol();
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

  showCustomAlert(visible) {
    this.setState({ alertVisibility: visible });
    setTimeout(() => {
      this.setState({ alertVisibility: false });
      setTimeout(() => {
        this.props.navigation.popToTop(0);
        this.props.navigation.navigate("principal");
      }, 500);
    }, 3000);
  }

  render() {
    const { navigation } = this.props;
    const menu = <Menu navigation={navigation} logado={this.state.usuarioLogado} logout={this.logout} />;
    //console.log(this.state.cliente);
    //console.log(this.state.listaItens);
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
          <ScrollView>
            <Text style={styles.txtPedido}>CLIENTE:  {this.state.cliente.nome}  {this.state.cliente.cnpj_cpf} </Text>
            {this.state.listaItens.map(item => {
              return (
                <CenaCliente3Itens key={item.idapp} itemFazenda={item} />   
              );
            })}
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {this.showCustomAlert(true)}}
                style={styles.botao}
              >
                <Text style={styles.txtBotao}> SALVAR </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/*Modal MENSAGEM*/}
          <Modal
            visible={this.state.alertVisibility}
            transparent={true}
            animationType={"fade"}
            onRequestClose={() => {
              this.showCustomAlert(!this.state.alertVisibility);
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            >
              <View style={styles.alertMainView}>
                <Text style={styles.alertTitle}>
                  Cliente cadastrado com sucesso!
                </Text>

                <Text style={styles.alertMessage}>
                  Não esqueça de realizar a sincronização dos clientes no 
                  menu "atualizações".{" "}
                </Text>
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
  txtPedido: {
    fontSize: wp("4%"),
    color: "#925E33",
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    marginLeft: "1%",
    marginTop: "2%"
  },
  txtTotal: {
    fontSize: wp("6%"),
    color: "#716ACA",
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
    padding: "3.5%"
  },
  viewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  botao: {
    width: wp("50%"),
    height: hp("10%"),
    backgroundColor: "#018A3C",
    borderColor: "#FFF",
    borderWidth: 1,
    marginVertical: "4.5%",
    justifyContent:"center"
  },
  txtBotao: {
    fontSize: wp("3.5%"),
    color: "#D2D926",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    marginBottom: "5%"
   },
   /* MODAL MENSAGEM */
  alertMainView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#409551",
    height: hp("30%"),
    width: wp("90%"),
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#409551",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  alertTitle: {
    fontSize: wp("8%"),
    fontFamily: "Roboto-Regular",
    color: "#fff",
    textAlign: "center",
    padding: "1%",
    height: "48%"
  },

  alertMessage: {
    fontSize: wp("5%"),
    color: "#fff",
    fontFamily: "Roboto-Regular",
    textAlign: "center",
    padding: 3,
    height: "48%"
  },

  buttonStyle: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },

});

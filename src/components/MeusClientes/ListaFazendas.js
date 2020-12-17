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
  StatusBar
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";
import SideMenu from "react-native-side-menu";
import axios from "axios";
import ListaFazendasItens from "./ListaFazendasItens";
import BarraNavegacao from "../BarraNavegacao";
import Menu from "../Menu";
import { getUser, onSignOut } from "../Auth";
import { initDB, closeDatabase } from '../AuthDB';

export default class ListaFazendas extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      dataRegister: [],
      usuarioLogado: {},

      /* menu */
      isOpen: false,
      selectedItem: "About"
    };

    this.arrayholder = [];
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

  fill(idCliente) {
    return new Promise(
    (resolve) => {
      const tempFazendas = [];
      initDB().then((db) => {
        db.transaction((tx) => {    
          tx.executeSql(
            'SELECT fazendas.idapp, fazendas.nome as fazenda, fazendas.endereco, fazendas.complemento, fazendas.inscricao, fazendas.email, fazendas.cep, fazendas.telefone, cidades.nome as cidade, cidades.estado '+
            'FROM fazendas '+
            'LEFT JOIN cidades on cidades.id = fazendas.codigomunicipio '+
            'WHERE fazendas.cliente_idapp = ?'
          ,[idCliente], (tx, results) => {
            for (let i = 0; i < results.rows.length; ++i) {
              tempFazendas.push(results.rows.item(i));
            }
            if(this._isMounted){
              this.setState({
                dataRegister: tempFazendas,
              },() => {
                this.arrayholder = tempFazendas;
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
    const idCliente = this.props.navigation.getParam('idCliente')?
    this.props.navigation.getParam('idCliente'): "";
    this.fill(idCliente);
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

  render() {
    const { navigation } = this.props;
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
          <ScrollView>
            <Text style={styles.txtPedido}>Fazendas de {this.props.navigation.getParam('nomeCliente')}</Text>
            {this.state.dataRegister.map(item => {
              return <ListaFazendasItens key={item.idapp} itemFazenda={item} />;
            })}
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('adicionarFazenda', { idCliente: this.props.navigation.getParam('idCliente'), nomeCliente: this.props.navigation.getParam('nomeCliente')  });
                }}
              >
                <View style={styles.botao}>
                    <Text style={styles.txtBotao}> NOVA FAZENDA </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SideMenu>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", flex: 1 },
  txtPedido: {
    fontSize: wp("5%"),
    color: "#925E33",
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    marginVertical: "2.5%",
    textAlign: "center"
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
    marginVertical: "5%",
    justifyContent:"center"
  },
  txtBotao: { 
    fontSize: wp("4%"),
    color: "#D2D926",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    marginBottom: "5%"
   }
});

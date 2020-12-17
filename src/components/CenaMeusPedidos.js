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
  StyleSheet,
  View,
  StatusBar,
  TextInput,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import SideMenu from "react-native-side-menu";
import { TouchableOpacity } from 'react-native-gesture-handler';
import CenaMeusPedidosItens from "./CenaMeusPedidosItens";
import BarraNavegacao from "./BarraNavegacao";
import Menu from "./Menu";
import { getUser, onSignOut } from "./Auth";
import { initDB, closeDatabase, initDbPromise } from "./AuthDB";

export default class CenaMeusPedidos extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.delete = this.delete.bind(this);
    this.state = {
      listaItens: [],
      /*search*/
      text: "",
      usuarioLogado:{},
      /* menu */
      isOpen: false,
      selectedItem: "About"
    };

    /*search*/
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

  fill() {
    return new Promise(
    () => {
      const tempPedidos = [];
      initDB()
        .then((db) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT pedidos.id, pedidos.nome_cliente, pedidos.fazenda, pedidos.fazenda, pedidos.data, pedidos.status, SUM(parcelamento.valor) as valor_total '+
            'FROM pedidos '+
            'LEFT JOIN parcelamento on parcelamento.id_pedido = pedidos.id '+
            'GROUP BY pedidos.id',
           [], 
           (tx, results) => {
            for(let i = 0; i < results.rows.length; ++i) {
              tempPedidos.push(results.rows.item(i));
            }
            if(this._isMounted){
              this.setState({
                listaItens: tempPedidos,
              },() => {
                this.arrayholder = tempPedidos;
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

  searchFilterFunction(text) {
    const newData = this.arrayholder.filter(item => {
      const itemData = item.nome_cliente.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      listaItens: newData,
      text: text
    });
  }

  async remove(idPedido){
    const db = await initDbPromise();
    try {
      await db.transaction(async (tx) => {
        tx.executeSql('DELETE FROM pedidos WHERE id = ?',[idPedido]);
        tx.executeSql('DELETE FROM itens_pedido WHERE id_pedido = ?',[idPedido]);
        tx.executeSql('DELETE FROM parcelamento WHERE id_pedido = ?',[idPedido]);
      });
    } catch (error) {
      await db.close();
      throw new Error(`Something failed`);
    } finally{
      await db.close();
      return true;
    }
  }


  async delete(idPedido) {
    Alert.alert(
      'Deseja remover o pedido?',
      'Ao remover o pedido, ele não poderá ser sincronizado e os dados serão perdidos.',
      [
        {
          text: 'Ok',
          onPress: async () => {
            const response = await this.remove(idPedido);
            if(response){
              this.props.navigation.replace('meusPedidos');
            }   
           
          },
        },
        {text: 'Não', onPress: () => null, style: 'cancel'},
      ],
      { cancelable: false }
    );
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
          <View style={styles.searchBoxContainer}>
            <TextInput
              style={styles.searchBoxTextInput}
              onChangeText={text => this.searchFilterFunction(text)}
              underlineColorAndroid="#409551"
              placeholderTextColor="#925E33"
              value={this.state.text}
              placeholder="Pesquisar Meus Pedidos"
              returnKeyType="done"
              clearButtonMode="always"
            />
          </View>
          <View style={styles.viewItens}>
            <ScrollView>
              {this.state.listaItens.map(item => {
                console.log(item);
                if(item.status === "aberto") {
                  return (
                    <TouchableOpacity key={item.id} onPress={() => {
                      this.props.navigation.push('pedido1', { 
                        insertId : item.id,
                      });
                    }}>                  
                       <CenaMeusPedidosItens key={item.id} publicacao={item} delete={this.delete} />
                    </TouchableOpacity>
                  );
                }else{
                  return (<CenaMeusPedidosItens key={item.id} publicacao={item} delete={this.delete} />);
                }
              })}
            </ScrollView>
          </View>
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
  }
});

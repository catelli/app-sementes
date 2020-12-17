/* eslint-disable linebreak-style */
/* eslint-disable react/sort-comp */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-curly-brace-presence */
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
  View,
  StyleSheet,
  Text,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import SideMenu from "react-native-side-menu";
import axios from "axios";
import BarraNavegacao from "./BarraNavegacao";
import Menu from "./Menu";
import { getUser, onSignOut } from "./Auth";
import { initDbPromise } from "./AuthDB";

export default class CenaEnviarPedidosClientes extends Component {
  constructor(props) {
    super(props);

    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      selectedObservacoes: "",
      alertVisibility: false,
      isLoading: false,
      usuarioLogado:{},

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

  async logout(){
    await onSignOut();
    this.props.navigation.navigate("MainSignin");
  }

  componentDidMount() {
    this.userInformations();
    loc(this);
  }

  componentWillMount() {
    rol();
  }

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

  /* menu */
  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item
    });

  showCustomAlert(visible) {
    setTimeout(() => {
      this.showLoading();
      setTimeout(() => {
        this.hideLoading();
        this.setState({ alertVisibility: visible });
        setTimeout(() => {
          this.setState({ alertVisibility: false });
        }, 3000);
      }, 3000);
    }, 500);
  }

  showLoading() {
    this.setState({ isLoading: true });
  }

  hideLoading() {
    this.setState({ isLoading: false });
  }


  setMessage(name){
    setTimeout(() => {
      this.hideLoading();
      this.setState({ nameVisibility: name, alertVisibility: true });
      setTimeout(() => {
        this.setState({ alertVisibility: false });
      }, 3000);
    }, 3000);
  }

  async newSend(){
      arrayPedidos = [];
      arrayClientes = [];

      idsPedidos = [];
      idsClientes = [];
      idsItensPedido = [];
      idsParcelamento = [];
      idsFazendas = [];

      this.showLoading();
      const db = await initDbPromise();
      const pedidosSQlite = await db.executeSql(`SELECT * FROM pedidos WHERE id_usuario = ? AND status = 'finalizado'`,[this.state.usuarioLogado.id]);      
      const pedidos = pedidosSQlite[0].rows;
      if(pedidos.length > 0){
        for(let pedido of pedidos.raw()){
          arrayItensPedido = [];
          const itensPedidoSQlite = await db.executeSql(`SELECT * FROM itens_pedido WHERE id_pedido = ?`,[pedido.id]);
          const itensPedido = itensPedidoSQlite[0].rows;
          if(itensPedido.length > 0 ){
            for (let itempedido of itensPedido.raw()){
              arrayItensPedido.push(itempedido);
              idsItensPedido.push(itempedido.id);
            }
          }
          arrayParcelamento = [];
          const parcelamentosSQlite = await db.executeSql(`SELECT * FROM parcelamento WHERE id_pedido = ?`,[pedido.id]);
          const parcelamentos = parcelamentosSQlite[0].rows;
          if(parcelamentos.length > 0 ){
            for (let parcelamento of parcelamentos.raw()){
              arrayParcelamento.push(parcelamento);
              idsParcelamento.push(parcelamento.id);
            }
          }
          arrayPedidos.push({
            classificacao: pedido.classificacao,
            codigoclifor: pedido.codigoclifor,
            codigolocal: pedido.codigolocal,
            comissao: pedido.comissao,
            cpf_cnpj: pedido.cpf_cnpj,
            data: pedido.data,
            fazenda: pedido.fazenda,
            id: pedido.id,
            id_cliente: pedido.id_cliente,
            id_fazenda: pedido.id_fazenda,
            id_usuario: pedido.id_usuario,
            modalidade_pagamento: pedido.modalidade_pagamento,
            nome_cliente: pedido.nome_cliente,
            observacao: pedido.observacao,
            regiao: pedido.regiao,
            status: pedido.status,
            tipo_entrega: pedido.tipo_entrega,
            itens_pedido: arrayItensPedido,
            parcelas: arrayParcelamento, 
          });
          idsPedidos.push(pedido.id);
        }
      }

      const clientesSQlite = await db.executeSql(`SELECT * FROM clientes WHERE clientes.idbanco = 0 AND clientes.idapp IN (SELECT fazendas.cliente_idapp FROM fazendas) AND clientes.idapp IN (SELECT pedidos.id_cliente FROM pedidos)`);
      const clientes = clientesSQlite[0].rows;
      
      if(clientes.length > 0){
        for(let cliente of clientes.raw()){  
          arrayFazendas = [];
          const fazendasSQlite = await db.executeSql(`SELECT * FROM fazendas WHERE cliente_idapp = ?`,[cliente.idapp]);
          const fazendas = fazendasSQlite[0].rows;          
          if(fazendas.length > 0) {
            for (let fazenda of fazendas.raw()) {
              console.log(fazenda);
              arrayFazendas.push(fazenda);
              idsFazendas.push(fazenda.idapp);
            }
          }
          arrayClientes.push({
              cnpj_cpf: cliente.cnpj_cpf,
              codigoclifor: cliente.codigoclifor,
              idapp: cliente.idapp,
              idbanco: cliente.idbanco,
              nome: cliente.nome,
              rg: cliente.rg,
              tipo: cliente.tipo,
              fazendas: arrayFazendas
          });
          idsClientes.push(cliente.idapp);
        } 
      }
  
      if(arrayPedidos.length > 0 || arrayClientes.length > 0){
          let response = await axios.post('https://carregamento.petrovina.com.br/api/data/pedidos_clientes', { 
            pedidos: arrayPedidos,
            clientes: arrayClientes
            },{
            headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          if(response.data.status === "Success") {
              if(idsPedidos.length > 0) {
                const paramsPedidos = idsPedidos.toString();          
                await db.executeSql(`DELETE FROM pedidos WHERE id IN (${paramsPedidos})`);
              }
              if(idsItensPedido.length > 0) {
                const paramsItensPedidos = idsItensPedido.toString();
                await db.executeSql(`DELETE FROM itens_pedido WHERE id IN (${paramsItensPedidos})`);
              } 
              if(idsParcelamento.length > 0) {
                const paramsParcelamento = idsParcelamento.toString();
                await db.executeSql(`DELETE FROM parcelamento WHERE id IN (${paramsParcelamento})`);
              } 
              if(idsClientes.length > 0) {
                const paramsClientes = idsClientes.toString();
                await db.executeSql(`DELETE FROM clientes WHERE idapp IN (${paramsClientes})`);
              } 
              if(idsFazendas.length > 0) {
                const paramsFazendas = idsFazendas.toString();
                await db.executeSql(`DELETE FROM fazendas WHERE idapp IN (${paramsFazendas})`);
              } 
              this.setMessage("Clientes/Fazendas");
              await db.close();
          }else{
              this.hideLoading();
              Alert.alert('Envio não realizado',
              'Tente novamente mais tarde',
              [
                {text: 'Ok'},
              ],
              { cancelable: false }
              );
          }
      }else{
        this.hideLoading();
        Alert.alert('Envio não realizado',
        'Não há dados a serem enviados!',
        [
          {text: 'Ok'},
        ],
        { cancelable: false }
        );
        await db.close();
      }
  }

  render() {
    const { navigation } = this.props;
    const param = navigation.getParam('parametro');
    const menu  = <Menu navigation={navigation} logado={this.state.usuarioLogado} logout={this.logout} />;

    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}
        menuPosition={"right"}
        edgeHitWidth={0}
      >
        <View style={styles.container}>
          <StatusBar backgroundColor="#33723D" />
          <BarraNavegacao
            voltar
            navigation={navigation}
            toggle={this.toggle}
          />
          {this.state.isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator
                color="#409551" // color of your choice
                size="large"
              />
            </View>
          )}

          <View style={styles.conteudo}>
            <View style={styles.viewTxt}>
              <Text style={styles.txt}>
                Ao apertar o botão de enviar, os pedidos e clientes armazenados no
                aplicativo serão enviados ao WebService Petrovina.
              </Text>
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  //this.showCustomAlert(true);
                  this.newSend()
                }}
                style={styles.botao}
              >
                <Text style={styles.txtBotao}> ENVIAR </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* MODAL MENSAGEM */}
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
                  Pedidos e Clientes enviados com sucesso!
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
  conteudo: { flex: 1, padding: "2.5%", flexDirection: "column" },
  viewTxt: { flex: 1, justifyContent: "flex-end" },
  txt: {
    fontSize: wp("5%"),
    color: "#925E33",
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "3%",
    zIndex: 0
  },
  viewButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  botao: {
    width: wp("55%"),
    height: hp("13%"),
    backgroundColor: "#018A3C",
    borderColor: "#FFF",
    borderWidth: 1,
    marginVertical: "5%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0
  },
  txtBotao: {
    fontSize: wp("4.5%"),
    color: "#D2D926",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    marginBottom: "11%"
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

  buttonStyle: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },

  /* ACTIVITY INDICATOR */
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1

  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: hp(80)
  }
});

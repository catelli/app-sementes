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
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from "moment";
import SideMenu from "react-native-side-menu";
import BarraNavegacao from "./BarraNavegacao";
import Menu from "./Menu";
import { getUser, onSignOut } from "./Auth";
import { initDbPromise } from "./AuthDB";

export default class CenaPedido5 extends Component {
  _isMounted = false;
  arrayParcelas = [];
  constructor(props) {
    super(props);
    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);

    this.makePlots = this.makePlots.bind(this);

    this.state = {
      alertVisibility: false,
      selectedTotal: "",
      selectedParcelas:[],
      selectedNovoTotal:[],
      selectedNovosValores:[],
      selectedObservacoes:"",
      usuarioLogado: {},

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

  formatNumber(amount, decimalCount = 2, decimal = ",", thousands = ".") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e);
    }
  };

  componentWillMount() {
    this.setState({
      selectedObservacoes: this.props.navigation.getParam('observacao'),
      selectedTotal: this.props.navigation.getParam('total'),//12557.1675 
      selectedParcelas: this.props.navigation.getParam('parcelas')//[{dataVencimento: "20/05/2020", parcelaPercentual: "50", valorBase: 6278.58375, index: 1},{dataVencimento: "20/10/2020", parcelaPercentual: "50", valorBase: 6278.58375, index: 2}],
    });
    rol();
  }

  componentDidMount() {
    this._isMounted = true;
    this.userInformations();
    this.makePlots();
    loc(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setModalVisiblePicker1(visible) {
    this.setState({ modalVisiblePicker1: visible });
  }

  onPressActionPicker = (parcelas) => {
    this.setState({selectedParcelas: parcelas});
    this.setModalVisiblePicker1(!this.state.modalVisiblePicker1);
  };

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

  somaTotal(array) {
    return array.reduce((a,b) => a + b, 0);
  }

  checkDateValidAndReturnFormat(date) {     
    const momentObj = moment(date,"DD/MM/YYYY");
    const momentString = momentObj.format('YYYY-MM-DD');
    const obj = moment(momentString,'YYYY-MM-DD');
    return {
      "string": momentString,
      "object" : obj
    };
  }

  returnDateReference() {
    const ano = new Date().getFullYear();    
    const dataReferenciaObj = moment(`${ano}-08-30`);
    return {
      "string": dataReferenciaObj.format('YYYY-MM-DD'),
      "object": dataReferenciaObj
    };
   } 

  calculaTaxa(parcela, tempo, before = false) {
    const taxa = 1.2;
    const capital = parcela;
    const montante = 0;
    const taxaJuros = taxa/100;

    if(before){
      this.montante = capital * Math.pow((1 - taxaJuros), tempo);
    }else{
      this.montante = capital * Math.pow((1 + taxaJuros), tempo);
    }
    //const total = this.montante.toString();
    const total = this.montante;
    return total;    
  } 

  makePlots(){
    const objParcelas = this.state.selectedParcelas;
    const dateReference = this.returnDateReference();
    const novosValores = [];
    const calculoNovoTotal = [];
    
    for(let key in objParcelas) {
      const currentObj = objParcelas[key];
      const dataVencimentoObj = this.checkDateValidAndReturnFormat(currentObj.dataVencimento);
      let isDateBefore = moment(dataVencimentoObj.string).isBefore(dateReference.string);
      const valor = "";

      if((currentObj.index === 1) && (parseFloat(currentObj.parcelaPercentual) < 15)){
        this.valor = currentObj.valorBase;
      }else{
        if(isDateBefore) {
          let time = dateReference.object.diff(dataVencimentoObj.object, 'months');
          let valorParcela = this.calculaTaxa(currentObj.valorBase, time, true);
          this.valor = valorParcela;
        }else{
          let time = dataVencimentoObj.object.diff(dateReference.object, 'months');
          let valorParcela = this.calculaTaxa(currentObj.valorBase, time, false);
          this.valor = valorParcela;
        }
      }
      novosValores.push(
        {
          'dataVencimento': currentObj.dataVencimento,
          'parcelaPercentual': currentObj.parcelaPercentual,
          'valorParcela': this.valor,
          'valorBase': this.formatNumber(currentObj.valorBase.toString())
        }
      );
      calculoNovoTotal.push(this.valor);
    }
    if(this._isMounted){
      this.setState({
        selectedNovoTotal: this.somaTotal(calculoNovoTotal), 
        selectedNovosValores: novosValores
      });
    }
  }
    
  salvar = async () => {
      const db = await initDbPromise();
      const registros = this.state.selectedNovosValores;
      try {
        const count = [];
        await db.transaction(async (tx) => {
          for(let key in registros) {
            const registrosObj = registros[key];
            tx.executeSql(
              'INSERT INTO parcelamento (id_pedido, data_vencimento, valor, valor_base, parcela) VALUES (?,?,?,?,?)',
              [
                this.props.navigation.getParam('insertId'), 
                registrosObj.dataVencimento,
                registrosObj.valorParcela,
                registrosObj.valorBase,
                registrosObj.parcelaPercentual,
              ]
            );
            count.push(1);
          }
          tx.executeSql(
            'UPDATE pedidos set observacao=?, status=? where id=?',
            [this.state.selectedObservacoes, "finalizado", this.props.navigation.getParam('insertId')]  
          );
        });

        if(this.state.selectedParcelas.length === count.length) {
          console.log('deu tudo certo');
          await db.close();
          this.showCustomAlert(true);
        }else{
          console.log('deu tudo errado');
          await db.close();
          return false;
        }
  
      } catch (error) {
        await db.close();
        throw new Error(`Something failed`);
      }
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
        <ScrollView style={{ padding:"2.5%" }}>
          <View style={styles.viewItens}>
            <View style={styles.detalhesItens1}>
              <Text style={styles.txtTituloValor}>PEDIDO Nº {this.props.navigation.getParam('insertId')}</Text>
            </View>
            <View style={styles.detalhesItens2}>
              <Text style={styles.txtTotal}>TOTAL R$ {this.formatNumber(this.state.selectedNovoTotal)}</Text>
            </View>
          </View>  
          <View style={styles.item}>
            <View style={styles.detalhesItem1}>
              <View style={styles.detalhesItem1Coluna1}>
                <Text style={[styles.txtPedido, { marginLeft: "7%" }]}>Data</Text>
              </View>
              <View style={styles.detalhesItem1Coluna2}>
                <Text style={styles.txtPedido}>Valor da Parcela</Text>
              </View>
            </View>
            {this.state.selectedNovosValores.map(item => {
              return (
                <View key={item.dataVencimento} style={styles.detalhesItem2}>
                  <View style={styles.detalhesItem2Coluna1}>
                    <Text style={[styles.txtValor, { color: "#716ACA", marginLeft: "7%" }]}>{item.dataVencimento}</Text>
                  </View>
                  <View style={styles.detalhesItem2Coluna2}>
                    <Text style={[styles.txtValor, { color: "#716ACA" }]}>
                      R$ {this.formatNumber(item.valorParcela.toString())}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.viewButton}>
            <TouchableOpacity
              onPress={() => {
                  this.salvar();
              }}
            >
              <View style={styles.botao}>
                <Text style={styles.txtBotao}> FINALIZAR </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
         {/* MODAL ALERT */}
        <Modal
          visible={this.state.alertVisibility}
          transparent={true}
          animationType="fade"
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
                Pedido realizado com sucesso!
              </Text>

              <Text style={styles.alertMessage}>
                {" "}
                Não esqueça de realizar a sincronização dos pedidos na aba
                menu.{" "}
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
  container: { 
    backgroundColor: "#FFF", 
    flex: 1 
  },  
  viewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  botao: {
    width: wp("50%"),
    height: hp("12%"),
    backgroundColor: "#018A3C",
    borderColor: "#FFF",
    borderWidth: 1,
    marginTop:"20%",
    justifyContent:"center"
  },
  txtBotao: {
    fontSize: wp("4.5%"),
    color: "#D2D926",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    marginBottom: "7%"
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
   /*ITENS*/
   viewItens: {
    height: hp(15),
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "1%",
  },
  detalhesItens1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    //marginVertical:"2%"
  },
  detalhesItens2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginBottom:"4%"
  },
  txtTituloValor: {
    fontSize: wp("4.5%"),
    color: "#925E33",
    fontWeight: "400",
  },  
  /* MODAL */
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
  
  ////// item //////

  item: {
    flex: 1,
    width: wp("97%"),
    flexDirection:"column",
    borderWidth: 0.8,
    borderColor: "#999",
    margin: "1.5%",
    overflow: "hidden",
    padding: "1%"
  },
  detalhesItem1: {
    width: wp("97%"),
    height: hp(7),
    backgroundColor: "#F6F6F6",
    flexDirection: "row",
    justifyContent:"center",
    alignItems:"center",
    overflow: "hidden"
  },
  detalhesItem1Coluna1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  detalhesItem1Coluna2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around"
  },

  /* PARTE DE BAIXO */
  detalhesItem2: {
    width: wp("97%"),
    height: hp(7),
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent:"center",
    alignItems:"center",
    overflow: "hidden"
  },
  detalhesItem2Coluna1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  detalhesItem2Coluna2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around"
  },
  /*elementos*/
  txtPedido: {
    fontSize: wp("4.5%"),
    color: "#925E33",
    fontFamily: "Roboto-Regular",
    fontWeight: "bold"
  },
  txtValor: {
    fontSize: wp("4.2%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "800"
  }
});

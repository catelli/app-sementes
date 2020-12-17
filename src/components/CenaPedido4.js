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
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import SideMenu from "react-native-side-menu";
import CenaPedido4ItensParcela from "./Parcelas/CenaPedido4ItensParcela";
import BarraNavegacao from "./BarraNavegacao";
import Menu from "./Menu";
import { getUser, onSignOut } from "./Auth";
const spinner = require("../../imgs/spinner.png");
export default class CenaPedido4 extends Component {
  _isMounted = false;
  arrayParcelas = [];
  constructor(props) {
    super(props);
    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.addParcelas = this.addParcelas.bind(this);

    this.state = {
      listaItens: [],
      alertVisibility: false,
      modalVisiblePicker1: false,
      selectedParcelas: 1,
      selectedTotal: "",
      selectedObservacao: "",
      parcelas: [],
      usuarioLogado: {},
      totalParcelas: 10,
      /* menu */
      isOpen: false,
      selectedItem: "About"
    };
  }

  addParcelas = (dataVencimento, parcelaPercentual, index) => {
    let dataArray = this.state.parcelas;
    let checkBool = false;
    //console.log("percentual selecionado "+parseFloat(parcelaPercentual));
    //console.log("valor total "+parseFloat(this.state.selectedTotal));
    if (dataArray.length !== 0) {
      dataArray.forEach(element => {
        if (element.index === index ) {
          if(dataVencimento)
          element.dataVencimento = dataVencimento;
          if(parcelaPercentual) {
            element.parcelaPercentual = parcelaPercentual;
            let valorBase = (parseFloat(this.state.selectedTotal) * parseFloat(parcelaPercentual))/100;
            element.valorBase = valorBase;
          }
          checkBool = true;
        }
      });
    }
    if (checkBool){
      this.setState({
        parcelas: dataArray
      });
    }else {
      let valorBase = (parseFloat(this.state.selectedTotal) * parseFloat(parcelaPercentual))/100;
      dataArray.push({
        'dataVencimento': dataVencimento,
        'parcelaPercentual': parcelaPercentual,
        'valorBase': valorBase,
        'index': index
      });
      this.setState({
        parcelas: dataArray
      });
    }
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

  componentDidMount() {
    this._isMounted = true;
    this.userInformations();
    this.setState({
      selectedTotal: this.props.navigation.getParam('total')
    });
    loc(this);
  }

  componentWillMount() {
    rol();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setModalVisiblePicker1(visible) {
    this.setState({ modalVisiblePicker1: visible });
  }

  onPressActionPicker = (parcelas) => {
    if(parseInt(parcelas) < parseInt(this.state.selectedParcelas)){
      let inicio = parseInt(parcelas);
      let fim = parseInt(this.state.selectedParcelas) - 1;
      this.state.parcelas.splice(inicio,fim);
    }
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

  somaTotal(array){
    return array.reduce((a,b) => parseFloat(a) + parseFloat(b), 0);
  }

  checkDateValidAndReturnFormat(date){
    if(date) {     
      const momentObj = moment(date,'YYYY-MM-DD');
      if(momentObj.isValid()) {
        return momentObj.format('YYYY-MM-DD');
      }else{
        return false
      }
    }else{
      return null;
    }
    
  }

  checkParcelas() {
    const objParcelas = this.state.parcelas;    
    if(objParcelas.length === this.state.selectedParcelas) {
      const arrayParcelasPercentual = [];
      for(let key in objParcelas) {
        const currtentObj = objParcelas[key];
        const current = this.checkDateValidAndReturnFormat(currtentObj.dataVencimento);
        //console.log('key '+key);
        //console.log('sem this '+current);
        if(!current) {
          Alert.alert('Erro!',`Verifique a data digitada na parcela ${currtentObj.index}`,[{text: 'Ok'}],{ cancelable: false });
          return false;
        }
        
        if(!currtentObj.parcelaPercentual) {
          Alert.alert('Erro!',`Percentual digitado na parcela ${currtentObj.index} se encontra vazio.`,[{text: 'Ok'}],{ cancelable: false });
          return false;
        }else{
          let condition = new RegExp(/^\d*[0-9](\.\d*[0-9])?$/gi);
          let response = condition.test(currtentObj.parcelaPercentual);   
          if(!response) {
            Alert.alert('Erro!',`Digite um percentual válido na parcela ${currtentObj.index}`,[{text: 'Ok'}],{ cancelable: false });
            return false;
          }
        }
   
        if(key > 0) {
          const beforeCurrentObj = objParcelas[key-1];
          let beforeCurrent = this.checkDateValidAndReturnFormat(beforeCurrentObj.dataVencimento);
          console.log('anterior '+beforeCurrent);
          console.log('passando agora '+current);
          const isValidDate = moment(current).isAfter(beforeCurrent);
          if(!isValidDate) {
           // Alert.alert('Erro!',`Data da parcela ${currtentObj.index} não pode ser menor que a data da parcela ${beforeCurrentObj.index}.`,[{text: 'Ok'}],{ cancelable: false });
            return true;
          }
        }
        
        arrayParcelasPercentual.push(currtentObj.parcelaPercentual);
      }

      const somaTotalPercentual = this.somaTotal(arrayParcelasPercentual);

      if(somaTotalPercentual == 100){
        return true;
      }else{
        Alert.alert('Percentual %','A soma dos Percentuais(%) deve totalizar 100% do valor total.',[{text: 'Ok'}],{ cancelable: false });
        return false;
      }
    }else{
      Alert.alert('Erro!','Favor preencher todos as parcelas corretamente',[{ text: 'Ok'}],{ cancelable: false });
      return false;
    }
  }

  avancar(){
    const { navigation } = this.props;
    const response = this.checkParcelas();

    console.log("response "+response);
    if(response){
      navigation.navigate("pedido5",{
        insertId:this.props.navigation.getParam('insertId'),
        total: this.state.selectedTotal,
        observacao: this.state.selectedObservacao,
        parcelas: this.state.parcelas
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const menu = <Menu navigation={navigation} logado={this.state.usuarioLogado} logout={this.logout} />;
    
    let componentsParcelas = [];
    let componentsQuantidadeParcelas = [];
    let numeroParcelas = this.state.selectedParcelas;
    
    for(let i = 1; i <= numeroParcelas ; i++) {
      componentsParcelas.push(<CenaPedido4ItensParcela indice={i} addParcelas={this.addParcelas} key={i} />);
    }

    for(let i = 1; i <= this.state.totalParcelas ; i++) {
      componentsQuantidadeParcelas.push(
        <TouchableWithoutFeedback
          onPress={() => this.onPressActionPicker(i)}
          underlayColor="#dddddd"
          key={i}
        >
          <View style={styles.itemPickerModalDefinido}>
            <Text style={styles.textPickerModal}>{i} Parcela(s)</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    
    console.log(this.state.parcelas);
 
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
          <ScrollView style={{padding:"2.5%"}}>
            <View style={styles.viewItens}>
              <View style={styles.detalhesItens1}>
                <Text style={styles.txtTituloValor}>PEDIDO Nº {this.props.navigation.getParam('insertId')}</Text>
                <Text style={[styles.txtTituloValor, { marginTop:"6%"}]}>{this.props.navigation.getParam('itens')} ITENS</Text>
              </View>
              <View style={styles.detalhesItens2}>
                <Text style={styles.txtTituloValor}>TOTAL R$ {this.formatNumber(this.state.selectedTotal)}</Text>
                <Text style={[styles.txtTituloValor, {marginTop:"6%"}]}>ENTREGA {this.props.navigation.getParam('tipoEntrega')}</Text>
              </View>
            </View>   
            <TouchableOpacity onPress={() => {this.setModalVisiblePicker1(true)}}>
            <View style={styles.viewNewPicker}>       
                <TextInput
                  type={'numeric'}
                  style={[styles.inputSearch, {marginLeft: "1%",marginBottom:"4%"}]}
                  underlineColorAndroid="transparent"
                  placeholder="QUANTIDADE DE PARCELAS"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedParcelas => this.setState({ selectedParcelas })}
                  value={`${this.state.selectedParcelas}`}
                  editable={false}
                />
                <Image source={spinner} style={styles.spinnerStyle} />
            </View>
            </TouchableOpacity>  
            {componentsParcelas}
            <View style={styles.viewInputTextArea}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="OBSERVAÇÕES"
                  placeholderTextColor="#925E33"
                  style={[
                    styles.input,
                    styles.txtArea,
                    { paddingHorizontal: 10 }
                  ]}
                  onChangeText={selectedObservacao =>
                    this.setState({ selectedObservacao })
                  }
                  value={this.state.selectedObservacao}
                  numberOfLines={3}
                  multiline={true}
                />
            </View>
            <View style={styles.viewButton}>
              <TouchableHighlight
                onPress={() => {
                    this.avancar();
                }}
              >
                <View style={styles.botao}>
                  <Text style={styles.txtBotao}> AVANÇAR </Text>
                </View>
              </TouchableHighlight>
            </View>
          </ScrollView>

           {/* MODAL PICKER QUANTIDADE PARCELAS */}
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalVisiblePicker1}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
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
              <View style={styles.listaModalPicker}>
                {componentsQuantidadeParcelas}
              </View>
            </View>
          </Modal>
          
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
  container: { backgroundColor: "#FFF", flex: 1 },  
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
    marginVertical: "7%",
    justifyContent:"center"
  },
  txtBotao: {
    fontSize: wp("4.5%"),
    color: "#D2D926",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    marginBottom: "6.5%"
   },
   /*ITENS*/
   viewItens: {
    height: hp("12%"),
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: "1%",
    marginTop: "1%"
  },
  detalhesItens1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginVertical:"2%"
  },
  detalhesItens2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginVertical:"2%"
  },
  txtTituloValor: {
    fontSize: wp("4.5%"),
    color: "#925E33",
    fontWeight: "400",
  },  
  /*SELECT QUANTIDADE*/
  viewSelect:{
    width: wp("100%"),
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    padding: "1%",
    marginTop: "8%"
  },
  viewNewPicker: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: hp("8.5%"),
    borderColor: "#DDDDDD",
    borderWidth: 1,
    marginHorizontal: "1.5%",
    marginTop: "2.9%",
    marginBottom: "2%"
  }, 
  inputSearch: {
    flex: 1,
    fontSize: wp("4.5%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    color: "#979c9c"
  },
  spinnerStyle: {
    marginBottom: "3%",
    marginRight: "5%",
    height: hp("2%"),
    width: wp("4.5%"),
    resizeMode: "stretch",
    alignItems: "flex-start"
  },
  /* TEXTAREA */
  viewInputTextArea: {
    height: "auto",
    borderColor: "#DDDDDD",
    justifyContent: "flex-start",
    borderWidth: 1,
    padding: "1%",
    marginTop: "6%"
  },
  input: {
    fontSize: wp("4.5%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    color: "#925E33"
  },
  txtArea: {
    height: hp("22%"),
    justifyContent: "flex-start",
    textAlignVertical: "top"
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
    
    buttonStyle: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
    },
    
    /*modal picker*/
    listaModalPicker: {
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#FFF",
    height: "auto",
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
    itemPickerModal: {
    paddingHorizontal: "19%",
    paddingVertical: "3%",
    backgroundColor: "#FFF",
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1
    },
    itemPickerModalDefinido: {
    paddingVertical: "3%",
    backgroundColor: "#FFF",
    alignItems: "flex-start"
    },
    textPickerModal: {
    fontSize: wp("5%"),
    textAlign: "center",
    color: "#925E33",
    marginLeft: "30%"

    }

});

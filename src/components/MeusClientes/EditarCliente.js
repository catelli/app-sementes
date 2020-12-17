/* eslint-disable linebreak-style */
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
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInputMask } from 'react-native-masked-text';
import SideMenu from "react-native-side-menu";
import BarraNavegacao from "../BarraNavegacao";
import Menu from "../Menu";
import { getUser, onSignOut } from "../Auth";
import { initDB, closeDatabase, initDbPromise } from '../AuthDB';

const spinner = require("../../../imgs/spinner.png");

export default class EditarCliente extends Component {
  constructor(props) {
    super(props);
    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      modalVisiblePicker1: false,
      alertVisibility: false,

      idCliente: "",
      selectedTipo: "",
      selectedNome: "",
      selectedCpfCnpj: "",
      selectedRg: "",
      usuarioLogado:{},
      isNotNone: false,
      placeholder: "",
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

  fill(idCliente) {
    return new Promise(
    (resolve) => {
      initDB().then((db) => {
        db.transaction((tx) => {
          if(idCliente){
            tx.executeSql('SELECT * FROM clientes WHERE idapp = ?', [idCliente], (tx, clienteResult) => {
            const cliente = clienteResult.rows.item(0);
            console.log(cliente);
              if(cliente){
                this.setState({
                  idCliente: idCliente,
                  selectedTipo: cliente.tipo,
                  selectedNome: cliente.nome,
                  selectedCpfCnpj: cliente.cnpj_cpf,
                  selectedRg: cliente.rg,
                  isNotNone: cliente.tipo === 'CPF'?true:false,
                  placeholder: cliente.tipo,
                });
              }
            });
          }
          
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
  
  // eslint-disable-next-line react/sort-comp
  componentDidMount() {
    this.userInformations();
    const idCliente = this.props.navigation.getParam('idCliente')?
    this.props.navigation.getParam('idCliente'): "";
    this.fill(idCliente);
    loc(this);
  }

  componentWillMount() {
    rol();
  }

  setModalVisiblePicker1(visible) {
    this.setState({ modalVisiblePicker1: visible , selectedCpfCnpj: ""});
  }

  onPressActionPicker1 = Item => {
    this.setState({ selectedTipo: Item });
    if(Item === 'CNPJ'){
      this.setState({isNotNone: false, placeholder: 'CNPJ'})
    }else{
      this.setState({isNotNone: true, placeholder: 'CPF'})
    }
    this.setModalVisiblePicker1(!this.state.modalVisiblePicker1);
  };

  /* menu */
  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item
    });

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

  showCustomAlert(visible) {
    this.setState({ alertVisibility: visible });
    setTimeout(() => {
      this.setState({ alertVisibility: false });
      setTimeout(() => {
        this.props.navigation.navigate("meusClientes");
      }, 500);
    }, 3000);
  }

  clearCode(value) {
    value = value.toString().trim();                                                         
    value = value.replace(new RegExp('[,]','gi'), '');
    value = value.replace(new RegExp('[-]','gi'), '');
    value = value.replace(new RegExp('[/]','gi'), '');
    value = value.replace(new RegExp('[.][.]','gi'), '');
    value = value.replace(new RegExp('[.][.][.]','gi'), '');
    return value;   
  }

  async updateCliente() {
    const db = await initDbPromise();
    const valorRg = "";

    if(this.state.selectedTipo === 'CNPJ'){
      this.valorRg = null;
    }else{
      this.valorRg = this.state.selectedRg;
    } 
    try {
      const results = await db.executeSql(
        'UPDATE clientes SET nome=?, cnpj_cpf=?, tipo=?, rg=? WHERE idapp=?',
        [ 
          this.state.selectedNome,
          this.state.selectedCpfCnpj,
          this.state.selectedTipo,
          this.valorRg,
          this.props.navigation.getParam('idCliente')
        ]
      );
      if(results[0].rowsAffected > 0) {
        await db.close();
        this.showCustomAlert(true);
      }else{
        alert('Ocorreu um problema ao atualizar');
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
        menuPosition={"right"}
        edgeHitWidth={0}
      >
        <View style={styles.container}>
          <StatusBar backgroundColor="#33723D"/>
          <BarraNavegacao
            voltar
            navigation={navigation}
            toggle={this.toggle}
          />
          <ScrollView>
            <Text style={styles.txtTitulo}>Edição do Cliente(a): {this.props.navigation.getParam('nomeCliente')}</Text>
            <View style={styles.viewInputs}>
              <View style={styles.viewNewPicker}>
                <TextInput
                  style={[styles.inputSearch, { paddingHorizontal: "2.5%" }]}
                  underlineColorAndroid="transparent"
                  placeholder="TIPO"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedTipo => this.setState({selectedTipo})}
                  value={this.state.selectedTipo}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisiblePicker1(true);
                  }}
                >
                  <Image source={spinner} style={styles.spinnerStyle} />
                </TouchableOpacity>
              </View>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="NOME"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }]}
                onChangeText={selectedNome => this.setState({ selectedNome })}
                value={this.state.selectedNome}
              />
              <TextInputMask
                type={this.state.selectedTipo?this.state.selectedTipo.toLowerCase():'cpf'}
                underlineColorAndroid="transparent"
                placeholder={this.state.placeholder}
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }]}
                onChangeText={selectedCpfCnpj => {
                  let codeClear = this.clearCode(selectedCpfCnpj);
                  this.setState({ selectedCpfCnpj: codeClear });
                }}
                value={this.state.selectedCpfCnpj}
              />
              <TextInput
                keyboardType={'numeric'}
                disabled={true}
                underlineColorAndroid="transparent"
                placeholder="  RG"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }, !this.state.isNotNone && {display: 'none'}]}
                onChangeText={selectedRg => {
                  let rgPassado = this.clearCode(selectedRg);
                  this.setState({ selectedRg : rgPassado});
                }}
                value={this.state.selectedRg?this.state.selectedRg.toString():""}
              />
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
               onPress={async () => {        
                if(this.state.selectedCpfCnpj &&
                  this.state.selectedNome &&
                  this.state.selectedTipo
                  ){

                   this.updateCliente();
                
                }else{
                  Alert.alert('Não é possivel avançar',
                    'Favor, preencher todos os campos.',
                    [
                      {text: 'Ok'},
                    ],
                    { cancelable: false }
                  );
                }
              }}
              >
                <View style={styles.botao}>
                    <Text style={styles.txtBotao}> Editar </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {/* MODAL PICKER MODALIDADE */}
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
                <TouchableWithoutFeedback
                  onPress={() => this.onPressActionPicker1("CPF")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>Pessoa Fisica</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => this.onPressActionPicker1("CNPJ")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>Pessoa Jurídica</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Modal>
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
                  Cliente editado com sucesso!
                </Text>

                <Text style={styles.alertMessage}>
                  Não esqueça de realizar a sincronização dos dados na opção
                  *atualizar na aba menu.{" "}
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
    flex: 1,
    width: wp("100%"),
    height: hp("100%")
  },
  viewInputs: {
    flex: 4,
    justifyContent: "center",
    flexDirection: "column",
    padding: "2.5%"
  },
  input: {
    fontSize: wp("4.5%"),
    height: hp("8.5%") /* 50 */,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    borderColor: "#DDDDDD",
    borderWidth: 1,
    marginHorizontal: "1.5%",
    marginTop: "2.9%",
    marginBottom: "2%",
    color: "#979c9c"
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
  pickerInput: {
    width: "90%",
    fontSize: wp("14%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    color: "#925E33"
  },
  viewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  botao: {
    width: wp("50%"),
    height: hp("13%"),
    backgroundColor: "#018A3C",
    borderColor: "#FFF",
    borderWidth: 1,
    marginVertical: "5%",
    justifyContent:"center"
  },
  txtBotao: {
    fontSize: wp("5%"),
    color: "#D2D926",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    marginBottom: "5%"
  },
  txtTitulo: {
    fontSize: wp("4%"),
    color: "#925E33",
    textAlign: "center",
    marginTop: "5%",
    fontWeight: "500"
  },
  spinnerStyle: {
    marginVertical: "2%",
    marginHorizontal: "3%",
    height: hp("2%"),
    width: wp("4.5%"),
    resizeMode: "stretch",
    alignItems: "flex-start"
  },
  inputSearch: {
    flex: 1,
    fontSize: wp("4.5%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    color: "#979c9c"
  },

  /*modal picker*/

  listaModalPicker: {
    alignItems: "center",
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
    color: "#925E33"
  },
   /* MODAL MENSAGEM*/
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
  }
});

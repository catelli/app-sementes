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
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { TextInputMask } from 'react-native-masked-text';
import SideMenu from "react-native-side-menu";
import BarraNavegacao from "../BarraNavegacao";
import Menu from "../Menu";
import { getUser, onSignOut } from "../Auth";
import { initDB, closeDatabase, initDbPromise } from "../AuthDB";

const spinner = require("../../../imgs/spinner.png");

export default class AdicionarFazenda extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      modalVisible: false,
      modalVisiblePicker1: false,
      alertVisibility: false,

      selectedNomeFazenda: "",
      selectedCep: "",
      selectedMunicipio: "",
      selectedMunicipioId: 0,
      selectedEstado: "",
      selectedEndereco: "",
      selectedEmail: "",
      selectedTelefone: "",
      selectedComplemento: "",
      selectedIE:"",

      text: "",
      
      dataRegisterEstados: [],
      dataRegisterMunicipios: [],
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

  fill() {
    return new Promise(
    () => {
      const temp = [];
      initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM estados ORDER BY nome ASC', [], (tx, results) => {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            if(this._isMounted){
              this.setState({
                dataRegisterEstados: temp,
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

  // eslint-disable-next-line react/sort-comp
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

  setModalVisiblePicker1(visible) {
    this.setState({ modalVisiblePicker1: visible });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onPressActionPicker1 = async (rowItem) => {
    this.setState({
      selectedEstado: rowItem.sigla
    });
    const db = await initDbPromise();
    try {
      await db.transaction(async (tx) => {
        const [sq, results] = await tx.executeSql("SELECT * FROM cidades WHERE estado_id = ?",[rowItem.id]);
        let tempMunicipios = [];
        for (let i = 0; i < results.rows.length; ++i) {
          tempMunicipios.push(results.rows.item(i));
        }
        this.setState({
          dataRegisterMunicipios: tempMunicipios
        },() => {
          this.arrayholder = tempMunicipios;
        });
        this.setModalVisiblePicker1(!this.state.modalVisiblePicker1);
      });
      await db.close();
    } catch (error) {
      await db.close();
      throw new Error(`Something failed`);
    }
  };

  onPressAction = rowItem => {
    this.setState({
      selectedMunicipio: rowItem.nome,
      selectedMunicipioId: rowItem.id,
    });
    this.setModalVisible(!this.state.modalVisible);
  };

  listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "90%",
          backgroundColor: "#000"
        }}
      />
    );
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

  searchFilterFunction(text) {
    const newData = this.arrayholder.filter(item => {
      const itemData = item.nome.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataRegisterMunicipios: newData,
      text: text
    });
  }

  async buttonSave() {
    if (
        this.state.selectedNomeFazenda &&
        this.state.selectedCep &&
        this.state.selectedMunicipio &&
        this.state.selectedEstado &&
        this.state.selectedEndereco &&
        this.state.selectedEmail &&
        this.state.selectedTelefone && 
        this.state.selectedIE
    ) { 
      console.log('chegou aqui');

      const db = await initDbPromise();
      try {
        const results = await db.executeSql('INSERT INTO fazendas (idbanco, nome, email, cep, endereco, complemento, telefone, inscricao, codigoclifor, codigolocal, codigomunicipio, cliente_idapp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          0, 
          this.state.selectedNomeFazenda, 
          this.state.selectedEmail, 
          this.state.selectedCep, 
          this.state.selectedEndereco, 
          this.state.selectedComplemento, 
          this.state.selectedTelefone, 
          this.state.selectedIE, 
          null, 
          null, 
          this.state.selectedMunicipioId, 
          this.props.navigation.getParam('idCliente')
        ]
        );
        if(results[0].insertId) {
            this.showCustomAlert(true);
            await db.close();
        }else{
            await db.close();
            return 'erro';
        }

      } catch (error) {
        await db.close();
        throw new Error(`Something failed`);
      }
    }else{

      Alert.alert('Não foi possivel adicionar o item.',
        'Favor, verificar se os campos foram todos preenchidos.',
        [
          {text: 'Ok'},
        ],
        { cancelable: false }
      );
    }
  };

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
          <StatusBar backgroundColor="#33723D" />
          <BarraNavegacao
            voltar
            navigation={navigation}
            toggle={this.toggle}
          />
          <ScrollView>
            <Text style={styles.txtTitulo}>Adicionar Fazenda para {this.props.navigation.getParam('nomeCliente')}</Text>
            <View style={styles.viewInputs}>
            <TextInput
                underlineColorAndroid="transparent"
                placeholder="NOME DA FAZENDA"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: 10 }]}
                onChangeText={selectedNomeFazenda =>
                  this.setState({ selectedNomeFazenda })
                }
                value={this.state.selectedNomeFazenda}
              />
              <TextInputMask
                underlineColorAndroid="transparent"
                type={'zip-code'}
                placeholder="CEP"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }]}
                onChangeText={selectedCep => this.setState({ selectedCep })}
                value={this.state.selectedCep}
              />
              <View style={styles.viewNewPicker}>
                <TextInput
                  style={[styles.inputSearch, { paddingHorizontal: "2.5%",  position:"relative" , top:10 }]}
                  underlineColorAndroid="transparent"
                  placeholder="ESTADO"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedEstado =>
                    this.setState({ selectedEstado })
                  }
                  value={this.state.selectedEstado}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisiblePicker1(true);
                  }}
                >
                  <Image source={spinner} style={styles.spinnerStyle} />
                </TouchableOpacity>
              </View>

              <View style={styles.viewNewPicker}>
                <TextInput
                  style={[styles.inputSearch, { paddingHorizontal: "2.5%",  position:"relative" , top:10 }]}
                  underlineColorAndroid="transparent"
                  placeholder="MUNICIPIO"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedMunicipio =>
                    this.setState({ selectedMunicipio })
                  }
                  value={this.state.selectedMunicipio}
                />
                <TouchableOpacity
                  onPress={() => {
                    if(this.state.dataRegisterMunicipios.length) {
                      this.setModalVisible(true);
                    }else{
                      Alert.alert('Dados não existentes',
                        'Favor, clicar no menu de ESTADOS.',
                        [
                          {text: 'Ok'},
                        ],
                        { cancelable: false }
                      );
                
                    }                  
                  }}
                >
                  <Image source={spinner} style={styles.spinnerStyle} />
                </TouchableOpacity>
              </View>

              <TextInput
                underlineColorAndroid="transparent"
                placeholder="ENDEREÇO"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }]}
                onChangeText={selectedEndereco =>
                  this.setState({ selectedEndereco })
                }
                value={this.state.selectedEndereco}
              />

              <TextInput
                underlineColorAndroid="transparent"
                placeholder="COMPLEMENTO"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }]}
                onChangeText={selectedComplemento =>
                  this.setState({ selectedComplemento })
                }
                value={this.state.selectedComplemento}
              />
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="E-MAIL"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }]}
                onChangeText={selectedEmail => this.setState({ selectedEmail })}
                value={this.state.selectedEmail}
              />
              <TextInputMask
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99) '
                }}
                underlineColorAndroid="transparent"
                placeholder="TELEFONE"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }]}
                onChangeText={selectedTelefone =>
                  this.setState({ selectedTelefone })
                }
                value={this.state.selectedTelefone}
              />
              <TextInput
                keyboardType={'numeric'}
                disabled={true}
                underlineColorAndroid="transparent"
                placeholder="INSCRIÇÃO ESTADUAL"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }]}
                onChangeText={selectedIE => {
                  let iePassado = this.clearCode(selectedIE);
                  this.setState({ selectedIE : iePassado});
                }}
                value={this.state.selectedIE}
                editable={this.state.disabledIE}
              />
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={() => {
                  this.buttonSave();
                }}
              >
                <View style={styles.botao}>
                    <Text style={styles.txtBotao}> SALVAR </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {/* MODAL PICKER ESTADOS */}
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
                <FlatList
                  data={this.state.dataRegisterEstados}
                  renderItem={({ item }) => {
                      return (
                        <TouchableWithoutFeedback
                        onPress={() => this.onPressActionPicker1(item)}
                        underlayColor="#dddddd"
                        >
                        <View style={styles.itemPickerModal}>
                            <Text style={styles.textPickerModal}>
                            {item.nome}
                            </Text>
                        </View>
                        </TouchableWithoutFeedback>
                      );
                  }}
                  keyExtractor={(item) => item.sigla}
                  style={{ marginTop: 10 }}
                />
              </View>
            </View>
          </Modal>
          
           {/* MODAL PESQUISA*/}
           <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.containerModal}>
              <View style={styles.topoBotaoFechar}>
                <Text style={styles.textoClientes}>Cidades</Text>
                <Text
                  style={styles.textoFechar}
                  onPress={() => this.setModalVisible(!this.state.modalVisible)}
                >
                  Fechar
                </Text>
              </View>
              <View style={styles.topoModal}>
                <TextInput
                  style={styles.textInputStyleClass}
                  onChangeText={text => this.searchFilterFunction(text)}
                  value={this.state.text}
                  underlineColorAndroid="transparent"
                  placeholder="Pesquisar Cidades"
                  placeholderTextColor="#925E33"
                />
              </View>
              <View style={styles.listaModal}>
              <FlatList
                  data={this.state.dataRegisterMunicipios}
                  ItemSeparatorComponent={this.listViewItemSeparator}
                  renderItem={({ item }) => {
                    return (
                    <TouchableWithoutFeedback 
                      onPress={() => this.onPressAction(item)}
                      underlayColor="#dddddd"
                    >
                      <View style={styles.flatview}>
                        <Text style={styles.name}>{item.nome}</Text>
                      </View>
                    </TouchableWithoutFeedback >
                    );
                  }}
                  keyExtractor={(item) => item.id.toString()}
                  style={{ marginTop: 10 }}
                />
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
                  Fazenda cadastrada com sucesso!
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
    fontSize: wp("4%"),
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
    marginTop: "25%",
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

  /*modal*/
  containerModal: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5FCFF"
  },
  topoBotaoFechar: {
    height: hp("7.2%"),
    backgroundColor: "#409551",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: "1%",
    paddingHorizontal: "5%"
  },
  textoClientes: {
    fontSize: wp("7%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    color: "#FFF"
  },
  textoFechar: {
    fontSize: wp("5%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    color: "#FFF",
    marginTop: "1.5%"
  },
  topoModal: {
    marginHorizontal: "1.5%",
    marginTop: "1.5%"
  },
  textInputStyleClass: {
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    width: wp("97%"),
    height: hp("7.5%"),
    borderWidth: 1,
    borderColor: "#409551",
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    marginTop: "3%",
    fontSize: wp("4%")
  },
  listaModal: { flex: 4, margin: "1.5%" },
  flatview: {
    padding: "3.5%"
  },
  name: {
    fontFamily: "Roboto-Regular",
    fontSize: wp("5%"),
    textAlign: "left",
    marginLeft: "1.5%",
    color: "#925E33"
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

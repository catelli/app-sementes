/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Alert,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import moment from 'moment';
import SideMenu from "react-native-side-menu";
import BarraNavegacao from "./BarraNavegacao";
import Menu from "./Menu";
import { getUser, onSignOut } from "./Auth";
import { initDB, closeDatabase, initDbPromise } from './AuthDB';

const lixeira = require("../../imgs/delete.png");
const lupa = require("../../imgs/lupa.png");
const spinner = require("../../imgs/spinner.png");
export default class CenaPedido1 extends Component {
  _isMounted = false;
  constructor(props){
    super(props);

    /* menu */
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      modalVisible: false,
      modalVisiblePicker1: false,
      modalVisiblePicker2: false,
      modalVisiblePicker3: false,
      modalVisiblePicker4: false,

      text: "",

      dataRegister: [],
      dataRegisterFazendas: [],
      dataRegisterRegioes: [],
      dataRegisterPedidos: [],
      dataRegisterItensPedido: [],
      selectedCpfCnpj: "",
      selectedNome: "",
      selectedMP: "",
      selectedFazenda: "",
      selectedTipoEntrega: "",
      selectedRegiao: "",
      selectedComissao: "",
      idPedido: "",
      idCliente: "",
      idFazenda: "",
      codigoClifor: "",
      codigoLocal: "",
      usuarioLogado:{},
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

  async logout(){
    await onSignOut();
    this.props.navigation.navigate("MainSignin");
  }

  fill(insertId) {
    return new Promise(
    () => {
      const tempClientes = [];
      const tempRegioes = [];
      const tempPedidos = [];
      const tempItensPedidos = [];
      initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM clientes', [], (tx, results) => {
            for (let i = 0; i < results.rows.length; ++i) {
              tempClientes.push(results.rows.item(i));
            }
            if(this._isMounted){
              this.setState({
                dataRegister: tempClientes,
              },() => {
                this.arrayholder = tempClientes;
              });
            }
          });
          tx.executeSql('SELECT DISTINCT(regiao) FROM precos', [], (tx, resultss) => {
            for (let i = 0; i < resultss.rows.length; ++i) {
              tempRegioes.push(resultss.rows.item(i));
            }
            if(this._isMounted){
              this.setState({
                dataRegisterRegioes: tempRegioes,
              });
            }
          });
          tx.executeSql('SELECT * FROM pedidos', [], (tx, resultsss) => {
            for (let i = 0; i < resultsss.rows.length; ++i) {
              tempPedidos.push(resultsss.rows.item(i));
            }
            if(this._isMounted){
              this.setState({
                dataRegisterPedidos: tempPedidos,
              });
            }
          });

          tx.executeSql('SELECT * FROM itens_pedido', [], (tx, resultssss) => {
            for (let i = 0; i < resultssss.rows.length; ++i) {
              tempItensPedidos.push(resultssss.rows.item(i));
            }
            if(this._isMounted){
              this.setState({
                dataRegisterItensPedido: tempItensPedidos,
              });
            }
          });

          if(insertId){
            tx.executeSql('SELECT * FROM pedidos WHERE id = ?', [insertId], (tx, pedidoResult) => {
              const pedido = pedidoResult.rows.item(0);
              console.log(pedido);
              if(pedido){
                this.setState({
                  selectedCpfCnpj: pedido.cpf_cnpj,
                  selectedNome: pedido.nome_cliente,
                  selectedMP: pedido.modalidade_pagamento,
                  selectedFazenda: pedido.fazenda,
                  selectedTipoEntrega: pedido.tipo_entrega,
                  selectedRegiao: pedido.regiao,
                  selectedComissao: pedido.comissao,         
                  idPedido: pedido.id,
                  idCliente: pedido.id_cliente,
                  idFazenda: pedido.id_fazenda,
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
  
  componentDidMount() {
    this._isMounted = true;
    this.userInformations();
    const insertId = this.props.navigation.getParam('insertId')?this.props.navigation.getParam('insertId'): "";
    this.fill(insertId);
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

  setModalVisible(visible) {
    if(this.state.dataRegister.length === 0) {
      Alert.alert('Dados não existentes no aplicativo',
        'Favor, sincronizar os dados de clientes na área de atualizações ',
        [
          {text: 'Ok'},
        ],
        { cancelable: false }
      );
     }else{
      this.setState({ modalVisible: visible });
     }
  }

  setModalVisiblePicker1(visible) {
    if(this.state.dataRegisterFazendas.length) {
      if(this.state.selectedCpfCnpj && this.state.selectedNome) {
        this.setState({ modalVisiblePicker1: visible });
      }else{
        Alert.alert('Dados não existentes no aplicativo',
          'Favor, selecionar o cliente ',
          [
            {text: 'Ok'},
          ],
          { cancelable: false }
        );
      }
    }else{
      Alert.alert('Dados não existentes no aplicativo',
        'Favor, sincronizar FAZENDAS na área de atualizações ou verificar com o administrador do sistema.',
        [
          {text: 'Ok'},
        ],
        { cancelable: false }
      );
    }
  }

  setModalVisiblePicker2(visible) {
    this.setState({ modalVisiblePicker2: visible });
  }

  setModalVisiblePicker3(visible) {
    this.setState({ modalVisiblePicker3: visible });
  }

  setModalVisiblePicker4(visible) {
    if(this.state.dataRegisterRegioes.length === 0) {
      Alert.alert('Dados não existentes no aplicativo',
        'Favor, sincronizar os dados de Cultivares e Preços na área de atualizações ',
        [
          {text: 'Ok'},
        ],
        { cancelable: false }
      );
     }else{
      this.setState({ modalVisiblePicker4: visible });
     }
  }

  selectedWidthDimensions = () => {
    if (dimension.width === 1080) {
      return hp("91.5%");
    } else if (dimension.width === 1600) {
      return hp("96.3%");
    } else if (dimension.width === 2560) {
      return hp("97.6%");
    }
  };

  async onPressAction(rowItem) {
    console.log(rowItem);
    this.setState({
      selectedCpfCnpj: rowItem.cnpj_cpf,
      selectedNome: rowItem.nome,
      idCliente: rowItem.idapp,
      codigoClifor: rowItem.codigoclifor,
      selectedFazenda: ""
    });
    this.setModalVisible(!this.state.modalVisible);

    const parametro = "";
    const valorParametro = "";

    if(rowItem.idbanco){
      this.parametro = "codigoclifor";
      this.valorParametro = rowItem.codigoclifor;
    }else{
      this.parametro = "cliente_idapp";
      this.valorParametro = rowItem.idapp;
    }

    const db = await initDbPromise();
    try {
      await db.transaction(async (tx) => {
        const [sq, results] = await tx.executeSql(`SELECT * FROM fazendas where ${this.parametro} = ?`,[this.valorParametro]);
        let tempFazendas = [];
        for (let i = 0; i < results.rows.length; ++i) {
          tempFazendas.push(results.rows.item(i));
        }
        this.setState({ dataRegisterFazendas: tempFazendas });
      });
      await db.close();
    } catch (error) {
      await db.close();
      throw new Error(`Something failed`);
    }
  };

  onPressActionPicker1 = rowItem => {
    this.setState({
      selectedFazenda: rowItem.nome,
      idFazenda: rowItem.idapp,
      codigoLocal: rowItem.codigolocal
    });
    this.setModalVisiblePicker1(!this.state.modalVisiblePicker1);
  };

  onPressActionPicker2 = Item => {
    this.setState({
      selectedMP: Item
    });
    this.setModalVisiblePicker2(!this.state.modalVisiblePicker2);
  };

  onPressActionPicker3 = Item => {
    this.setState({
      selectedTipoEntrega: Item
    });
    this.setModalVisiblePicker3(!this.state.modalVisiblePicker3);
  };

  onPressActionPicker4 = Item => {
    this.setState({
      selectedRegiao: Item.regiao
    });
    this.setModalVisiblePicker4(!this.state.modalVisiblePicker4);
  };

  listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: hp("0.1%"),
          width: wp("97%"),
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

  searchFilterFunction(text) {
    const newData = this.arrayholder.filter(item => {
      const itemData = item.nome.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataRegister: newData,
      text: text
    });
  }

  async insertPedido() {
    const db = await initDbPromise();
    try {
      let res = "";    
        const results = await db.executeSql(
          'INSERT INTO pedidos (id_cliente, id_fazenda, codigoclifor, codigolocal, cpf_cnpj, nome_cliente, fazenda, modalidade_pagamento, tipo_entrega, regiao, data, id_usuario, comissao) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            this.state.idCliente, 
            this.state.idFazenda,
            this.state.codigoClifor,
            this.state.codigoLocal, 
            this.state.selectedCpfCnpj, 
            this.state.selectedNome, 
            this.state.selectedFazenda, 
            this.state.selectedMP, 
            this.state.selectedTipoEntrega, 
            this.state.selectedRegiao,
            moment().format("DD/MM/YYYY"),
            this.state.usuarioLogado.id,
            this.state.selectedComissao?this.state.selectedComissao: 0 
          ]
        );
        if(results[0].insertId){
          this.setState({idPedido: results[0].insertId});
          await db.close();
          return results[0].insertId;
        }else{
          await db.close();
          return 'erro';
        }
  
    } catch (error) {
      await db.close();
      throw new Error(`Something failed`);
    }
  }


  async updatePedido() {
    const db = await initDbPromise();
    try {
    const results = await db.executeSql(
      'UPDATE pedidos SET id_cliente=?, id_fazenda=?, cpf_cnpj=?, nome_cliente=?, fazenda=?, modalidade_pagamento=?, tipo_entrega=?, regiao=?, data=?, id_usuario=?, comissao=? WHERE id=?',
      [ 
        this.state.idCliente, 
        this.state.idFazenda, 
        this.state.selectedCpfCnpj, 
        this.state.selectedNome, 
        this.state.selectedFazenda, 
        this.state.selectedMP, 
        this.state.selectedTipoEntrega, 
        this.state.selectedRegiao,
        moment().format("DD/MM/YYYY"),
        this.state.usuarioLogado.id,
        this.state.selectedComissao ? this.state.selectedComissao : 0,
        this.state.idPedido
      ]);

      if(results[0].rowsAffected > 0) {
        return this.state.idPedido; 
      }else{
        alert('Ocorreu um problema ao atualizar');
      }
    } catch (error) {
      await db.close();
      throw new Error(`Something failed`);
    }
  }


  async remove(idPedido) {
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
    }finally{
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
          text: 'Sim',
          onPress: async () => {
            const response = await this.remove(idPedido);
            if(response){
              this.props.navigation.replace('meusPedidos');
            }   
          },
        },
        {text: 'Não', onPress: () => null, style: 'cancel'}
      ],
      { cancelable: false }
    );
  } 

  render() {
    const { navigation } = this.props;
    const menu = <Menu navigation={navigation} logado={this.state.usuarioLogado} logout={this.logout}/>;
    const isInsertIn = this.props.navigation.getParam('insertId');

    let button;
    if (isInsertIn) {
      button = <View style={[{flex: 0.1}]}>
                  <TouchableOpacity onPress={async () => await this.delete(isInsertIn)}>
                    <Image source={lixeira} style={styles.imageStyleDelete} />  
                  </TouchableOpacity>
               </View>;
    } else {
      button = null;
    }
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
            estiloGlobal={styles.titulo}
            voltar
            navigation={navigation}
            toggle={this.toggle}
          />
          <ScrollView>
            <View style={[{flex:1 , flexDirection:"row"}]}>
              <View style={[{flex: 1, justifyContent: "center"}]}>
                <Text style={[styles.txtTitulo, {marginLeft:"1%"}]}>{this.props.navigation.getParam('insertId')?'EDITAR ':'NOVO '}PEDIDO</Text>
              </View> 
              {button}
            </View>
            <View style={styles.viewInputs}>
              <TouchableOpacity onPress={() => this.setModalVisible(true)}>
              <View style={styles.sectionStyle}>
                <TextInput
                  style={[styles.inputSearch, { marginLeft: "1%", marginBottom:"4%" }]}
                  underlineColorAndroid="transparent"
                  placeholder="CPF / CNPJ"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedCpfCnpj =>
                    this.setState({ selectedCpfCnpj })
                  }
                  value={this.state.selectedCpfCnpj}
                  editable={false}
                />
                  <Image source={lupa} style={styles.imageStyle} />
              </View>
              </TouchableOpacity>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="NOME"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }]}
                onChangeText={selectedNome => this.setState({ selectedNome })}
                value={this.state.selectedNome}
                editable={false}
              />
              <TouchableOpacity onPress={() => { this.setModalVisiblePicker1(true)}}>
              <View style={styles.viewNewPicker}>
                <TextInput
                  style={[styles.inputSearch, { marginLeft: "1%", marginBottom:"4%" }]}
                  underlineColorAndroid="transparent"
                  placeholder="NOME DA FAZENDA"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedFazenda =>
                    this.setState({ selectedFazenda })
                  }
                  value={this.state.selectedFazenda}
                  editable={false}
                />
                <Image source={spinner} style={styles.spinnerStyle} />
              </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.setModalVisiblePicker2(true) }}>
              <View style={styles.viewNewPicker}>       
                <TextInput
                  style={[styles.inputSearch, { marginLeft: "1%",marginBottom:"4%"}]}
                  underlineColorAndroid="transparent"
                  placeholder="MODALIDADE PAGAMENTO"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedMP => this.setState({ selectedMP })}
                  value={this.state.selectedMP}
                  editable={false}
                />
                <Image source={spinner} style={styles.spinnerStyle} />
              </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.setModalVisiblePicker3(true);}}>    
                <View style={styles.viewNewPicker}>
                  <TextInput
                    style={[styles.inputSearch, { marginLeft: "1%", marginBottom:"4%" }]}
                    underlineColorAndroid="transparent"
                    placeholder="TIPO DE ENTREGA"
                    placeholderTextColor="#925E33"
                    onChangeText={selectedTipoEntrega => this.setState({ selectedTipoEntrega })}
                    value={this.state.selectedTipoEntrega}
                    editable={false}
                  />
                  <Image source={spinner} style={styles.spinnerStyle} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {this.setModalVisiblePicker4(true);}}>    
                <View style={styles.viewNewPicker}>
                  <TextInput
                    style={[styles.inputSearch, { marginLeft: "1%", marginBottom:"4%" }]}
                    underlineColorAndroid="transparent"
                    placeholder="REGIÕES"
                    placeholderTextColor="#925E33"
                    onChangeText={selectedRegiao => this.setState({ selectedRegiao })}
                    value={this.state.selectedRegiao}
                    editable={false}
                  />
                  <Image source={spinner} style={styles.spinnerStyle} />
                </View>
              </TouchableOpacity>
              <TextInput
                keyboardType={"decimal-pad"}
                underlineColorAndroid="transparent"
                placeholder="COMISSÃO %"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%" }]}
                onChangeText={selectedComissao => this.setState({ selectedComissao })}
                value={this.state.selectedComissao.toString()}
              />
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                onPress={async () => {        
                  if(this.state.selectedCpfCnpj && 
                    this.state.selectedNome && 
                    this.state.selectedFazenda &&
                    this.state.selectedMP && 
                    this.state.selectedTipoEntrega && 
                    this.state.selectedRegiao){

                    if(this.state.idPedido){
                      let updateId = await this.updatePedido();
                      this.props.navigation.push('listaPedidos', { 
                        regiao: this.state.selectedRegiao, 
                        insertId : updateId,
                        tipoEntrega: this.state.selectedTipoEntrega, 
                      });
                    }else{
                      let insereId = await this.insertPedido();
                      this.props.navigation.navigate('pedido2', { 
                        regiao: this.state.selectedRegiao, 
                        tipoEntrega: this.state.selectedTipoEntrega,
                        insertId : insereId
                      });
                    }
                    
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
                  <Text style={styles.txtBotao}> AVANÇAR </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

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
                <Text style={styles.textoClientes}>Clientes</Text>
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
                  placeholder="Pesquisar Clientes"
                  placeholderTextColor="#925E33"
                />
              </View>
              <View style={styles.listaModal}>
              <FlatList
                  data={this.state.dataRegister}
                  ItemSeparatorComponent={this.listViewItemSeparator}
                  renderItem={({ item }) => {
                    return (
                    <TouchableWithoutFeedback 
                      onPress={() => this.onPressAction(item)}
                      underlayColor="#dddddd"
                    >
                      <View style={styles.flatview}>
                        <Text style={styles.name}>{item.nome}</Text>
                        <Text style={styles.cpf}>{item.cnpj_cpf}</Text>
                      </View>
                    </TouchableWithoutFeedback >
                    );
                  }}
                  keyExtractor={(item) => item.idapp.toString()}
                  style={{ marginTop: 10 }}
                />
              </View>
            </View>
          </Modal>

          {/* MODAL PICKER NOME_DA_FAZENDA */}
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
                  data={this.state.dataRegisterFazendas}
                  renderItem={({ item }) => {
                    return (
                    <TouchableWithoutFeedback
                      onPress={() => this.onPressActionPicker1(item)}
                      underlayColor="#dddddd"
                    >
                      <View style={{padding:"2.5%",justifyContent:"flex-start"}}>
                        <Text style={styles.name}>{item.nome}</Text>
                        <Text style={styles.cpf}>{item.inscricao}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                    );
                  }}
                  keyExtractor={(item) =>  item.inscricao}
                  style={{ marginTop: 10 }}
                />
              </View>
            </View>
          </Modal>

          {/* MODAL PICKER MODALIDADE_PAGAMENTO */}
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalVisiblePicker2}
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
                  onPress={() => this.onPressActionPicker2("PRAZO")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>À Prazo</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => this.onPressActionPicker2("VISTA")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>À Vista</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Modal>

          {/* MODAL PICKER TIPO_ENTREGA */}
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalVisiblePicker3}
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
                  onPress={() => this.onPressActionPicker3("CIF")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>CIF</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => this.onPressActionPicker3("FOB")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>FOB</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Modal>

          {/* MODAL PICKER REGIAO */}
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalVisiblePicker4}
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
                  data={this.state.dataRegisterRegioes}
                  renderItem={({ item }) => {
                    return (
                    <TouchableWithoutFeedback
                      onPress={() => this.onPressActionPicker4(item)}
                      underlayColor="#dddddd"
                    >
                      <View style={styles.itemPickerModal}>
                        <Text style={styles.textPickerModal}>
                          {item.regiao}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    );
                  }}
                  keyExtractor={(item) =>  item.regiao}
                  style={{ marginTop: 10 }}
                />

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
  txtTitulo: {
    fontSize: wp("4%"),
    color: "#925E33",
    textAlign: "center",
    marginTop: 25,
    fontWeight: "500"
  },
  sectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#DDDDDD",
    borderWidth: 1,
    width: this.selectedWidthDimensions,
    height: hp("8.5%"),
    marginHorizontal: "1.5%",
    marginTop: "2.9%",
    marginBottom: "2%"
  },
  imageStyle: {
    marginRight: "4%",
    marginBottom: "3%",
    height: hp("4%"),
    width: wp("6.5%"),
    resizeMode: "stretch",
    alignItems: "flex-start"
  },
  imageStyleDelete: {
    height: hp("4%"),
    width: wp("6.5%"),
    resizeMode: "stretch",
    marginTop:"50%",
  },
  spinnerStyle: {
    marginBottom: "3%",
    marginRight: "5%",
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
    marginLeft: "1%",
    color: "#925E33"
  },
  cpf: {
    fontFamily: "Roboto-Regular",
    fontSize: wp("4%"),
    color: "#409551",
    textAlign: "left",
    marginLeft: "1%"
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
  }
});



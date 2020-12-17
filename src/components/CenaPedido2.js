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
  Text,
  ScrollView,
  Image,
  Modal,
  Alert,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableHighlight
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { RadioGroup } from 'react-native-btr';
import SideMenu from "react-native-side-menu";
import BarraNavegacao from "./BarraNavegacao";
import Menu from "./Menu";
import { getUser, onSignOut } from "./Auth";
import { initDB, closeDatabase, initDbPromise } from "./AuthDB";

const lupa = require("../../imgs/lupa.png");
const spinner = require("../../imgs/spinner.png");

export default class CenaPedido2 extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
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
      dataRegisterFormula: [],
      selectedCultivar: "",
      selectedIdCultivar: 0,

      selectedIdItensPedido: "",

      selectedArea: "",
      selectedEspacamento: "",
      selectedPlantasMetro: "",
      selectedModalidade: "",
      selectedQuantidade: "",
      selectedQuantidadeSemArredondamento: "",
      selectedTotal: "",
      selectedPercentual: "",
      selectedTotalPercentual: "", 
      selectedTipoPercentual: "", 
      selectedArredondamento: "", 
      isDisableButton: false,
      isDisplayNone: false,
      usuarioLogado:{},

      valueTemp:"",

      radioButtons: [
        {
          label: 'Acréscimo',
          value: 'acrescimo',
          checked: true,
          color: '#925E33',
          disabled: false,
          flexDirection: 'row',
          size: wp(3)
        },
        {
          label: 'Desconto',
          value: 'desconto',
          checked: false,
          color: '#925E33',
          disabled: false,
          flexDirection: 'row',
          size: wp(3)
 
        }
      ],
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

  formatNumber(amount, decimalCount = 2, decimal = ",", thousands = "."){
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      const negativeSign = amount < 0 ? "-" : "";
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  };

  fill() {
    return new Promise(
    (resolve) => {
      const { navigation } = this.props;
      const regiaoPedido = navigation.getParam('regiao');
      const tempCultivares = [];
      initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM precos WHERE regiao = ?', [regiaoPedido], (tx, results) => {
            for (let i = 0; i < results.rows.length; ++i) {
              tempCultivares.push(results.rows.item(i));
            }
            if(this._isMounted){
              this.setState({
                dataRegister: tempCultivares,
              },() => {
                this.arrayholder = tempCultivares;
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
    this.setState({ modalVisible: visible });
  }

  setModalVisiblePicker1(visible) {
    this.setState({ modalVisiblePicker1: visible });
  }

  setModalVisiblePicker2(visible) {
    this.setState({ modalVisiblePicker2: visible });
  }

  setModalVisiblePicker3(visible) {
    this.setState({ modalVisiblePicker3: visible });
  }

  setModalVisiblePicker4(visible) {
    this.setState({ modalVisiblePicker4: visible });
  }

  onPressAction = rowItem => {
    this.setState({
      selectedCultivar: rowItem.cultivar,
      selectedIdCultivar: rowItem.id
    });
    this.setState({isDisableButton:false});
    this.setState({isDisplayNone: false});
    this.setModalVisible(!this.state.modalVisible);
  };

  onPressActionPicker1 = rowItem => {
    this.setState({
      selectedEspacamento: rowItem
    });
    this.setState({isDisableButton:false});
    this.setState({isDisplayNone:false});
    this.setModalVisiblePicker1(!this.state.modalVisiblePicker1);
  };

  onPressActionPicker2 = (item) => {
    this.setState({
      selectedModalidade: item
    });
    this.setState({isDisableButton: false});
    this.setState({isDisplayNone: false});
    this.setModalVisiblePicker2(!this.state.modalVisiblePicker2);
  };

  onPressActionPicker4 = (item) => {
    this.setState({
      selectedArredondamento: item
    });
    this.setState({isDisableButton: false});
    this.setState({isDisplayNone: false});
    this.setModalVisiblePicker4(!this.state.modalVisiblePicker4);
  };

  onPressActionPicker3 = (result) => {
    this.setModalVisiblePicker3(!this.state.modalVisiblePicker3);
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

  searchFilterFunction(text) {
    const newData = this.arrayholder.filter(item => {
      const itemData = item.cultivar.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataRegister: newData,
      text: text
    });
  }

  selectedItemRadioButton(){
    let selectedItem = this.state.radioButtons.find(e => e.checked == true);
    selectedItem = selectedItem ? selectedItem.value : this.state.radioButtons[0].value;
    return selectedItem;
  }

 async buttonSave() {

  if (this.state.selectedCultivar && 
      this.state.selectedArea && 
      this.state.selectedModalidade && 
      this.state.selectedEspacamento && 
      this.state.selectedPlantasMetro && 
      this.state.selectedQuantidade && 
      this.state.selectedTotal) { 
      const db = await initDbPromise(); 
      try {

          let res = "";   

          if(!this.state.selectedIdItensPedido){

            const results = await db.executeSql(
              'INSERT INTO itens_pedido (id_preco, cultivar, area, modalidade, espacamento, plantas_metro, bags, id_pedido, total, total_percentual, tipo_percentual, percentual) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
              [ this.state.selectedIdCultivar, 
                this.state.selectedCultivar, 
                this.state.selectedArea, 
                this.state.selectedModalidade, 
                this.state.selectedEspacamento, 
                this.state.selectedPlantasMetro, 
                this.state.selectedQuantidade,
                this.props.navigation.getParam('insertId'), 
                this.state.selectedTotal,
                this.state.selectedTotalPercentual, 
                this.state.selectedTipoPercentual,
                this.state.selectedPercentual]
            );
            if(results[0].insertId){
              this.setState({selectedIdItensPedido: results[0].insertId})
              await db.close();
              Alert.alert(
                "Adicionar mais Itens?",
                "Clique 'SIM' para adicionar mais itens, ou clique 'NÃO' para prosseguir...",
                [
                  {
                    text: "NÃO",
                    onPress: () => this.props.navigation.push('listaPedidos', { 
                      regiao: this.props.navigation.getParam('regiao'),
                      insertId : this.props.navigation.getParam('insertId'),
                      tipoEntrega: this.props.navigation.getParam('tipoEntrega')
                    }),
                    style: "cancel"
                  },
                  {
                    text: "SIM",
                    onPress: () => this.props.navigation.push('pedido2', {
                    regiao: this.props.navigation.getParam('regiao'), 
                    tipoEntrega: this.props.navigation.getParam('tipoEntrega'),
                    insertId : this.props.navigation.getParam('insertId')}),
                  }
                ]
              );
            }else{
  
              console.log("deu erro");
              await db.close();
              return 'erro';
            }            
          }else{
            //user_name=?, user_contact=? , user_address=?
            const results = await db.executeSql(
              'UPDATE itens_pedido SET id_preco=?, cultivar=?, area=?, modalidade=?, espacamento=?, plantas_metro=?, bags=?, id_pedido=?, total=?, total_percentual=?, tipo_percentual=?, percentual=? WHERE id=?',
              [ 
                this.state.selectedIdCultivar, 
                this.state.selectedCultivar, 
                this.state.selectedArea, 
                this.state.selectedModalidade, 
                this.state.selectedEspacamento, 
                this.state.selectedPlantasMetro, 
                this.state.selectedQuantidade,
                this.props.navigation.getParam('insertId'), 
                this.state.selectedTotal,
                this.state.selectedTotalPercentual, 
                this.state.selectedTipoPercentual,
                this.state.selectedPercentual,
                this.state.selectedIdItensPedido
              ]);

              console.log("result update: "+ results);

              if(results[0].rowsAffected > 0) {
                this.props.navigation.push('listaPedidos', { 
                  insertId : this.props.navigation.getParam('insertId'),
                  tipoEntrega: this.props.navigation.getParam('tipoEntrega')
                });
              }else{
                alert('Updation Failed');
              }
          }
    
      } catch (error) {
        await db.close();
        throw new Error(`Something failed`);
      }
    }else{
      Alert.alert('Não foi possivel adicionar o item.',
        'Favor, verificar se o calculo foi feito e os campos foram todos preenchidos.',
        [
          {text: 'Ok'},
        ],
        { cancelable: false }
      );
    }
  }

  async buttonCalcular(){
    const { navigation } = this.props;
    const idCultivar = this.state.selectedIdCultivar;
    const tipoEntrega = navigation.getParam('tipoEntrega');
    const area = this.state.selectedArea;
    const espacamento = this.state.selectedEspacamento;
    const plantas = this.state.selectedPlantasMetro;
    const modalidade = this.state.selectedModalidade;
    this.setState({isDisableButton:true});
    if(idCultivar && area && espacamento && plantas && modalidade) {
      let valorModalidade = 0;
      let valorModalidadeRoyalties = "";
      let valorTotalGermoplasmaRoyalties = 0;
      let totalFrete = 0;
      const db = await initDbPromise();
      try {
        await db.transaction(async (tx) => {
          const [sq, results] = await tx.executeSql('SELECT * FROM precos where id = ?',[idCultivar]);
          
          const cultivarPreco = results.rows.item(0);

          switch(modalidade) {
            case 'PRIMETECH': 
              this.valorModalidade = parseFloat(90);
              this.valorModalidadeRoyalties = parseFloat(cultivarPreco.prime_tec_germoplasma) + parseFloat(cultivarPreco.royalties) ; 
            break;
            case 'PRIMEPRO': 
              this.valorModalidade = parseFloat(95);
              this.valorModalidadeRoyalties = parseFloat(cultivarPreco.prime_pro_germoplasma) + parseFloat(cultivarPreco.royalties); 
            break;
            case 'PRIMETOTALSEED': 
              this.valorModalidade = parseFloat(95);
              this.valorModalidadeRoyalties = parseFloat(cultivarPreco.prime_pro_germoplasma) + parseFloat(cultivarPreco.royalties); 
            break;
            case 'PADRAO': 
              this.valorModalidade = parseFloat(85);
              this.valorModalidadeRoyalties = parseFloat(cultivarPreco.prime_tec_germoplasma) + parseFloat(cultivarPreco.royalties); 
            break;
          }

          const plantasModalidade = (parseFloat(plantas) / (parseFloat(this.valorModalidade)/parseFloat(100)));
          const areaMetros = parseFloat(area) * parseFloat(10000);
          const x = (areaMetros/(parseFloat(espacamento)/parseFloat(100)));
          const y = x * plantasModalidade;
          let quantidade = 0;
          if(this.state.selectedArredondamento === 'baixo'){
            quantidade = Math.floor(y/parseFloat(5500000));
          }else{
            quantidade = Math.ceil(y/parseFloat(5500000));
          }

          const qtdSemArr = y/parseFloat(5500000);
               
          if(tipoEntrega === 'CIF') {
            //ja esta sendo passado o valor do frete por bag
            this.totalFrete = parseFloat(cultivarPreco.frete) * quantidade;
          }else{
            this.totalFrete = 0;
          }
          
          this.valorTotalGermoplasmaRoyalties = (this.valorModalidadeRoyalties * quantidade) + this.totalFrete;   
          this.setState({ 
            selectedQuantidade: quantidade.toString(), 
            selectedQuantidadeSemArredondamento: "Qtd de bags: "+qtdSemArr.toFixed(2).toString(),
            selectedTotal: this.valorTotalGermoplasmaRoyalties.toString(),
            isDisplayNone: true
          });
        });
        await db.close();

      } catch (error) {
        await db.close();
        throw new Error(`Something failed`);
      }
    }else{
      Alert.alert('Não foi possivel fazer o calculo',
        'Favor, preencher todos os campos.',
        [
          {text: 'Ok'},
        ],
          { cancelable: false }
      );
    }
  }

  buttonCalcularPercentual() {
    const total          = this.state.selectedTotal;
    const tipoPercentual = this.selectedItemRadioButton();
    this.setState({ selectedTipoPercentual: tipoPercentual });
    
    const x = (parseFloat(total) * parseFloat(this.state.selectedPercentual))/100;
    const novoValor= 0;
    if(tipoPercentual === 'acrescimo') {
      this.novoValor = parseFloat(total) + parseFloat(x);
    } else {
      this.novoValor = total - x;
    }

    Alert.alert(
      `Novo Valor : R$ ${this.formatNumber(parseFloat(this.novoValor))} `,
      'Deseja modificar o valor ?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Ok',
          onPress:() => this.setState({selectedTotalPercentual: parseFloat(this.novoValor)}),
        }
      ],
      { cancelable: false }
    );
  
  }

  render() {
    // eslint-disable-next-line no-return-assign
    const { navigation } = this.props;
    const menu = <Menu navigation={navigation} logado={this.state.usuarioLogado} logout={this.logout}/>;
    
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
            <Text style={styles.txtTitulo}>PEDIDO Nº {this.props.navigation.getParam('insertId')}</Text>
            <View style={styles.viewInputs}>
              <View style={styles.sectionStyle}>
                <TextInput
                  style={[styles.inputSearch, { paddingHorizontal: "2.5%", position: "relative", top: 10 }]}
                  underlineColorAndroid="transparent"
                  placeholder="CULTIVAR"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedCultivar => 
                      this.setState({ selectedCultivar })                
                  }
                  value={this.state.selectedCultivar}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible(true);
                  }}
                >
                  <Image source={lupa} style={[styles.imageStyle]} />
                </TouchableOpacity>
              </View>
              
            <View style={styles.viewInputsCalculator}> 
              <TextInput
                keyboardType={"numeric"}
                underlineColorAndroid="transparent"
                placeholder="ÁREA ha"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%", backgroundColor: "#FFFFFF" }]}
                onChangeText={selectedArea => {
                    this.setState({ selectedArea });
                    this.setState({isDisableButton:false});
                    this.setState({isDisplayNone: false});
                  }
                }
                value={this.state.selectedArea}
              />

              <View style={[styles.viewNewPicker,{ backgroundColor: "#FFFFFF" }]}>
                <TextInput
                  style={[styles.inputSearch, { paddingHorizontal: "2.5%" }]}
                  underlineColorAndroid="transparent"
                  placeholder="MODALIDADE"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedModalidade =>
                    this.setState({ selectedModalidade })
                  }
                  value={this.state.selectedModalidade}
                  editable={false}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisiblePicker2(true);
                  }}
                >
                  <Image source={spinner} style={styles.spinnerStyle} />
                </TouchableOpacity>
              </View>
              <View style={[styles.viewNewPicker, { backgroundColor: "#FFFFFF" }]}>
                <TextInput
                  style={[styles.inputSearch, { paddingHorizontal: "2.5%" }]}
                  underlineColorAndroid="transparent"
                  placeholder="ESPAÇAMENTO ENTRE LINHAS"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedEspacamento =>
                    this.setState({ selectedEspacamento })
                  }
                  value={this.state.selectedEspacamento}
                  editable={false}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisiblePicker1(true);
                  }}
                >
                  <Image source={spinner} style={styles.spinnerStyle} />
                </TouchableOpacity>
              </View>
              <View style={[styles.viewNewPicker, { backgroundColor: "#FFFFFF" }]}>
                <TextInput
                  style={[styles.inputSearch, { paddingHorizontal: "2.5%" }]}
                  underlineColorAndroid="transparent"
                  placeholder="ARREDONDAMENTO"
                  placeholderTextColor="#925E33"
                  onChangeText={selectedArredondamento =>
                    this.setState({ selectedArredondamento })
                  }
                  value={this.state.selectedArredondamento}
                  editable={false}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisiblePicker4(true);
                  }}
                >
                  <Image source={spinner} style={styles.spinnerStyle} />
                </TouchableOpacity>
              </View>
              <TextInput
                keyboardType={'numeric'}
                underlineColorAndroid="transparent"
                placeholder="PLANTAS POR METRO"
                placeholderTextColor="#925E33"
                style={[styles.input, { paddingHorizontal: "2.5%", backgroundColor: "#FFFFFF" }]}
                onChangeText={selectedPlantasMetro => {
                    this.setState({ selectedPlantasMetro });
                    this.setState({isDisableButton:false});
                    this.setState({isDisplayNone: false});
                  }
                }
                value={this.state.selectedPlantasMetro}
              />
              <View style={styles.viewButtonCalcular}> 
                <TouchableOpacity
                  style={styles.botaoCalcular}
                  onPress={() => {
                    this.buttonCalcular()
                  }}
                >
                  <Text style={styles.txtBotao}> CALCULAR </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.botaoPorcentagem, !this.state.isDisplayNone && {display: 'none'}]}
                    onPress={() => this.setModalVisiblePicker3(true)}
                >
                  <Text style={styles.txtBotaoPorcentagem}> % </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="QUANTIDADE SEM ARREDONDAMENTO"
              placeholderTextColor="#925E33"
              style={[styles.input, { paddingHorizontal: "2.5%" }]}
              onChangeText={selectedQuantidadeSemArredondamento =>
                this.setState({ selectedQuantidadeSemArredondamento })
              }
              value={this.state.selectedQuantidadeSemArredondamento}
              editable={false}
            />
            <TextInput
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              placeholder="QUANTIDADE BAGS"
              placeholderTextColor="#925E33"
              style={[styles.input, { paddingHorizontal: "2.5%" }]}
              onChangeText={selectedQuantidade =>
                this.setState({ selectedQuantidade })
              }
              value={this.state.selectedQuantidade}
              maxLength={10}
              editable={false}
            />
            <TextInput
              disabled={true}
              underlineColorAndroid="transparent"
              placeholder="TOTAL ($)"
              placeholderTextColor="#925E33"
              style={[styles.input, { paddingHorizontal: "2.5%" }]}
              onChangeText={selectedTotal => this.setState({ selectedTotal })}
              value={
                this.state.selectedTotal?
                "R$ "+this.formatNumber(this.state.selectedTotalPercentual?this.state.selectedTotalPercentual:this.state.selectedTotal):
                this.state.selectedTotal
              }
              editable={false}
            />
          </View>
          <View style={styles.viewButton}>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => {  
                  if(this.state.isDisableButton){
                    this.buttonSave();
                  }else{
                    Alert.alert('Não foi possivel adicionar o item.',
                    'Favor, verificar se o calculo foi feito.',
                    [
                      {text: 'Ok'},
                    ],
                    { cancelable: true }
                  );
                  }
                }}
              >
                <Text style={styles.txtBotao}>{this.state.selectedIdItensPedido?"EDITAR":"ADICIONAR"}</Text>
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
                <Text style={styles.textoClientes}>Cultivares</Text>
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
                  placeholder="Pesquisar Cultivares"
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
                          <Text style={styles.name}>{item.cultivar}</Text>                  
                        </View>
                    </TouchableWithoutFeedback>
                    );
                  }}
                  keyExtractor={(item) => item.cultivar}
                  style={{ marginTop: 10 }}
                />
              </View>
            </View>
          </Modal>
          {/* MODAL PICKER MODALIDADE */}
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
                  onPress={() => this.onPressActionPicker2("PRIMETECH")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>PRIME TECH</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => this.onPressActionPicker2("PRIMEPRO")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>PRIME PRO</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => this.onPressActionPicker2("PRIMETOTALSEED")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>PRIME TOTAL SEED</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => this.onPressActionPicker2("PADRAO")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>PADRÃO</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Modal>

          {/* MODAL PICKER ESPACAMENTO ENTRE LINHAS */}
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
                  onPress={() => this.onPressActionPicker1("45")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>45 cm</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => this.onPressActionPicker1("50")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>50 cm</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Modal>
           {/* MODAL PICKER ARREDONDAMENTO */}
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
                <TouchableWithoutFeedback
                  onPress={() => this.onPressActionPicker4("cima")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>Para cima</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => this.onPressActionPicker4("baixo")}
                  underlayColor="#dddddd"
                >
                  <View style={styles.itemPickerModalDefinido}>
                    <Text style={styles.textPickerModal}>Para baixo</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Modal>
          {/* MODAL PICKER CALCULO DESCONTO */}
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
                  <View style={styles.topoPercentual}>
                    <View style={[{ flex: 3}]}>
                       <Text style={styles.textoPercentual}>Ajuste de Valor</Text>
                    </View>
                    <View style={[{ flex: 1, alignItems:"flex-end"}]}>
                      <TouchableHighlight
                        style={[{ marginLeft: "2.5%", marginTop:"3.5%"}]}  
                        onPress={() => this.setModalVisiblePicker3(!this.state.modalVisiblePicker3)}
                      >
                      <Image
                        style={styles.img}
                        source={require("../../imgs/close.png")}
                      />
                      </TouchableHighlight>
                    </View>
                  </View>
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder="VALOR TOTAL"
                    placeholderTextColor="#925E33"
                    style={[styles.input, { width: wp('80%'), paddingHorizontal: "2.5%" }]}
                    value={'R$ ' + this.formatNumber(this.state.selectedTotal)}
                    editable={false}
                  />
                  <View style={{height: hp("17%"), justifyContent: 'center', alignItems: 'center', flexDirection:"column"}}>
                    <RadioGroup
                      color='#409551'
                      labelStyle={{ fontSize: 14 }}
                      radioButtons={this.state.radioButtons}
                      onPress={radioButtons => this.setState({ radioButtons })}
                      style={{ paddingTop: 20 }}
                    />
                  </View>
                  <TextInput
                    keyboardType={'decimal-pad'}
                    underlineColorAndroid="transparent"
                    placeholder="PERCENTUAL"
                    placeholderTextColor="#925E33"
                    style={[styles.input, { width: wp('80%'), paddingHorizontal: "2.5%" }]}
                    onChangeText={selectedPercentual =>
                      this.setState({ selectedPercentual })
                    }
                    value={this.state.selectedPercentual}
                  />
                  <View style={{alignItems:"center", marginTop: "2%"}}>
                    <TouchableWithoutFeedback 
                      onPress={() => { 
                        
                          this.buttonCalcularPercentual()}}
                    >
                      <View style={[styles.botaoCalcular]}>
                        <Text style={styles.txtBotaoPercentual}> CALCULAR </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={{alignItems:"center", justifyContent:"center", marginBottom:"10%"}}>
                    <Text style={styles.textoValorPercentual}>NOVO VALOR: R$ {this.formatNumber(this.state.selectedTotalPercentual)}</Text>
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
  viewInputsCalculator: {
    backgroundColor: "#EEEEEE",
    borderColor: "#DDDDDD",
    borderWidth: 1,
    padding: "0.5%"
    /*justifyContent: "center",
    flexDirection: "column",
    padding: "2.5%"*/
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
  viewButtonCalcular: {
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
    justifyContent:"center",
  },
  botaoCalcular: {
    width: wp("30%"),
    height: hp("8%"),
    backgroundColor: "#018A3C",
    borderColor: "#FFF",
    borderWidth: 1,
    marginVertical: "5%",
    justifyContent:"center",
  },
  botaoPorcentagem: {
    width: wp("20%"),
    height: hp("8%"),
    backgroundColor: "#FFA500",
    borderColor: "#FFF",
    borderWidth: 1,
    marginVertical: "5%",
    justifyContent:"center",
  },
  txtBotao: {
    fontSize: wp("4%"),
    color: "#D2D926",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    marginBottom: "5%",
  },
  txtBotaoPorcentagem: {
    fontSize: wp("5%"),
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    marginBottom: "5%",
  },
  txtBotaoPercentual: {
    fontSize: wp("4%"),
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    marginBottom:"20.1%"
  },
  txtTitulo: {
    fontSize: wp("3.5%"),
    color: "#925E33",
    textAlign: "left",
    marginTop: "5%",
    marginLeft: "5%",
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
    height: hp("9.5%"),
    marginHorizontal: "1.5%",
    marginTop: "2.9%",
    marginBottom: "2%",
  },
  imageStyle: {
    marginVertical: "2%",
    marginHorizontal: "3%",
    height: hp("4%"),
    width: wp("6.5%"),
    resizeMode: "stretch",
    alignItems: "flex-start"
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

  /*modal*/
  containerModal: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5FCFF"
  },
  topoBotaoFechar: {
    height: hp("8%"),
    backgroundColor: "#409551",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: "1%",
    paddingHorizontal: "5%"
  },
  topoPercentual: {
    height: hp("8%"),
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: "1%",
    paddingHorizontal: "5%"
  },
  textoClientes: {
    fontSize: wp("7%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    color: "#FFF"
  },
  textoPercentual: {
    fontSize: wp("6%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    color: "#925E33",
    marginTop:"4%"
  },
  textoValorPercentual: {
    fontSize: wp("5%"),
    fontFamily: "Roboto-Regular",
    fontWeight: "500",
    color: "#925E33",
    marginTop:"4%"
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
  cpf: {
    fontFamily: "Roboto-Regular",
    fontSize: wp("4%"),
    color: "#409551",
    textAlign: "left",
    marginLeft: "1.5%"
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
  listaModalCalcular: {
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
  img: {
    width: wp("5%"),
    height: hp("3%"),
    resizeMode: "contain",
  }
});

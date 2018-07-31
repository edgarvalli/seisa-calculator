import React from 'react';
import { StyleSheet,View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';

export default class Result extends React.Component {

    static navigationOptions = { title: "Resultado de Ahorro" }

    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;
        this.state = {
            hrPeerYear: 8234,
            kwhPeerTR: 1.1,
            power: params.power,
            steamPrice: params.steamPrice,
            kwPrice: params.kwPrice,
            optionSelected: params.optionSelected
        }
    }

    init() {

        if(this.state.optionSelected.hotWater) return this.onHotWater();
        if(this.state.optionSelected.coolWater) return this.onCoolWater();
        if(this.state.optionSelected.hotWaterAndSteam) return this.onHotWaterAndSteam();
        if(this.state.optionSelected.coolWaterAndSteam) return this.onCoolWaterAndSteam();
    
    }

    formatCurrency(number) {
        let n = number.toString();
        let numberFormated = "";
        const numbers = n.split(".");
        let position = 0;
        let i=0;

        while( i < numbers[0].length) {
            if(position < 3) {
                numberFormated = numbers[0][(numbers[0].length - 1) - i] + numberFormated;
                position ++;
                i++;
            } else {
                numberFormated = "," + numberFormated;
                position = 0;
            }
        }

        if(numbers.length >= 2) {
            numberFormated = numberFormated + "." + numbers[1][0];
            let last_decimal = "";
            let second_decimal = parseInt(numbers[1][1]);
            if(second_decimal > 5) {
                last_decimal = (second_decimal + 1).toString();
            } else {
                last_decimal = second_decimal;
            }
            numberFormated = numberFormated + last_decimal;
        }
        

        return "$" + numberFormated;
    }

    onHotWater(){

        const { power, kwPrice, steamPrice, hrPeerYear } = this.state; // KW
        const kw = parseFloat(power);
        const _kwPrice = parseFloat(kwPrice);
        const _steamPrice = parseFloat(steamPrice);
        const kwPeerYear = kw * hrPeerYear; //kWj/año
        const _1MXPPeerYear = _kwPrice * kwPeerYear; //MxP/año
        const AC = this.onHotWaterCalculateFactor(power); //ton/hr
        const GJPeerHour = (AC * 1000 * 288.8419)/1000000; //A.C
        const GJPeerYear = GJPeerHour * hrPeerYear; // GJ/año
        const _2MXPPeerYear = GJPeerYear * _steamPrice; // MxP/año
        const _1totalMXP = _1MXPPeerYear + _2MXPPeerYear;

        const consumoGJ = this.onConsumo(power) * 1.055056;
        const gasPeerYear = consumoGJ * hrPeerYear;
        const _3MXPPeerYear = gasPeerYear * _steamPrice;
        const mttoPeerYear = this.onMaintenance(power) * hrPeerYear;
        const _2totalMXP = mttoPeerYear + _3MXPPeerYear;
        const saving = _1totalMXP - _2totalMXP;

        return (
            <View style={styles.container}>

                <ScrollView>

                    <View style={[styles.row, { height: 100 }]}>
                        <Text h1>Resultado</Text>
                    </View>

                    <View style={styles.row}>
                        <Text h4>Agua Caliente:</Text>
                        <Text h4>{ AC.toFixed(3) } Ton/hr</Text>
                    </View>

                    <View style={styles.row}>
                        <Text h4>Ahorro Anual: </Text>
                        <Text h4>{ this.formatCurrency(Math.ceil(saving)) } Pesos</Text>
                    </View>

                </ScrollView>                

            </View>
        )

    }

    onCoolWater() {

        const { power, kwPrice, steamPrice, hrPeerYear, kwhPeerTR } = this.state; // KW
        const kwPeerYear = power * hrPeerYear; //kWj/año
        const _1MXPPeerYear = kwPrice * kwPeerYear; //MxP/año
        const AC = this.onCoolWaterCalculateFactor(power); //ton/hr
        const GJPeerHour = (AC * kwhPeerTR * hrPeerYear); //A.C
        const GJPeerYear = GJPeerHour * kwPrice; // GJ/año
        // const _2MXPPeerYear = GJPeerYear * _steamPrice; // MxP/año
        const _1totalMXP = GJPeerYear + _1MXPPeerYear;

        const consumoGJ = this.onConsumo(power) * 1.055056;
        const gasPeerYear = consumoGJ * hrPeerYear;
        const _3MXPPeerYear = gasPeerYear * steamPrice;
        const mttoPeerYear = this.onMaintenance(power) * hrPeerYear;
        const _2totalMXP = mttoPeerYear + _3MXPPeerYear;
        const saving = _1totalMXP - _2totalMXP;

        return (
            <View style={styles.container}>

                <ScrollView>

                    <View style={[styles.row, { height: 100 }]}>
                        <Text h1>Resultado</Text>
                    </View>

                    <View style={styles.row}>
                        <Text h4>Agua Fria:</Text>
                        <Text h4>{ AC.toFixed(3) } Ton/hr</Text>
                    </View>

                    <View style={styles.row}>
                        <Text h4>Ahorro Anual: </Text>
                        <Text h4>{ this.formatCurrency(Math.ceil(saving)) } Pesos</Text>
                    </View>

                </ScrollView>                

            </View>
        )

    }

    onHotWaterAndSteam() {
        
        const { power, kwPrice, steamPrice, hrPeerYear } = this.state; // KW
        const kwhPeerYear = power * hrPeerYear;
        const _1MXPPeerYear = kwhPeerYear * kwPrice;
        const AC = this.onSteamAndHotWaterCalculateFactor(power).hotWater;
        const GJPeerHour = (AC * 1000 * 288.8419)/1000000;
        const GJPeerYear = GJPeerHour * hrPeerYear;
        const _2MXPPeerYear = GJPeerYear * steamPrice;
        const steam = this.onSteamAndHotWaterCalculateFactor(power).steam;
        const steamGJPeerHours = (steam * 1000 * 2371)/1000000;
        const steamGJPeerYear = steamGJPeerHours * hrPeerYear;
        const _3MXPPeerYear = steamGJPeerYear * steamPrice;
        const _1totalMXP = _3MXPPeerYear + _2MXPPeerYear + _1MXPPeerYear;
        
        const consumoGJ = this.onConsumo(power) * 1.055056;
        const gasPeerYear = consumoGJ * hrPeerYear;
        const _4MXPPeerYear = gasPeerYear * steamPrice;
        const mttoPeerYear = this.onMaintenance(power) * hrPeerYear;
        const _2totalMXP = _4MXPPeerYear + mttoPeerYear;
        const saving = _1totalMXP - _2totalMXP;

        return (
            <View style={styles.container}>

                <ScrollView>

                    <View style={[styles.row, { height: 100 }]}>
                        <Text h1>Resultado</Text>
                    </View>

                    <View style={styles.row}>
                        <Text h4>Vapor:</Text>
                        <Text h4>{ steam.toFixed(3) } Ton/hr</Text>
                    </View>

                    <View style={styles.row}>
                        <Text h4>Agua Caliente:</Text>
                        <Text h4>{ AC.toFixed(3) } Ton/hr</Text>
                    </View>

                    <View style={styles.row}>
                        <Text h4>Ahorro Anual: </Text>
                        <Text h4>{ this.formatCurrency(Math.ceil(saving)) } Pesos</Text>
                    </View>

                </ScrollView>                

            </View>
        )
        
    }

    onCoolWaterAndSteam() {
        const { power, kwPrice, steamPrice, hrPeerYear, kwhPeerTR } = this.state; // KW
        const kwhPeerYear = power * hrPeerYear;
        const _1MXPPeerYear = kwhPeerYear * kwPrice;
        const AC = (this.onSteamAndHotWaterCalculateFactor(power).hotWater/this.onHotWaterCalculateFactor(power) ) * 0.2222 * power;
        const _kwhPeerYear = (AC * kwhPeerTR * hrPeerYear);
        // const GJPeerYear = GJPeerHour * hrPeerYear;
        const _2MXPPeerYear = _kwhPeerYear * kwPrice;
        const steam = this.onSteamAndHotWaterCalculateFactor(power).steam;
        const steamGJPeerHours = (steam * 1000 * 2371)/1000000;
        const steamGJPeerYear = steamGJPeerHours * hrPeerYear;
        const _3MXPPeerYear = steamGJPeerYear * steamPrice;
        const _1totalMXP = _3MXPPeerYear + _2MXPPeerYear + _1MXPPeerYear;
        
        const consumoGJ = this.onConsumo(power) * 1.055056;
        const gasPeerYear = consumoGJ * hrPeerYear;
        const _4MXPPeerYear = gasPeerYear * steamPrice;
        const mttoPeerYear = this.onMaintenance(power) * hrPeerYear;
        const _2totalMXP = _4MXPPeerYear + mttoPeerYear;
        const saving = _1totalMXP - _2totalMXP;

        return (
            <View style={styles.container}>

                <ScrollView>

                    <View style={[styles.row, { height: 100 }]}>
                        <Text h1>Resultado</Text>
                    </View>

                    <View style={styles.row}>
                        <Text h4>Vapor:</Text>
                        <Text h4>{ steam.toFixed(3) } Ton/hr</Text>
                    </View>

                    <View style={styles.row}>
                        <Text h4>Agua Fria:</Text>
                        <Text h4>{ AC.toFixed(3) } Ton/hr</Text>
                    </View>

                    <View style={styles.row}>
                        <Text h4>Ahorro Anual: </Text>
                        <Text h4>{ this.formatCurrency(Math.ceil(saving)) } Pesos</Text>
                    </View>

                </ScrollView>                

            </View>
        )
    }

    //This method return the factor depending of the range of power,
    // It´s necessary passing as argument the power when it is invoked
    // The unit is Ton/hr
    onHotWaterCalculateFactor(p) {

        let factor = 0;
        p = parseFloat(p);

        if(p >= 495 && p < 600) {
            factor = (0.0069524 * p + 9.7485714) * (p/1000);
        }

        else if (p >= 600 && p < 800) {
            factor = (-0.0011 * p + 14.58) * (p/1000);
        }
        else if (p >= 800 && p < 1200) {
            factor = (-0.00365 * p + 16.62) * (p/1000);
        }

        else if(p >= 1200 && p < 1560) {
            factor = (0.00075 * p + 11.34) * (p/1000);
        }

        else if(p >= 1560 && p < 2000) {
            factor = (-0.0006364 * p + 13.5027243) * (p/1000);
        }

        else if(p >= 2000) {
            factor = (12.23 * p)/1000;
        }

        return factor;
    }

    // This method return the factor what it´s calculated by power * 0.2222
    // The unit is Ton/hr
    onCoolWaterCalculateFactor(power) {
        return parseFloat(power) * 0.2222;
    }

    // This method return a factor of seam and hot water as a JSON Object
    // The unit is Ton/hr
    onSteamAndHotWaterCalculateFactor(p) {

        const factor = {};
        p = parseFloat(p);

        if(p >= 495 && p < 600) {
            factor.steam = (0.77*p)/1000;
            factor.hotWater = (-0.000381 * p + 6.3785714) * (p/1000);
        }

        else if (p >= 600 && p < 800) {
            factor.steam = ((-0.0006 * p) + 1.13) * (p/1000);
            factor.hotWater = ((-0.0007 * p) + 6.57) * (p/1000);
        }
        else if (p >= 800 && p < 1200) {
            factor.steam = ((-0.000125 * p) + 0.75) * (p/1000);
            factor.hotWater = ((0.00065 * p) + 5.49) * (p/1000);
        }

        else if(p >= 1200 && p < 1560) {
            factor.steam = ((0.0001389 * p) + 0.433333) * (p/1000);
            factor.hotWater = ((0.0001667 * p) + 6.07) * (p/1000);
        }

        else if(p >= 1560 && p < 2000) {
            factor.steam = ((-0.0001136 * p) + 0.8272727);
            factor.hotWater = ((-0.0002273 * p) + 6.6845455) * (p/1000);
        }

        else if(p >= 2000) {
            factor.steam = (0.6*p)/1000;
            factor.hotWater = (6.23 * p)/1000;
        }

        return factor;
    }

    // This method return the consumo, the unit is MMBTU/hr
    onConsumo(p) {
        let consumo = 0;
        p = parseFloat(p);

        if(p >= 495 && p < 600) {
            consumo = ((-0.0000033 * p) + 0.0102567) * p;
        }

        else if (p >= 600 && p < 800) {
            consumo = ((-0.0000003 * p) + 0.0085062) * p;
        }
        else if (p >= 800 && p < 1200) {
            consumo = ((-0.0000009 * p) + 0.0089469) * p;
        }

        else if(p >= 1200) {
            consumo = 0.0079 * p;
        }

        return consumo;
    }

    // This method return the cost of the maintenance, unit USD/hr
    onMaintenance(p) {
        let maintenance = 0;
        p = parseFloat(p);

        if(p >= 495 && p < 600) {
            maintenance = ((-0.0000188 * p) + 0.0395887) * p;
        }

        else if (p >= 600 && p < 800) {
            maintenance = ((-0.0000292 * p) + 0.0458333) * p;
        }
        else if (p >= 800 && p < 1200) {
            maintenance = ((-0.0000146 * p) + 0.0341667) * p;
        }

        else if(p >= 1200 && p < 1560) {
            maintenance = 0.0167 * p;
        }

        else if(p >= 1560 && p < 2000) {
            maintenance = ((-0.0000004 * p) + 0.0172576) * p;
        }

        else if(p >= 2000) {
            maintenance = 0.0165 * p;
        }

        return maintenance;
    }

    render() {
        return this.init();
    }

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },
    row: {
        width: "100%",
        height: 100,
        padding: 5,
        alignItems: "center"
    },
    input: {
      width: "100%",
      padding: 1
    }
  });
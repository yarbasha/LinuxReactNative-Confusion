import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      guests: 1,
      smoking: false,
      date: '',
      // showModal: false
    };
  }

  static navigationOptions = {
    title: 'Reserve Table'
  };

  // toggleModal() {
  //   this.setState({ showModal: !this.state.showModal });
  // }

  handleReservation() {
    Alert.alert(
      'Your Reservation OK?',
      'Number of Guests: ' + this.state.guests + '\nSmoking? ' + this.state.smoking + '\nDate and Time: ' + this.state.date,
      [
        {
          text: 'cancel',
          onPress: () => this.resetForm()
        },
        {
          text: 'ok',
          onPress: () => {
            this.presentLocalNotification(this.state.date);
            this.resetForm();
          }
        }
      ]
    );
    this.addReservationToCalendar(this.state.date);
  }

  obtainCalendarPermission = async () => {
    const calendarPermission = await Permissions.getAsync(Permissions.CALENDAR);
    if (calendarPermission.status === 'granted')
      return true;
    return false;
  }

  addReservationToCalendar = async (reservationDate) => {
    const startDate = new Date(Date.parse(reservationDate));
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000));
    if (this.obtainCalendarPermission()) {
      await Calendar.createEventAsync('1', {
        title: 'Con Fusion Table Reservation',
        startDate: startDate,
        endDate: endDate,
        timeZone: 'Asia/Hong_Kong',
        location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
      });
    }
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      date: ''
    });
  }

  async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
    if (permission.status !== 'granted') {
      permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
      if (permission.status !== 'granted') {
        Alert.alert('Permission not granted to show notifications');
      }
    }
    return permission;
  }

  async presentLocalNotification(date) {
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
      title: 'Your Reservation',
      body: 'Reservation for ' + date + ' requested',
      ios: {
        sound: true
      },
      android: {
        sound: true,
        vibrate: true,
        color: '#512DA8'
      }
    })
  }

  render() {
    return (
      <Animatable.View useNativeDriver={true} animation="zoomIn" duration={1000}>
        <ScrollView>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Number of Guests</Text>
            <Picker style={styles.formItem}
              selectedValue={this.state.guests}
              onValueChange={(itemValue, itemIndex) => this.setState({ guests: itemValue })} >
              <Picker.Item label='1' value='1' />
              <Picker.Item label='2' value='2' />
              <Picker.Item label='3' value='3' />
              <Picker.Item label='4' value='4' />
              <Picker.Item label='5' value='5' />
              <Picker.Item label='6' value='6' />
            </Picker>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
            <Switch style={styles.formItem}
              value={this.state.smoking}
              onTintColor='#512DA8'
              onValueChange={value => this.setState({ smoking: value })} />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date and Time</Text>
            <DatePicker style={{ flex: 2, marginRight: 20 }}
              date={this.state.date}
              format=''
              mode='datetime'
              placeholder='Select date and time'
              minDate='2017-01-01'
              confirmBtnText='Confirm'
              cancelBtnText='Cancel'
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={date => this.setState({ date: date })} />
          </View>
          <View style={styles.formRow}>
            <Button title='Reserve' color='#512DA8' onPress={() => this.handleReservation()}
              accessibilityLabel='Learn more about this purple button' />
          </View>
          {/* <Modal animationType={'slide'}
            transparent={false}
            visible={this.state.showModal}
            onDismiss={() => { this.toggleModal(); this.resetForm(); }}
            onRequestClose={() => { this.toggleModal(); this.resetForm(); }}>
            <View style={styles.modal}>
              <Text style={styles.modalTitel}>Your Reservation</Text>
              <Text style={styles.modalText}>Number of Guests: {this.state.guests}</Text>
              <Text style={styles.modalText}>Smoking? : {this.state.smoking ? 'Yes' : 'No'}</Text>
              <Text style={styles.modalText}>Date and Time: {this.state.date}</Text>
              <Button onPress={() => { this.toggleModal(); this.resetForm(); }} color='#512DA8' title='Close' />
            </View>
          </Modal> */}
        </ScrollView >
      </Animatable.View >
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  formItem: {
    flex: 1
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20
  },
  modalText: {
    fontSize: 18,
    margin: 10
  }
});

export default Reservation;
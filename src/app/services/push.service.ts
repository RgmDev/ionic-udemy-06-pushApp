import { EventEmitter, Injectable } from '@angular/core';
import { OSNotification } from '@awesome-cordova-plugins/onesignal/ngx';
// import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import OneSignal from 'onesignal-cordova-plugin';

import { Storage } from '@ionic/storage-angular';
import { OSNotificationPayload } from '@awesome-cordova-plugins/onesignal';

import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[] = [];
  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(
    private storage: Storage,
    public alertController: AlertController,
    private platform: Platform
  ) {
    this.initStorage();
    this.cargarMensajes();
  }

  async initStorage() {
    await this.storage.create();
  }

  OneSignalInit() {
    this.platform.ready().then( () => {
      console.log(OneSignal);
      OneSignal.setLogLevel(6, 0);
      OneSignal.setAppId("8d1e3ee6-fd58-4d60-bf63-1161ae92c215");
      OneSignal.setNotificationOpenedHandler(function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        // this.notificacionRecibida(jsonData);
        this.presentAlert(JSON.stringify(jsonData), 'Openedhandler');
      });
      OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
        console.log("User accepted notifications: " + accepted);
        this.presentAlert(accepted, 'promp accepted');
      });
    })
  }

  async getMensajes() {
    await this.cargarMensajes();
    return [...this.mensajes];
  }

  async notificacionRecibida(noti: OSNotification) {
    await this.cargarMensajes();
    const payload = noti.payload;
    const existePush = this.mensajes.find( mensaje => mensaje.notificationID === payload.notificationID);
    if(existePush) {
      return;
    }
    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);
    this.guardarMensajes();
  }

  guardarMensajes() {
    this.storage.set('mensajes', this.mensajes);
  }

  async cargarMensajes() {
    this.mensajes = await this.storage.get('mensajes') || [];
  }


  async presentAlert(txt, title) {
    const alert = await this.alertController.create({
      header: title,
      message: txt,
      buttons: ['OK']
    });
    await alert.present();
  }


  
  addPush(push: any) {
    this.mensajes.unshift(push);
    console.log(this.mensajes);
    this.guardarMensajes();
  }
  

}

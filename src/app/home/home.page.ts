import { ApplicationRef, Component, OnInit } from '@angular/core';
import { OSNotificationPayload } from '@awesome-cordova-plugins/onesignal';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  mensajes: OSNotificationPayload[] = [];

  constructor(
    private pushService: PushService,
    private applicationRef: ApplicationRef
  ) { }

  ngOnInit() {
    this.pushService.pushListener.subscribe( (noti) => {
      this.mensajes.unshift(noti);
      this.applicationRef.tick();
    });
  }

  async ionViewWillEnter() {
    this.mensajes = await this.pushService.getMensajes()
  }

  addPush() {
    console.log('agrego push');
    this.pushService.addPush({
      title: 'Titulo de la push agregada',
      body: 'Este es el body de la push agregada',
      date: new Date()
    })
  }

}

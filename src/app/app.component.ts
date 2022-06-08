import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { PushService } from './services/push.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    platform: Platform,
    pushService: PushService
  ) {
    platform.ready().then( () => {
      pushService.OneSignalInit();
    })
  }
}

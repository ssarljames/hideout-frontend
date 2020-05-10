import { SmsService } from 'app/services/sms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device-information',
  templateUrl: './device-information.component.html',
  styleUrls: ['./device-information.component.scss']
})
export class DeviceInformationComponent implements OnInit {

  device_information: any = {};
  isFetching: boolean;
  constructor(private smsService: SmsService) { }

  ngOnInit() {
    this.fetchDeviceInformation();
  }

  fetchDeviceInformation(): void{
    this.isFetching = true;
    this.device_information = {};
    this.smsService.queryRaw({
      params: {
        get_device_information: 1
      }
    }).subscribe(
      data => {
        this.device_information = data;
        this.isFetching = false;
      }
    )
  }

}

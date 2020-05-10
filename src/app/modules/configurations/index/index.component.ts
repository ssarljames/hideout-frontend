import { UserGroup } from 'app/models/user-group/user-group';
import { ComputerStation } from 'app/models/computer-station/computer-station';
import { ComputerStationService } from 'app/services/computer-station';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildingService } from 'app/services/building';
import { UserGroupService } from 'app/services/user_group';
import { AreaService } from 'app/services/area';
import { MachineService } from 'app/services/machine';
import { ConfigurationService } from 'app/services/configurations';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserGroupModalComponent } from '../modals/user-group-modal/user-group-modal.component';
import { ComputerStationFormModalComponent } from '../modals/computer-station-form-modal/computer-station-form-modal.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class ConfigurationIndexComponent implements OnInit {

  configurations: any[] = [];
  machines: any[] = [];
  areas: any[] = [];
  userGroups: any[] = [];

  selectedUserGroup: any = {};

  computerStations: ComputerStation[];



  constructor(private configurationService: ConfigurationService,
              private machineService: MachineService,
              private areaService: AreaService,
              private buildingService: BuildingService,
              private userGroupService: UserGroupService,
              private modalService: NgbModal,
              private computerStationService: ComputerStationService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchConfigurations();
    this.fetchMachines();
    this.fetchAreas();
    this.fetchUserGroups();
    this.fetchComputerStations();
  }

  fetchComputerStations(): void{
    this.computerStationService.query().subscribe(
      data => {
        this.computerStations = data;
      }
    )
  }

  fetchConfigurations() {
    this.configurationService.query().subscribe(
      (data: ComputerStation[]) => {
        this.configurations = data;
      }
    );
  }

  fetchMachines() {
    this.machineService.query().subscribe(
      data => {
        this.machines = data;
      }
    );
  }

  fetchAreas() {
    this.areaService.query().subscribe(
      data => {
        this.areas = data;
      }
    );
  }

  fetchUserGroups() {
    this.userGroupService.query().subscribe(
      data => {
        this.userGroups = data;
      }
    )
  }

  saveConfigurations() {
    const form: any = {};
    form.id = 0;
    this.configurations.forEach(c => {
      form[c.cname] = c.cvalue;
    });

    this.configurationService.update(form).subscribe(
      data => {
        this.toastr.success('Config successfully updated!');
        this.fetchConfigurations();
      },
      fail => {
        this.toastr.error(JSON.stringify(fail.error.errors));
      }
    );
  }

  editMachine(machine: any, field: string) {

    let flag = true;
    const m = JSON.parse(JSON.stringify(machine));

    switch (field) {
      case 'name':
        m.name = prompt('Enter new machine name: ', machine[field]);
        flag = flag && m.name;
        break;
      case 'type':
        m.type = prompt('Enter new machine type: [ w or d ] ', machine[field]);
        flag = flag && (m.type === 'w' || m.type === 'd');
        break;
      case 'default_self_service_fee':
        m.default_self_service_fee = prompt('Enter new default self-service fee:', Number(machine[field]) + '');
        flag = flag && /^\+?(0|[1-9]\d*)$/.test(m.default_self_service_fee);
        break;
      case 'enabled':
        m.enabled = prompt('Set enabled:[y or n]', machine[field] ? 'y':'n');
        flag = flag && (m.enabled === 'y' || m.enabled === 'n');
        m.enabled = (m.enabled === 'y');
        break;

      default:
        break;
    }

    if (flag) {
      this.machineService.update(m).subscribe(
        data => {
          for (const key in machine) {
            if (machine.hasOwnProperty(key)) {
              machine[key] = data[key];
            }
          }
          this.toastr.success('Machine successfully updated!');
        }
      );
    }
  }


  editConfiguration(config: any) {
    const configCopy = JSON.parse(JSON.stringify(config));
    configCopy.cvalue = prompt('New ' + configCopy.label, config.cvalue);

    if (configCopy.cvalue !== '') {
      this.configurationService.update(configCopy).subscribe(
        data => {
          for (const key in config) {
            if (config.hasOwnProperty(key)) {
              config[key] = data[key];
            }
          }
          this.toastr.success('Laundry default config successfully updated!');
        },
        fail => {
          this.toastr.error(JSON.stringify(fail.error.errors));
        }
      );
    }
  }

  createArea(){
    const name = prompt("Enter new area name:");
    if(!name)
      return;
    this.areaService.create({
      name: name
    }).subscribe(
      data => {
        this.fetchAreas();
        this.toastr.success('New area was created!');
      }
    )
  }

  editArea(area: any){
    const name = prompt("Enter new area name:", area.name);
    if(!name)
      return;
    this.areaService.update({
      id: area.id,
      name: name
    }).subscribe(
      data => {
        this.fetchAreas();
        this.toastr.success('Area was updated!');
      }
    )
  }

  createBuilding(area: any){
    const name = prompt("Enter new building name:");
    if(!name)
      return;
    this.buildingService.create({
      area_id: area.id,
      name: name
    }).subscribe(
      data => {
        this.fetchAreas();
        this.toastr.success('New building was created!');
      }
    )
  }

  editBuilding(building: any){
    const name = prompt("Enter new building name:", building.name);
    if(!name)
      return;
    this.buildingService.update({
      id: building.id,
      name: name
    }).subscribe(
      data => {
        this.fetchAreas();
        this.toastr.success('Building was updated!');
      }
    )
  }

  addMachine(type: string): void{
    const name = prompt('Enter name for new ' + (type == 'w' ? 'washing' : 'drying') + ' machine');
    if(name){
      this.machineService.create({
        name: name,
        type: type,
        default_self_service_fee: 0,
        enabled: false
      }).subscribe(
        machine => {
          this.fetchMachines();
          this.toastr.success("New machine has been added.");
        }
      )
    }
  }

  editUserGroup(group: UserGroup): void{
    const modal: NgbModalRef = this.modalService.open( UserGroupModalComponent , {size: 'sm'});
    modal.componentInstance.user_group_id = group.id;
    modal.result.then(
      () => {
        this.fetchUserGroups();
      }
    );


  }

  openComputerStation(computer: ComputerStation): void{
    const modal: NgbModalRef = this.modalService.open( ComputerStationFormModalComponent, {size:'sm'});
    modal.componentInstance.computer_station_id = computer ? computer.id : null;
    modal.result.then(
      () => {
        this.fetchComputerStations();
      },
      () => {

      }
    )
  }

}

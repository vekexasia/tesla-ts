import { ITeslaApiRequestor } from './ITeslaApiRequestor';
import { VehicleCommands } from './vehicleCommands';
import { BaseVehicle, ClimateState, DriveState, GUISettings, StreamItem, VehicleData } from './types';
import * as WebSocket from 'ws';
import { concat, EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { STREAM_HOST, STREAM_URL } from './apiconstants';
import {
  catchError,
  debounceTime,
  flatMap,
  take,
  tap
} from 'rxjs/operators';

export class VehicleAPI {

  public readonly commands: VehicleCommands;
  constructor(private apiRequestor: ITeslaApiRequestor, public data: BaseVehicle) {
    this.commands = new VehicleCommands(apiRequestor, data);
  }

  private get basePath() {
    return `/vehicles/${this.data.id}`
  }

  public async vehicleData(): Promise<VehicleData> {
    return this.apiRequestor.getRequest(`/vehicles/${this.data.id}/vehicle_data`);
  }

  /**
   * Climate settings including seats, vents battery, steering wheel, and preconditioning state.
   */
  public async climateState(): Promise<ClimateState> {
    return this.apiRequestor.getRequest(`/vehicles/${this.data.id}/climate_state`);
  }

  /**
   * Drive state including latitude, longitude, and heading of the data.
   */
  public async driveState(): Promise<DriveState> {
    return this.apiRequestor.getRequest(`/vehicles/${this.data.id}/drive_state`);
  }

  /**
   * Localization settings including distance units, temperature units, charge units, and clock hour style.
   */
  public async guiSettings(): Promise<GUISettings> {
    return this.apiRequestor.getRequest(`/vehicles/${this.data.id}/gui_settings`);
  }


  public rawStream(): WebSocket {
    const ws = new WebSocket(STREAM_URL);
    ws.on('open', () => {
      ws.send(Buffer.from(JSON.stringify({
        msg_type: 'data:subscribe',
        token: Buffer.from(`${this.apiRequestor.credentials.username}:${this.data.tokens[0]}`, 'utf8').toString('base64'),
        value: 'speed,odometer,soc,elevation,est_heading,est_lat,est_lng,power,shift_state,range,est_range,heading',
        tag: `${this.data.vehicle_id}`
      })));
    });
    return ws;
  }

  private initializeStream(timeout: number): Observable<StreamItem> {
    return new Observable((observer) => {
      const ws = this.rawStream();
      const timeoutSubj = new Subject();
      timeoutSubj.pipe(debounceTime(timeout), take(1)).subscribe(() => ws.terminate());

      ws.on('open', () => timeoutSubj.next());
      ws.on('close', () => observer.complete());
      ws.on('error', (e) => observer.error(e));

      ws.on('message', (data) => {
        const jO = JSON.parse(data.toString());
        timeoutSubj.next();
        if (jO.msg_type === 'data:update') {
          const [timestamp, speed, odometer, soc, elevation, estHeading, lat, lng, power, shiftState, range, estRange, heading] = jO.value.split(',');
          observer.next({
            time: new Date(parseInt(timestamp, 10)),
            speed: speed === '' ? null: parseFloat(speed),
            odometer: parseFloat(odometer),
            soc: parseFloat(soc),
            elevation: parseFloat(elevation),
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            power: parseFloat(power),
            shiftState,
            range: parseFloat(range),
            estRange: parseFloat(estRange),
            heading: parseFloat(heading),
            estHeading: parseFloat(estHeading)});
        } else {
          const r = JSON.parse(data.toString());
          if (r.msg_type === 'data:error') {
            observer.error(new Error(JSON.stringify(r)));
            // observer.next(r);
            ws.terminate();
          }
        }
      });

    });
  }

  public stream(opts: {maxTimeout: number, autoReopen: boolean} = {maxTimeout: 100000, autoReopen: false}): Observable<StreamItem> {

    const reconnectSubject = new Subject<void>();
    const autoReopenFN = () => {
      if (opts.autoReopen) {
        reconnectSubject.next();
      } else {
        reconnectSubject.complete();
      }
    };
    return concat(
      of(1),
      reconnectSubject
    )
      .pipe(flatMap(() => this.initializeStream(opts.maxTimeout)
        .pipe(tap({
          complete: autoReopenFN
        }))
        .pipe(catchError((a) => {
          autoReopenFN();
          return opts.autoReopen ? EMPTY: throwError(a);
        }))
      ))
  }

}

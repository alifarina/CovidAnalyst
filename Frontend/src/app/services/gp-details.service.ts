import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GPDetails, GPResponse } from '../models/gp-model';
import { AppConfigService } from './app-config.service';
import { CommonService } from './common.service';
import {
  AddConsultation,
  ConsultationDetails,
} from '../models/consultations-model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GpDetailsService {
  readonly rootUrl = AppConfigService.settings.apiServer.baseUrl;
  readonly consultations = AppConfigService.settings.apiServer.consultations;
  noCacheHeaders = new HttpHeaders({
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  });
  constructor(public commonService: CommonService) {}

  getGpList(): Observable<Object> {
    // let listP = new Array<GPDetails>();
    // let gp=new GPDetails();
    // gp.id="d6597164-9e1b-4a0e-be3c-a2a49b9cd67f";
    // gp.age=47;
    // gp.alreadyConsulted=false;
    // gp.location="Paris";
    // gp.name="Mr. GPPPPPPPPPPPPPPPPP";
    // gp.sex="Male";
    // listP.push(gp);
    // return new Promise(function (resolve, reject) {
    //   resolve(listP);
    // });
    let pram = new HttpParams().set('key', 'allGp');

    return from(
      this.commonService.getGetResponse(
        this.rootUrl + this.consultations,
        this.noCacheHeaders,
        pram
      )
    );
  }

  AddGpConsultation(obj: AddConsultation): Promise<Object> {
    // let success=new GPResponse();
    // success.gpId=id;
    // success.success=true;
    // return new Promise(function (resolve, reject) {
    //   resolve(success);
    // });

    return this.commonService.getPostResponse(
      obj,
      this.rootUrl + this.consultations,
      this.noCacheHeaders
    );
  }

  updateGpConsultation(obj: ConsultationDetails) {
    return this.commonService.getPutResponse(
      obj,
      this.rootUrl + this.consultations,
      this.noCacheHeaders
    );
  }

  getAlreadyConsultedGPByPatient(patientId: string): Observable<Object> {
    let pram = new HttpParams()
      .set('key', 'allGpbyPid')
      .set('value', patientId);
    return from(
      this.commonService.getGetResponse(
        this.rootUrl + this.consultations,
        this.noCacheHeaders,
        pram
      )
    );
  }
  getConsultationByGPandPatientId(patientId: string,gpId:string): Observable<Object> {
    let pram = new HttpParams()
      .set('key', 'patientByGPandPatient')
      .set('patientId', patientId)
      .set('gpId', gpId);
    return from(
      this.commonService.getGetResponse(
        this.rootUrl + this.consultations,
        this.noCacheHeaders,
        pram
      )
    );
  }
}

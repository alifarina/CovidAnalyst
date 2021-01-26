export class AddConsultation {
  patientId: string;
  isActive: number;
  gpId: string;
}

export class ConsultationDetails {
  patientId: string;
  gpId: string;
  consultationText: string;
  isCovidTestRequired: number;
}

export class ConsultationDialogModel {
  consultationText: string;
  isCovidTestRequired: number;
  gpName: string;
  patientName: string;
  header: string;
  patientId: string;
  gpId: string;
  get isCovidTestRequiredBool() {
    return this.isCovidTestRequired == 1;
  }
  set isCovidTestRequiredBool(newValue: boolean) {
    this.isCovidTestRequired = newValue ? 1 : 0;
  }
}

export class ConsultationUpdateRecordResponse {
  message: string;
  success: boolean;
}

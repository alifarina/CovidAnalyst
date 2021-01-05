export class PatientHealthInfo {
  patientId: string;
  hasHypertension: number=0; // values are 0 or 1
  hasDiabetes: number=0; // values are 0 or 1
  hasCardiovascularDisease: number=0; // values are 0 or 1
  hasChronicRespiratoryDisease: number=0; // values are 0 or 1

  get hasHypertensionBool() {
    return this.hasHypertension == 1
  }
 
  set hasHypertensionBool(newValue:boolean) {
    this.hasHypertension = newValue ? 1 : 0
  }

  get hasDiabetesBool() {
    return this.hasDiabetes == 1
  }
 
  set hasDiabetesBool(newValue:boolean) {
    this.hasDiabetes = newValue ? 1 : 0
  }
  get hasCardiovascularDiseaseBool() {
    return this.hasCardiovascularDisease == 1
  }
 
  set hasCardiovascularDiseaseBool(newValue:boolean) {
    this.hasCardiovascularDisease = newValue ? 1 : 0
  }
  get hasChronicRespiratoryDiseaseBool() {
    return this.hasChronicRespiratoryDisease == 1
  }
 
  set hasChronicRespiratoryDiseaseBool(newValue:boolean) {
    this.hasChronicRespiratoryDisease = newValue ? 1 : 0
  }

}

export class PatientSymptomsInfo {
  patientId: string;
  hasBreathlessness: number=0; // values are 0 or 1
  hasFever: number=0; // values are 0 or 1
  hasLossOfTasteSmell: number=0; // values are 0 or 1
  hasDryCough: number=0; // values are 0 or 1
  hasSoreThroat: number=0; // values are 0 or 1
  oxygenLevel: number;
  heartRate: number;
  bloodPressure: number;
  temperature: number;
  get hasBreathlessnessBool() {
    return this.hasBreathlessness == 1
  }
 
  set hasBreathlessnessBool(newValue:boolean) {
    this.hasBreathlessness = newValue ? 1 : 0
  }

  get hasFeverBool() {
    return this.hasFever == 1
  }
 
  set hasFeverBool(newValue:boolean) {
    this.hasFever = newValue ? 1 : 0
  }

  get hasLossOfTasteSmellBool() {
    return this.hasLossOfTasteSmell == 1
  }
 
  set hasLossOfTasteSmellBool(newValue:boolean) {
    this.hasLossOfTasteSmell = newValue ? 1 : 0
  }

  get hasDryCoughBool() {
    return this.hasDryCough == 1
  }
 
  set hasDryCoughBool(newValue:boolean) {
    this.hasDryCough = newValue ? 1 : 0
  }

  get hasSoreThroatBool() {
    return this.hasSoreThroat == 1
  }
 
  set hasSoreThroatBool(newValue:boolean) {
    this.hasSoreThroat = newValue ? 1 : 0
  }
}

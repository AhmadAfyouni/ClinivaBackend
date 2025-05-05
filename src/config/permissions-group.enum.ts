import { PermissionsEnum } from './permission.enum';

export const PermissionsGroupMap: Record<string, PermissionsEnum[]> = {
  USER_MANAGEMENT: [
    PermissionsEnum.USER_VIEW,
    PermissionsEnum.USER_CREATE,
    PermissionsEnum.USER_UPDATE,
    PermissionsEnum.USER_DELETE,
  ],

  ROLE_MANAGEMENT: [
    PermissionsEnum.ROLE_VIEW,
    PermissionsEnum.ROLE_CREATE,
    PermissionsEnum.ROLE_UPDATE,
    PermissionsEnum.ROLE_DELETE,
  ],

  PATIENT_MANAGEMENT: [
    PermissionsEnum.PATIENT_VIEW,
    PermissionsEnum.PATIENT_CREATE,
    PermissionsEnum.PATIENT_UPDATE,
    PermissionsEnum.PATIENT_DELETE,
  ],

  APPOINTMENT_MANAGEMENT: [
    PermissionsEnum.APPOINTMENT_VIEW,
    PermissionsEnum.APPOINTMENT_CREATE,
    PermissionsEnum.APPOINTMENT_UPDATE,
    PermissionsEnum.APPOINTMENT_DELETE,
  ],

  BILLING_MANAGEMENT: [
    PermissionsEnum.BILLING_VIEW,
    PermissionsEnum.BILLING_CREATE,
    PermissionsEnum.BILLING_UPDATE,
    PermissionsEnum.BILLING_DELETE,
  ],

  INVENTORY_MANAGEMENT: [
    PermissionsEnum.INVENTORY_VIEW,
    PermissionsEnum.INVENTORY_CREATE,
    PermissionsEnum.INVENTORY_UPDATE,
    PermissionsEnum.INVENTORY_DELETE,
  ],

  CALL_CENTER_MANAGEMENT: [
    PermissionsEnum.CALL_CENTER_VIEW,
    PermissionsEnum.CALL_CENTER_MANAGE,
  ],

  EMPLOYEE_MANAGEMENT: [
    PermissionsEnum.EMPLOYEE_VIEW,
    PermissionsEnum.EMPLOYEE_CREATE,
    PermissionsEnum.EMPLOYEE_UPDATE,
    PermissionsEnum.EMPLOYEE_DELETE,
  ],

  COMPANY_MANAGEMENT: [
    PermissionsEnum.COMPANY_VIEW,
    PermissionsEnum.COMPANY_CREATE,
    PermissionsEnum.COMPANY_UPDATE,
    PermissionsEnum.COMPANY_DELETE,
  ],

  CLINIC_COLLECTION_MANAGEMENT: [
    PermissionsEnum.CLINIC_COLLECTION_VIEW,
    PermissionsEnum.CLINIC_COLLECTION_CREATE,
    PermissionsEnum.CLINIC_COLLECTION_UPDATE,
    PermissionsEnum.CLINIC_COLLECTION_DELETE,
  ],

  CLINIC_MANAGEMENT: [
    PermissionsEnum.CLINIC_VIEW,
    PermissionsEnum.CLINIC_CREATE,
    PermissionsEnum.CLINIC_UPDATE,
    PermissionsEnum.CLINIC_DELETE,
  ],

  DEPARTMENT_MANAGEMENT: [
    PermissionsEnum.DEPARTMENT_VIEW,
    PermissionsEnum.DEPARTMENT_CREATE,
    PermissionsEnum.DEPARTMENT_UPDATE,
    PermissionsEnum.DEPARTMENT_DELETE,
  ],

  MEDICAL_RECORD_ACCESS: [
    PermissionsEnum.MEDICAL_RECORD_VIEW,
    PermissionsEnum.MEDICAL_RECORD_UPDATE,
    PermissionsEnum.MEDICAL_RECORD_DELETE,
    PermissionsEnum.MEDICAL_RECORD_CREATE,
  ],

  REPORTS_ACCESS: [PermissionsEnum.REPORTS_VIEW],
};

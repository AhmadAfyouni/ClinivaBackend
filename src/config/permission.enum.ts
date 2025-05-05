export enum PermissionsEnum {
  ADMIN = 'admin',

  USER_VIEW = 'user_view',
  USER_CREATE = 'user_create',
  USER_UPDATE = 'user_update',
  USER_DELETE = 'user_delete',

  ROLE_VIEW = 'role_view',
  ROLE_CREATE = 'role_create',
  ROLE_UPDATE = 'role_update',
  ROLE_DELETE = 'role_delete',


  PATIENT_VIEW = 'patient_view',
  PATIENT_CREATE = 'patient_create',
  PATIENT_UPDATE = 'patient_update',
  PATIENT_DELETE = 'patient_delete',

  APPOINTMENT_VIEW = 'appointment_view',
  APPOINTMENT_CREATE = 'appointment_create',
  APPOINTMENT_UPDATE = 'appointment_update',
  APPOINTMENT_DELETE = 'appointment_delete',

  BILLING_VIEW = 'billing_view',
  BILLING_CREATE = 'billing_create',
  BILLING_UPDATE = 'billing_update',
  BILLING_DELETE = 'billing_delete',

  INVENTORY_VIEW = 'inventory_view',
  INVENTORY_CREATE = 'inventory_create',
  INVENTORY_UPDATE = 'inventory_update',
  INVENTORY_DELETE = 'inventory_delete',

  CALL_CENTER_VIEW = 'call_center_view',
  CALL_CENTER_MANAGE = 'call_center_manage',

  EMPLOYEE_VIEW = 'employee_view',
  EMPLOYEE_CREATE = 'employee_create',
  EMPLOYEE_UPDATE = 'employee_update',
  EMPLOYEE_DELETE = 'employee_delete',

  COMPANY_VIEW = 'company_view',
  COMPANY_CREATE = 'company_create',
  COMPANY_UPDATE = 'company_update',
  COMPANY_DELETE = 'company_delete',

  CLINIC_COLLECTION_VIEW = 'clinic_collection_view',
  CLINIC_COLLECTION_CREATE = 'clinic_collection_create',
  CLINIC_COLLECTION_UPDATE = 'clinic_collection_update',
  CLINIC_COLLECTION_DELETE = 'clinic_collection_delete',

  CLINIC_VIEW = 'clinic_view',
  CLINIC_CREATE = 'clinic_create',
  CLINIC_UPDATE = 'clinic_update',
  CLINIC_DELETE = 'clinic_delete',

  DEPARTMENT_VIEW = 'department_view',
  DEPARTMENT_CREATE = 'department_create',
  DEPARTMENT_UPDATE = 'department_update',
  DEPARTMENT_DELETE = 'department_delete',

  MEDICAL_RECORD_VIEW = 'medical_record_view',
  MEDICAL_RECORD_UPDATE = 'medical_record_update',
  MEDICAL_RECORD_DELETE = 'medical_record_delete',
  MEDICAL_RECORD_CREATE = 'medical_record_create',

  SERVICE_CREATE = 'service_create',
  SERVICE_UPDATE = 'service_update',
  SERVICE_DELETE = 'service_delete',
  
  REPORTS_VIEW = 'reports_view',
}

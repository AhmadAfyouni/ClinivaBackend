import {PermissionsEnum} from "./permission.enum";

export const PermissionsGroupEnum = {
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
};

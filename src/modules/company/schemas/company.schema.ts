import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GeneralInfo } from 'src/common/utils';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  _id: Types.ObjectId;

  @Prop({ required: true })
  tradeName: string;

  @Prop({ required: true })
  legalName: string;

  @Prop({ required: false })
  logo: string;

  @Prop({ type: GeneralInfo })
  generalInfo: GeneralInfo;

  @Prop({ default: false })
  deleted: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

/**
 * Example JSON for adding a new company:
 *
 * {
 *   "tradeName": "Al-Noor Medical Center",
 *   "legalName": "Al-Noor Medical Services Co. Ltd.",
 *   "generalInfo": {
 *     "logo": "https://example.com/logo.png",
 *     "yearOfEstablishment": 2010,
 *     "vision": "To be the leading healthcare provider in the region",
 *     "goals": "Provide exceptional healthcare services with compassion and excellence",
 *     "overview": "A state-of-the-art medical center providing comprehensive healthcare services",
 *     "ceo": "Dr. Ahmed Al-Ghamdi",
 *     "contactInformation": {
 *       "phone_numbers": "+966112345678",
 *       "email": "info@alnoormedical.com",
 *       "webSite": "https://www.alnoormedical.com",
 *       "buildingNumber": "1234",
 *       "streetName": "King Fahd Road",
 *       "district": "Al-Olaya",
 *       "city": "Riyadh",
 *       "postalCode": "12345",
 *       "additionalNumber": "5678",
 *       "unitNumber": "101",
 *       "latitude": 24.7136,
 *       "longitude": 46.6753
 *     },
 *     "LinkedIn": "https://linkedin.com/company/alnoormedical",
 *     "Twitter": "https://twitter.com/alnoormedical",
 *     "Facebook": "https://facebook.com/alnoormedical",
 *     "Instagram": "https://instagram.com/alnoormedical",
 *     "FinanceInfo": {
 *       "VAT": "123456789012345",
 *       "CR": "1012345678"
 *     },
 *     "PrivacyPolicy": {
 *       "title": "Privacy Policy",
 *       "content": "This is the privacy policy content..."
 *     },
 *     "TermsConditions": {
 *       "title": "Terms and Conditions",
 *       "content": "These are the terms and conditions..."
 *     },
 *     "Key_member": "Key Member Information",
 *     "Founder_Executives": "Founder and Executives Information"
 *   }
 * }
 */

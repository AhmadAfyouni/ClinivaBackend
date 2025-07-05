import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GeneralInfo } from 'src/common/utils';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Trading name of the company',
    example: 'Al-Noor Medical Center',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tradeName: string;

  @ApiProperty({
    description: 'URL to the company logo',
    required: false,
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    description: 'Legal name of the company',
    example: 'Al-Noor Medical Services Co. Ltd.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  legalName: string;

  @ApiProperty({
    description: 'General information about the company',
    type: GeneralInfo,
  })
  @ValidateNested()
  @Type(() => GeneralInfo)
  generalInfo: GeneralInfo;
}

// export class GeneralInfoDto {
//   @ApiPropertyOptional({
//     description: 'URL to the company logo',
//     example: 'https://example.com/logo.png',
//   })
//   @IsOptional()
//   @IsString()
//   logo?: string;

//   @ApiPropertyOptional({
//     description: 'Year the company was established',
//     example: 2010,
//   })
//   @IsOptional()
//   @IsNumber()
//   yearOfEstablishment?: number;

//   @ApiPropertyOptional({
//     description: 'Company vision statement',
//     example: 'To be the leading healthcare provider in the region',
//   })
//   @IsOptional()
//   @IsString()
//   vision?: string;

//   @ApiPropertyOptional({
//     description: 'Company goals and objectives',
//     example:
//       'Provide exceptional healthcare services with compassion and excellence',
//   })
//   @IsOptional()
//   @IsString()
//   goals?: string;

//   @ApiPropertyOptional({
//     description: 'Company overview',
//     example:
//       'A state-of-the-art medical center providing comprehensive healthcare services',
//   })
//   @IsOptional()
//   @IsString()
//   overview?: string;

//   @ApiPropertyOptional({
//     description: 'Name of the CEO',
//     example: 'Dr. Ahmed Al-Ghamdi',
//   })
//   @IsOptional()
//   @IsString()
//   ceo?: string;

//   @ApiPropertyOptional({
//     description: 'Contact information',
//     type: ContactInfoBase,
//   })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => ContactInfoBase)
//   contactInformation?: ContactInfoBase;

//   @ApiPropertyOptional({
//     description: 'LinkedIn profile URL',
//     example: 'https://linkedin.com/company/example',
//   })
//   @IsOptional()
//   @IsString()
//   LinkedIn?: string;

//   @ApiPropertyOptional({
//     description: 'Twitter profile URL',
//     example: 'https://twitter.com/example',
//   })
//   @IsOptional()
//   @IsString()
//   Twitter?: string;

//   @ApiPropertyOptional({
//     description: 'Facebook page URL',
//     example: 'https://facebook.com/example',
//   })
//   @IsOptional()
//   @IsString()
//   Facebook?: string;

//   @ApiPropertyOptional({
//     description: 'Instagram profile URL',
//     example: 'https://instagram.com/example',
//   })
//   @IsOptional()
//   @IsString()
//   Instagram?: string;

//   @ApiPropertyOptional({
//     description: 'Financial information',
//     example: { VAT: '1234567890', CR: '1234567890' },
//   })
//   @IsOptional()
//   @IsObject()
//   FinanceInfo?: { VAT: string; CR: string };

//   @ApiPropertyOptional({
//     description: 'Privacy policy',
//     example: {
//       title: 'Privacy Policy',
//       content: 'Our privacy policy content...',
//     },
//   })
//   @IsOptional()
//   @IsObject()
//   PrivacyPolicy?: { title: string; content: string };

//   @ApiPropertyOptional({
//     description: 'Terms and conditions',
//     example: { title: 'Terms', content: 'Our terms and conditions...' },
//   })
//   @IsOptional()
//   @IsObject()
//   TermsConditions?: { title: string; content: string };

//   @ApiPropertyOptional({
//     description: 'Key member information',
//     example: 'Key member details',
//     default: 'Key_member',
//   })
//   @IsOptional()
//   @IsString()
//   Key_member?: string = 'Key_member';

//   @ApiPropertyOptional({
//     description: 'Founder and executives information',
//     example: 'Founder details',
//     default: 'Founder/Executives',
//   })
//   @IsOptional()
//   @IsString()
//   Founder_Executives?: string = 'Founder/Executives';
//   @IsOptional()
//   @IsObject()
//   locationGoogl?: { x: number; y: number };
// }

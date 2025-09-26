import { AxisFinanceUBLInterface } from './PD/interface/axis-finance-ubl.interface';
import { PDBusinessVerificationData } from './PD/interface/pd-business.interface';
import { axisFinanceUBLTemplate } from './PD/axis-finance-ubl.template';
import { axisagriTemplate } from './PD/axis-bank.template';
import { idfcHlMlTemplate } from './PD/idfc-hl-ml.template';
import { idfcPlTemplate } from './PD/idfc-pl.template';
import { iiflTemplate } from './PD/iifl.template';
import { cholaTemplate } from './PD/chola.template';
import { ambitTemplate } from './PD/ambit.template';
import { adityabirlaTemplate } from './PD/adityabirla.template';
import { S3Service } from 'src/modules/common/s3utils/s3.service';
import { Injectable } from '@nestjs/common';


@Injectable()
export class PDTemplateService {
    constructor(private s3Service: S3Service) { }

    async InterfaceMapping(bankName: string, verification: any, s3Service: S3Service) {
        if (bankName === 'AXIS FINANCE UBL') {
            let verificationData = verification.verificationData as AxisFinanceUBLInterface;
        }
    }
}



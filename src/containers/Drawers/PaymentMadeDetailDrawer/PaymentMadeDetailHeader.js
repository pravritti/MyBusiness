import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';

import {
  Row,
  Col,
  FormatDate,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
  ButtonLink,
} from 'components';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

/**
 * Payment made - detail panel - header.
 */
export default function PaymentMadeDetailHeader() {
  const { paymentMade } = usePaymentMadeDetailContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <DetailItem label={intl.get('amount')}>
            <h3 class="big-number">{paymentMade.formatted_amount}</h3>
          </DetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('payment_made.details.payment_number')}
              children={defaultTo(paymentMade.payment_number, '-')}
            />
            <DetailItem label={intl.get('vendor_name')}>
              <ButtonLink>{paymentMade.vendor?.display_name}</ButtonLink>
            </DetailItem>
            <DetailItem
              label={intl.get('payment_account')}
              children={paymentMade.payment_account?.name}
            />

            <DetailItem
              label={intl.get('payment_date')}
              children={<FormatDate value={paymentMade.payment_date} />}
            />
          </DetailsMenu>
        </Col>
        <Col xs={6}>
          <DetailsMenu
            textAlign={'right'}
            direction={'horizantal'}
            minLabelSize={'180px'}
          >
            <DetailItem
              label={intl.get('description')}
              children={defaultTo(paymentMade.statement, '-')}
            />
            <DetailItem
              label={intl.get('created_at')}
              children={<FormatDate value={paymentMade.created_at} />}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}

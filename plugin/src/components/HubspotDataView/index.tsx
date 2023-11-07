import React, { useState } from 'react';

import * as Flex from "@twilio/flex-ui";
import { Alert } from '@twilio-paste/core/alert';
import { Text } from '@twilio-paste/core/text';
import { Box, Stack } from '@twilio-paste/core';
import useApi from '../../hooks/useApi';
import TableErrorBox from './TableErrorBox';
import ContactCard from './ContactCard';
import SendSmsModal from './SendSmsModal';
import SendWAModal from './SendWAModal';
import { ICustomer, IHubspotResponse, ITableDataState } from '../../Types';

const HubspotDataView = ({ route, manager } : { route: any, manager: Flex.Manager}) => {

  console.log('JRUMEAU', route);
  const { getData } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [crmid, setCrmid] = useState<string>(route.match.params.crmid);
  const [contact, setContact] = useState<any>({});
  const [selectedSmsContact, setSelectedSmsContact] = useState < ICustomer > ();
  const [selectedWAContact, setSelectedWAContact] = useState < ICustomer > ();

  React.useEffect(() => {

    setIsLoading(true);
    setContact({});
    setError(undefined);

    getData({ crmid })
      .then(data => setContact(data))
      .catch(() => setError("Error while fetching data from Hubspot"))
      .finally(() => setIsLoading(false));
    
    console.log('CONTACT', contact);
  }, [getData]);
  // Ahora puedes usar el valor de "crmid" en tu lógica
  //console.log("Valor del parámetro 'crmid':", crmid);

  const [isOpen, setIsOpen] = useState(true);
  if (!isOpen) {
    return null;
  }

  const sendSmsHandler = React.useCallback((data) => {
    setSelectedSmsContact(data);
  }, []);

  const sendWAHandler = React.useCallback((data) => {
    setSelectedWAContact(data);
  }, []);

  const handleCloseModel = React.useCallback(() => {
    setSelectedSmsContact(undefined);
    setSelectedWAContact(undefined);
  }, []);

  return (
    <>
      <SendSmsModal selectedContact={selectedSmsContact} manager={manager} handleClose={handleCloseModel} />
      <SendWAModal selectedContact={selectedWAContact} manager={manager} handleClose={handleCloseModel} />
      <Box
        marginBottom="space60"
        marginTop={["space10", "space110"]}
        marginLeft="space60"
        marginRight="space60"
      >
        <Stack orientation="vertical" spacing="space50">
          <TableErrorBox error={error} />
          <ContactCard isLoading={isLoading} data={contact.properties} manager={manager} sendSmsHandler={sendSmsHandler} sendWAHandler={sendWAHandler} />
        </Stack>
      </Box>
    </>
  );
};

export default HubspotDataView;

import { Card, Heading, Paragraph, Button, SkeletonLoader, Box, Badge, Stack } from '@twilio-paste/core';
import { random } from '../../Helpers';
import { useState, useCallback, useEffect } from 'react';
import { FaPhoneAlt, FaSms, FaWhatsapp } from 'react-icons/fa';
import * as Flex from "@twilio/flex-ui";
import { ICustomer } from 'Types';

type Props = {
    isLoading: boolean;
    data: ICustomer
    sendSmsHandler: (data: ICustomer) => void;
    sendWAHandler: (data: ICustomer) => void;
    manager: Flex.Manager
}

function ContactCard({ isLoading, data, manager, sendSmsHandler, sendWAHandler }: Props) {
    const [bmgversion, setBmgversion] = useState<boolean>(false);

    const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);

    const afterSetActivityListener = useCallback((payload) => {
        if (payload.activityAvailable) {
            setActionDisabled(false)
        } else {
            setActionDisabled(true)
        }
    }, []);

    const initiateCallHandler = useCallback((data) => {
        Flex.Actions.invokeAction("StartOutboundCall", {
            destination: data.phone,
            taskAttributes: {
                name: `${data.firstname || ''} ${data.lastname || ''}`.trim(),
                hubspot_contact_id: data.hs_object_id
            }
        });
    }, []);

    useEffect(() => {
        Flex.Actions.addListener("afterSetActivity", afterSetActivityListener);

        return () => {
            Flex.Actions.removeListener("afterSetActivity", afterSetActivityListener)
        }
    }, [afterSetActivityListener])

    if (isLoading) {
        return (
            <Card>
                <Heading as="h2" variant="heading20"><SkeletonLoader width={`${random(50, 100)}%`} /></Heading>
                    <SkeletonLoader width={`${random(80, 100)}%`} />
            </Card>
        )
    }

    if (!data) {
        return (
            <Card>
                <Heading as="h2" variant="heading20">Ooops</Heading>
                <Paragraph>
                    No se ha encontrado el contacto seleccionado.
                </Paragraph>
            </Card>
        )
    }

    return (
        <>
            <Card>
                {(data.firstname != '' || data.lastname != '') && <Heading as="h2" variant="heading20">{data.firstname} {data.lastname}</Heading>}
                {(data.firstname == '' && data.lastname == '') && <Heading as="h2" variant="heading20">No name provided</Heading>}
                <Paragraph>
                    Seleccione el método de interacción con el contacto seleccionado.
                </Paragraph>
                <Stack orientation="horizontal" spacing="space30">
                    <Button variant="primary" title={actionDisabled ? "To make a call, please change your status from 'Offline'" : "Make a call"} disabled={actionDisabled} onClick={() => initiateCallHandler(data)}><FaPhoneAlt /> Call</Button>
                    {bmgversion && <Button variant="primary" title={actionDisabled ? "To send a SMS, please change your status from 'Offline'" : "Send a SMS"} disabled={actionDisabled} onClick={() => sendSmsHandler(data)}><FaSms /> SMS</Button>}
                    {bmgversion && <Button variant="primary" title={actionDisabled ? "To send a WhatsApp, please change your status from 'Offline'" : "Send a WhatsApp"} disabled={actionDisabled} onClick={() => sendWAHandler(data)}><FaWhatsapp /> WhatsApp</Button>}
                </Stack>
            </Card>
        </>
    )
}

export default ContactCard;
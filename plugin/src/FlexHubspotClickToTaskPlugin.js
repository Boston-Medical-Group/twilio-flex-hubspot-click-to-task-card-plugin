import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import * as Flex from "@twilio/flex-ui";
import { CustomizationProvider } from "@twilio-paste/core/customization";

import HubspotDataView from './components/HubspotDataView';

const PLUGIN_NAME = 'FlexHubspotClickToTaskPlugin';

export default class FlexHubspotClickToTaskPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {

    flex.setProviders({
      PasteThemeProvider: CustomizationProvider
    });
    // display customer name on outbound call task
    manager.strings.TaskLineOutboundCallHeader = "{{#if task.attributes.name}} {{task.attributes.name}}{{else}} {{task.attributes.outbound_to}}{{/if}}";

    flex.ViewCollection.Content.add(
      <Flex.View name="customer" key="customer" route={{ path: "/customer/:crmid" }}>
        <HubspotDataView key="HubspotDataView" manager={manager} route={flex.route} />
      </Flex.View>
    );

  }
}

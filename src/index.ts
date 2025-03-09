/**
 * Room Summary Card Registration Module
 *
 * This module handles the registration of the Room Summary Card custom element
 * with the browser and Home Assistant's custom card registry. It makes the
 * component available for use in Home Assistant dashboards.
 */

import { PetKitDeviceEditor } from '@cards/editor';
import { PetKitDevice } from './cards/card';

// Register the custom element with the browser
customElements.define('petkit-device', PetKitDevice);
customElements.define('petkit-device-editor', PetKitDeviceEditor);

// Ensure the customCards array exists on the window object
window.customCards = window.customCards || [];

// Register the card with Home Assistant's custom card registry
window.customCards.push({
  // Unique identifier for the card type
  type: 'petkit-device',

  // Display name in the UI
  name: 'PetKit Device',

  // Card description for the UI
  description: 'A card to summarize the status of a PetKit Device.',

  // Show a preview of the card in the UI
  preview: true,

  // URL for the card's documentation
  documentationURL:
    'https://github.com/homeassistant-extras/petkit-device-cards',
});

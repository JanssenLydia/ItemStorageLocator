# Item Storage Locator Cloud App
## Add, update and verify storage location IDs of Alma items

### Description
The Item Storage Locator Cloud App, developed at KU Leuven Libraries - LIBIS, offers functionality for the management of storage location IDs on an item basis. It aims to provide a valuable tool for workflows involving the assignment of storage locations to new items, as well as the retrieval and reshelving of existing items. The Item Storage Locator Cloud Apps offers three main functions:

1. Assignment of storage location IDs to new and existing items, e.g. in the context of acquisitions or reordering of stack rooms
2. Lookup of storage location IDs of items that need to be reshelved
3. Verification of the storage location ID after reshelving

### User guide

#### Start: Scan item to collection Alma item record
To start a new workflow, tap on the 'Item Barcode' input field to enter the item barcode. Item barcodes may be entered automatically using a barcode scanner or added manually by typing the barcode into the input box. Press enter to start the item lookup. After the barcode has been entered, the Cloud App will perform an Alma API lookup to retrieve the corresponding Alma item record. 
*Note: when using a barcode scanner, you should configure you barcode scanner to output an 'enter' signal upon scanning the barcode.*

If the record is found, the item callnumber will appear in the top right corner of the input form, directly above the barcode field. The barcode will remain visible until clear using the 'Clear' button or until the barcode input field is tapped to signal the start of a new lookup. If the Cloud Apps fails to retrieve the record, e.g. because the barcode is not registered correctly in Alma, an error message will in the message area below the 'Check' and 'Set' buttons.

After the item has been loaded, three actions can be performed on the item record.

#### Action 1: Set new storage location ID for item
To set a new storage location ID for the item, tap the 'Item Location' input field and enter the desired storage location ID. Like the barcode, the item location code may be entered using either a barcode scanner or using a keyboard. It is not necessary to press 'enter' after entering the location ID - the tool will pick up this value upon clicking the action button.

To enter the new storage location ID into the item record, press the 'Set' button below the input form. The Cloud App will verify and ask for confirmation if a storage location ID had already been set for the item to avoid unintentional overwrites:

- If no storage location ID is present in the item record, the storage location ID will be entered into the item record without further confirmation
- If the storage location ID is identical to the storage location ID already stored in the item record, a message will appear in the message area indicating the location had already been set
- If a different storage location ID is already registered in the item record, the Item Storage Locator will ask for confirmation before entering the new storage location ID. The current storage location ID is indicated in the confirmation dialog. Press 'No' to abort the action, press 'Yes' to overwrite the current storage location ID

A message will appear in the message area to indicate if the storage location ID has been successfully set in the Alma record.

#### Action 2: Look up storage location ID of an item
To look up the storage location ID of an item, press the 'Check' button below the input form, without entering data into the 'Item location' field. The current storage location ID will appear in the 'Item location' field. If no storage location ID is registered for the item, a message will appear in the message area.

#### Action 3: Check storage location ID of an item
To verify a storage location ID during reshelving, enter a storage location ID into the 'Item Location' field. A barcode scanner or keyboard may be used. A message will appear in the message area indicating if the item location matches the storage location ID registered in the item record. If the location code is different from the item's storage location ID, the current storage location ID is provided as part of the output message easily retrieve the correct location of the item.

#### Reset form
To reset the input form, click the 'Item barcode' input field or push the 'Clear' button at the bottom of the screen.
*Note: After a failed item lookup, the Cloud App may have trouble to recognize a click on the 'Item barcode' input field, because the field is still in focus. Should this happen, use the 'Clear' button to explicitly trigger a reset of the input form and start a new workflow.*

### Installation in Alma
To install the Item Storage Location Cloud App, follow the standard procedure for activating Cloud Apps in your Alma environment. The app does not require additional configuration or settings.

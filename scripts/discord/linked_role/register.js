const fetch = require('cross-fetch');
const config = require('./config.js');

/**
 * Register the metadata to be stored by Discord. This should be a one-time action.
 * Note: uses a Bot token for authentication, not a user token.
 */
const url = `https://discord.com/api/v10/applications/${config.DISCORD_CLIENT_ID}/role-connections/metadata`;
// supported types: number_lt=1, number_gt=2, number_eq=3 number_neq=4, datetime_lt=5, datetime_gt=6, boolean_eq=7, boolean_neq=8
const body = [
  {
    key: 'cookieseaten',
    name: 'Cookies Eaten',
    description: 'Cookies Eaten Greater Than',
    type: 2,
  },
  {
    key: 'allergictonuts',
    name: 'Allergic To Nuts',
    description: 'Is Allergic To Nuts',
    type: 7,
  },
  {
    key: 'bakingsince',
    name: 'Baking Since',
    description: 'Days since baking their first cookie',
    type: 6,
  },
];

fetch(url, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${config.DISCORD_TOKEN}`,
  },
}).then(response => {
  if (response.ok) {
    return response.json();
  } else {
    return response.text().then(error => {
      throw new Error(`Error pushing discord metadata schema: [${response.status}] ${response.statusText}\n${error}`);
    });
  }
}).then(data => {
  console.log(data);
}).catch(error => {
  console.error(error);
});
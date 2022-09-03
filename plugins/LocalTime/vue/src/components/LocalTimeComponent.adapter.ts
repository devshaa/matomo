/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import { createAngularJsAdapter } from 'CoreHome';
import MatomoLocalTimeComponent from './MatomoLocalTimeComponent.vue';

export default createAngularJsAdapter({
  component: MatomoLocalTimeComponent,
  directiveName: 'matomoLocalTimeComponent',
  scope: {
    isTimeFormatTwelve: {
      angularJsBind: '<',
    },
  },
});

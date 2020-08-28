import { Controls } from './components/controls/controls';
import { Virchual } from './virchual';

export { Virchual, Controls };

// For CommonJS default export support
module.exports = { Virchual, Controls };
module.exports.default = Virchual;
module.exports.__esModule = true;

import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './Components/App/App';
import * as serviceWorker from './serviceWorker';

import './i18n';

render(
	<StrictMode>
		<App />
	</StrictMode>,
	document.getElementById('root')
);

serviceWorker.register();

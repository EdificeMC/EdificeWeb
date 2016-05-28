'use strict';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export class NotifyService {
    error(text, options) {
        toastr.error(text, null, options);
    }
}

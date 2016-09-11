import {BootstrapFormValidationRenderer} from './renderer';

export function configure(config) {
    config.container.registerHandler(
        'bootstrap-form',
        container => container.get(BootstrapFormValidationRenderer));
}

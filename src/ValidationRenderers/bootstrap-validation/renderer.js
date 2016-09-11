import {inject} from 'aurelia-dependency-injection';
import {validationRenderer} from 'aurelia-validation';

@validationRenderer
@inject(Element)
export class BootstrapFormValidationRenderer {
    constructor(boundaryElement) {
        this.boundaryElement = boundaryElement;
    }

    render(error, target) {
        if (!target || !(this.boundaryElement === target || this.boundaryElement.contains(target))) {
            return;
        }

        // tag the element so we know we rendered into it.
        target.errors = (target.errors || new Map());
        target.errors.set(error);

        // add the has-error class to the bootstrap form-group div
        const formGroup = target.querySelector('.form-group') || target.closest('.form-group');
        formGroup.classList.add('has-error');

        // add help-block
        const message = document.createElement('span');
        message.classList.add('help-block');
        message.classList.add('validation-error');
        message.textContent = error.message;
        message.error = error;
        formGroup.appendChild(message);
    }

    unrender(error, target) {
        if (!target || !target.errors || !target.errors.has(error)) {
            return;
        }
        target.errors.delete(error);

        // remove the has-error class on the bootstrap form-group div
        const formGroup = target.querySelector('.form-group') || target.closest('.form-group');
        formGroup.classList.remove('has-error');

        // remove all messages related to the error.
        let messages = formGroup.querySelectorAll('.validation-error');
        let i = messages.length;
        while (i--) {
            let message = messages[i];
            if (message.error !== error) {
                continue;
            }
            message.error = null;
            message.remove();
        }
    }
}

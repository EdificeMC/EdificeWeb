import { bindable } from 'aurelia-framework';
import $ from 'jquery';
import 'bootstrap';

export class BootstrapTooltipCustomAttribute {
    static inject = [Element];
    constructor(element) {
        this.element = element;
    }

    bind() {
        $(this.element).tooltip();
    }

    unbind() {
        $(this.element).tooltip('destroy');
    }
}

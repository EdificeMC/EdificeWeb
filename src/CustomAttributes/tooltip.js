import { bindable, inject } from 'aurelia-framework';
import $ from 'jquery';

@inject(Element)
export class TooltipCustomAttribute {
    @bindable title = '';
    @bindable placement = 'top';
    @bindable trigger = 'hover';
    constructor(element) {
        this.element = element;
    }

    bind() {
        // initialize the popover
        $(this.element).tooltip({
            title: this.title,
            placement: this.placement,
            trigger: this.trigger
        });
        
        if(this.trigger === 'click') {
            // Hide the tooltip after 1.5 seconds
            $(this.element).on('shown.bs.tooltip', function(e) {
                setTimeout(function() {
                    $(e.target).trigger('click'); // Have to do this hack since $(e.target).tooltip('toggle'); doesn't work for some reason
                }, 1500)
            });
        }
    }
}

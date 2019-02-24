import { dataEn } from '../../data';
import { t } from '../util/locale';


export function uiImproveOsmHeader() {
    var _error;


    function errorTitle(d) {
        var unknown = t('inspector.unknown');

        if (!d) return unknown;
        var errorType = d.error_key;
        var et = dataEn.QA.improveOSM.error_types[errorType];

        if (et && et.title) {
            return t('QA.improveOSM.error_types.' + errorType + '.title');
        } else {
            return unknown;
        }
    }


    function improveOsmHeader(selection) {
        var header = selection.selectAll('.error-header')
            .data(
                (_error ? [_error] : []),
                function(d) { return d.id + '-' + (d.status || 0); }
            );

        header.exit()
            .remove();

        var headerEnter = header.enter()
            .append('div')
            .attr('class', 'error-header');

        var iconEnter = headerEnter
            .append('div')
            .attr('class', 'error-header-icon')
            .classed('new', function(d) { return d.id < 0; });

        var svgEnter = iconEnter
            .append('svg')
            .attr('width', '20px')
            .attr('height', '30px')
            .attr('viewbox', '0 0 20 30')
            .attr('class', function(d) {
                return [
                    'preset-icon-28',
                    'qa_error',
                    d.service,
                    'error_id-' + d.id,
                    'error_type-' + d.error_type,
                    'category-' + d.category
                ].join(' ');
            });

        svgEnter
            .append('polygon')
            .attr('fill', 'currentColor')
            .attr('class', 'qa_error-fill')
            .attr('points', '16,3 4,3 1,6 1,17 4,20 7,20 10,27 13,20 16,20 19,17.033 19,6');

        svgEnter
            .append('use')
            .attr('class', 'icon-annotation')
            .attr('width', '11px')
            .attr('height', '11px')
            .attr('transform', 'translate(4.5, 7)')
            .attr('xlink:href', function(d) {
                var picon = d.icon;

                if (!picon) {
                    return '';
                } else {
                    var isMaki = /^maki-/.test(picon);
                    return '#' + picon + (isMaki ? '-11' : '');
                }
            });

        headerEnter
            .append('div')
            .attr('class', 'error-header-label')
            .text(errorTitle);
    }


    improveOsmHeader.error = function(val) {
        if (!arguments.length) return _error;
        _error = val;
        return improveOsmHeader;
    };


    return improveOsmHeader;
}

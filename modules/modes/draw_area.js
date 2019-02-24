import { t } from '../util/locale';
import { behaviorDrawWay } from '../behavior';


export function modeDrawArea(context, wayID, startGraph, baselineGraph) {
    var mode = {
        button: 'area',
        id: 'draw-area'
    };

    var behavior;

    mode.wayID = wayID;

    mode.enter = function() {
        var way = context.entity(wayID);

        behavior = behaviorDrawWay(context, wayID, undefined, mode, startGraph, baselineGraph)
            .tail(t('modes.draw_area.tail'));

        var addNode = behavior.addNode;

        behavior.addNode = function(node, d) {
            var length = way.nodes.length;
            var penultimate = length > 2 ? way.nodes[length - 2] : null;

            if (node.id === way.first() || node.id === penultimate) {
                behavior.finish();
            } else {
                addNode(node, d);
            }
        };

        context.install(behavior);
    };


    mode.exit = function() {
        context.uninstall(behavior);
    };


    mode.selectedIDs = function() {
        return [wayID];
    };


    mode.activeID = function() {
        return (behavior && behavior.activeID()) || [];
    };


    return mode;
}

import { t } from '../util/locale';
import { behaviorDrawWay } from '../behavior/draw_way';
import { modeSelect } from './select';
import { utilDisplayLabel } from '../util';
import { modeAddLine } from '../modes';

export function modeDrawLine(context, wayID, startGraph, baselineGraph, button, affix, addMode) {
    if (addMode === true) {
        addMode = modeAddLine(context, {});
    }

    var mode = {
        button: button,
        id: 'draw-line',
        title: (addMode && addMode.title) || utilDisplayLabel(context.entity(wayID), context)
    };

    mode.addMode = addMode;

    mode.wayID = wayID;

    mode.isContinuing = !!affix;

    var behavior;

    mode.enter = function() {

        if (addMode) {
            // add in case this draw mode was entered from somewhere besides the add mode itself
            addMode.addAddedEntityID(wayID);
        }

        var way = context.entity(wayID);
        var index = (affix === 'prefix') ? 0 : undefined;
        var headID = (affix === 'prefix') ? way.first() : way.last();

        behavior = behaviorDrawWay(context, wayID, index, mode, startGraph, baselineGraph)
            .tail(t('modes.draw_line.tail'));

        var addNode = behavior.addNode;
        behavior.addNode = function(node, d) {
            if (node.id === headID) {
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

    mode.repeatAddedFeature = function(val) {
        if (addMode) return addMode.repeatAddedFeature(val);
    };

    mode.addedEntityIDs = function() {
        if (addMode) return addMode.addedEntityIDs();
    };

    mode.didFinishAdding = function() {
        if (mode.repeatAddedFeature()) {
            context.enter(mode.addMode);
        }
        else {
            context.enter(modeSelect(context, mode.addedEntityIDs() || [wayID]).newFeature(!mode.isContinuing));
        }
    };


    mode.selectedIDs = function() {
        return [wayID];
    };


    mode.activeID = function() {
        return (behavior && behavior.activeID()) || [];
    };


    mode.finish = function(skipCompletion) {
        if (skipCompletion) {
            mode.didFinishAdding = function() {};
        }
        return behavior.finish();
    };


    return mode;
}

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//import arc from 'arc';
/**
 * Transform L.LatLng to {x, y} object
 * @param {L.LatLng} latlng
 * @returns {{x: {number}, y: {number}}}
 * @private
 */
var _latLngToXY = function _latLngToXY(latlng) {
    return {
        x: latlng.lng,
        y: latlng.lat
    };
};

/**
 * Create array of L.LatLng objects from line produced by arc.js
 * @param {object} line
 * @param {L.LatLng} from
 * @private
 * @returns {Array}
 */
function _createLatLngs(line, from) {
    if (line.geometries[0] && line.geometries[0].coords[0]) {
        /**
         * stores how many times arc is broken over 180 longitude
         * @type {number}
         */
        var wrap = from.lng - line.geometries[0].coords[0][0] - 360;

        return line.geometries.map(function (subLine) {
            wrap += 360;
            return subLine.coords.map(function (point) {
                return L.latLng([point[1], point[0] + wrap]);
            });
        }).reduce(function (all, latlngs) {
            return all.concat(latlngs);
        });
    } else {
        return [];
    }
}

if (!L) {
    throw new Error('Leaflet is not defined');
} else {
    /**
     *
     * @param {L.LatLng} _from
     * @param {L.LatLng} _to
     * @param {...object} _options
     * @param {..number} _options.vertices
     * @param {..number} _options.offset
     * @returns {L.Polyline}
     * @constructor
     */
    L.Polyline.Arc = function (_from, _to, _options) {

        var from = L.latLng(_from);
        var to = L.latLng(_to);
        var options = _extends({
            vertices: 10,
            offset: 10
        }, _options);

        var generator = new arc.GreatCircle(_latLngToXY(from), _latLngToXY(to));

        var arcLine = generator.Arc(options.vertices, { offset: options.offset });
        var latLngs = _createLatLngs(arcLine, from);
        return L.polyline(latLngs, options);
    };
}
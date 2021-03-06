/* TODO(emily): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, no-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

// From http://jsfiddle.net/LBAr8/

/* Create a new "layer" on the page, like a modal or overlay.
 *
 * var LayeredComponent = React.createClass({
 *     mixins: [LayeredComponentMixin],
 *     render: function() {
 *         // render like usual
 *     },
 *     renderLayer: function() {
 *         // render a separate layer (the modal or overlay)
 *     }
 * });
 */

var React = require('react');
var ReactDOM = require("react-dom");

var LayeredComponentMixin = {
    componentDidMount: function() {
        // Appending to the body is easier than managing the z-index of
        // everything on the page.  It's also better for accessibility and
        // makes stacking a snap (since components will stack in mount order).
        this._layer = document.createElement('div');
        document.body.appendChild(this._layer);
        this._renderLayer();
    },

    componentDidUpdate: function() {
        this._renderLayer();
    },

    componentWillUnmount: function() {
        this._unrenderLayer();
        document.body.removeChild(this._layer);
    },

    _renderLayer: function() {
        // By calling this method in componentDidMount() and
        // componentDidUpdate(), you're effectively creating a "wormhole" that
        // funnels React's hierarchical updates through to a DOM node on an
        // entirely different part of the page.

        var layerElement = this.renderLayer();
        // Renders can return null, but React.render() doesn't like being asked
        // to render null. If we get null back from renderLayer(), just render
        // a noscript element, like React does when an element's render returns
        // null.
        if (layerElement === null) {
            ReactDOM.render(<noscript />, this._layer);
        } else {
            ReactDOM.render(layerElement, this._layer);
        }

        if (this.layerDidMount) {
            this.layerDidMount(this._layer);
        }
    },

    _unrenderLayer: function() {
        if (this.layerWillUnmount) {
            this.layerWillUnmount(this._layer);
        }

        ReactDOM.unmountComponentAtNode(this._layer);
    }
};

module.exports = LayeredComponentMixin;

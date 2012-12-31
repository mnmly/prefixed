// Direct port from `Modernizr.prefixed`

/**
 * Create our "modernizr" element that we do most feature tests on.
 */
var mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
    /*>>prefixes*/

    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/

    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' ');
    /*>>domprefixes*/
    
/**
 * is returns a boolean for if typeof obj is exactly type.
 */
function is( obj, type ) {
    return typeof obj === type;
}

/**
 * contains returns a boolean for if substr is found within str.
 */
function contains( str, substr ) {
    return !!~('' + str).indexOf(substr);
}

function testProps( props, prefixed ) {
    for ( var i in props ) {
        var prop = props[i];
        if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
            return prefixed == 'pfx' ? prop : true;
        }
    }
    return false;
}
/*>>testprop*/

// TODO :: add testDOMProps
/**
 * testDOMProps is a generic DOM property test; if a browser supports
 *   a certain property, it won't return undefined for it.
 */
function testDOMProps( props, obj, elem ) {
    for ( var i in props ) {
        var item = obj[props[i]];
        if ( item !== undefined) {

            // return the property name as a string
            if (elem === false) return props[i];

            // let's bind a function (and it has a bind method -- certain native objects that report that they are a
            // function don't [such as webkitAudioContext])
            if (is(item, 'function') && 'bind' in item){
              // default to autobind unless override
              return item.bind(elem || obj);
            }

            // return the unbound function or obj or value
            return item;
        }
    }
    return false;
}

/*>>testallprops*/
/**
 * testPropsAll tests a list of DOM properties we want to check against.
 *   We specify literally ALL possible (known and/or likely) properties on
 *   the element including the non-vendor prefixed one, for forward-
 *   compatibility.
 */
function testPropsAll( prop, prefixed, elem ) {

    var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
        props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    // did they call .prefixed('boxSizing') or are we just testing a prop?
    if(is(prefixed, "string") || is(prefixed, "undefined")) {
      return testProps(props, prefixed);

    // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
}
/*>>testallprops*/

function prefixed(prop, obj, elem){
  if(!obj) {
    return testPropsAll(prop, 'pfx');
  } else {
    // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
    return testPropsAll(prop, obj, elem);
  }
};

/*
function cssPrefixed( prop, obj, elem ){
    // If `prop` is hypenated, convert it to camelCase.
    prop = prop.replace( /\-(\w)/g, function( a ){ return a.replace(/\-/, '').toUpperCase() } ),
    var str = prefixed( prop, obj, elem );
    if ( str ) return str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
    return false;
}*/


/*
 * Expose `prefixed`
 **/

module.exports = prefixed;

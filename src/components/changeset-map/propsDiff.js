export function propsDiff(propsArray) {
  // Edge case: features may be duplicated. See issue #122.
  // If the changeType is `added` ignore the second feature.
  if (propsArray.length === 1 || propsArray[0].changeType === 'added') {
    var changeType = propsArray[0].changeType;
    if (changeType === 'added') {
      return getAdded(propsArray[0]);
    } else {
      throw new Error('only 1 element but neither added nor deleted');
    }
  } else {
    var oldProps = getOld(propsArray);
    var newProps = getNew(propsArray);
    return getDiff(oldProps, newProps);
  }
}

function getDiff(oldProps, newProps) {
  var ret = {};
  for (var prop in newProps) {
    ret[prop] = {};
    if (!oldProps.hasOwnProperty(prop)) {
      ret[prop]['added'] = newProps[prop];
    } else {
      var oldValue = oldProps[prop];
      var newValue = newProps[prop];
      if (oldValue === newValue) {
        ret[prop]['unchanged'] = newValue;
      } else {
        ret[prop]['modifiedOld'] = oldValue;
        ret[prop]['modifiedNew'] = newValue;
      }
    }
  }
  for (var oldProp in oldProps) {
    if (!ret.hasOwnProperty(oldProp)) {
      ret[oldProp] = {
        deleted: oldProps[oldProp]
      };
    }
  }
  return ret;
}

function getAdded(props) {
  var ret = {};
  for (var prop in props) {
    ret[prop] = {
      added: props[prop]
    };
  }
  return ret;
}

function getOld(propsArray) {
  for (var i = 0; i < propsArray.length; i++) {
    var changeType = propsArray[i].changeType;
    if (changeType === 'modifiedOld' || changeType === 'deletedOld') {
      return propsArray[i];
    }
  }
}

function getNew(propsArray) {
  for (var i = 0; i < propsArray.length; i++) {
    var changeType = propsArray[i].changeType;
    if (changeType === 'modifiedNew' || changeType === 'deletedNew') {
      return propsArray[i];
    }
  }
}

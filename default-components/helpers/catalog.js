module.exports = (slice, firstElementIndex, elementsLength, onPage, callbacks, options = {}) => {
  const keyboard = [];
  const arrows = [];
  if (options.toEnd && firstElementIndex > onPage * 2)
    arrows.push({
      text: options.doubleLeftArrow || '⬅️⬅️',
      callback_data: callbacks.toStart
    });
  if (firstElementIndex > 0)
    arrows.push({
      text: options.leftArrow || '⬅️',
      callback_data: callbacks.left
    });
  if (firstElementIndex < elementsLength - onPage)
    arrows.push({
      text: options.rightArrow || '➡️',
      callback_data: callbacks.right
    });
  if (options.toEnd && firstElementIndex < elementsLength - onPage * 2)
    arrows.push({
      text: options.rightArrow || '➡️➡️',
      callback_data: callbacks.toEnd
    });
  if ((slice.length >= onPage || firstElementIndex > 0) && options.ceilArrows)
    keyboard.push(arrows);

  let text = '';
  for (let i = 0; i < onPage && slice[i];) {
    if (!options.text) {
      const row = [];
      for (let j = 0; (j < options.inRow || j < 1) && i < onPage && slice[i]; j++) {
        row.push(slice[i]);
        console.log(i);
        i++;
      }
      keyboard.push(row);
    } else {
      const string = '';
      for (let j = 0; (j < options.inRow || j < 1) && i < onPage && slice[i]; j++) {
        if (j > 0)
          string += options.delimeter || ' | ';
        string += slice[i];
        i++;
      }
      text += string + '\n';
    }
  }
  if ((slice.length >= onPage || firstElementIndex > 0) && !options.disableFloorArrows)
    keyboard.push(arrows);
  return {keyboard, text};
}
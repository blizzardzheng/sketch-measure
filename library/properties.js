var GetProperties = function(layer, types, position) {
  var frame = getFrame(layer),
      content = '',
      getColor = function(layer, fill) {

        var layer = layer,
            fill = (fill)? fill: [[layer style] fill];

        if(fill && [fill isEnabled]){
          var color = [fill color];
          if ([color hexValue] == 'D8D8D8') setColor(layer, 'D8D8D8'); 
        }
        else if(( !fill || (fill && ![fill isEnabled])) && [layer class] == MSTextLayer){
          var color = [layer textColor];
        }
        else{
          return null;
        }

        var alpha = [color alpha],
            hex = ([color hexValue] == 0)? '000000': [color hexValue],
            rgb = hexToRgb(hex);

        alpha = (alpha == 1)? '': ' (' + Math.round(alpha * 100) + '%)';
        return '#' + hex + ' / ' + rgb.r + ',' + rgb.g + ',' + rgb.b + alpha;
      };

  for (var i = 0; i < types.length; i++) {
    if([layer class] == MSTextLayer && types[i] == 'font') content += 'font: ' + [layer fontPostscriptName] + '\r\n';
    if([layer class] == MSTextLayer && types[i] == 'size') content += 'size: ' + updateLength([layer fontSize]) + '\r\n';
    if(types[i] == 'color' && getColor(layer)) content += 'color: ' + getColor(layer) + '\r\n';
    if([layer class] == MSTextLayer && types[i] == 'line') content += 'line: ' + Math.ceil([layer lineSpacing] / [layer fontSize] * 100) + '%\r\n';
    if(types[i] == 'border' && [[layer style] border]) content += 'border: ' + getColor(layer, [[layer style] border]) + '\r\n';
  };

  if(content == '') return false;
  var data = ([layer class] == MSTextLayer)? [layer fontSize]: null;
  CreateLabel(layer, [content trim], position, data, 'PROPERTY');
},
SelectionProperties = function(types, position){
	var layers = selection,
      types = (types instanceof Array)? types: [types];
  if ([layers count] > 0) {
    for (var i = 0; i < [layers count]; i++) {
      var layer = layers[i];
      GetProperties(layer, types, position);
    }
  } else {
    alert("Make sure you've selected a symbol, or a layer that.");
  }
}
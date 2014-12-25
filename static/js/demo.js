$(function() {
  function showindent(spaces) {
    return spaces.replace(/ {2}/g, '<span class="indent">  </span>');
  }
  function htmlEscape(text) {
    return text.replace(/[<>&]/g, function(c) {
      return c == '<' ? '&lt;' : c == '>' ? '&gt;' : '&amp;';
    });
  }
  function formatted(code) {
    var j, lines = code.split('\n'), result = [], line;
    for (j = 0; j < lines.length; j++) {
      line = lines[j].replace(/^(?:<[a-z][^>]*>)? */, showindent);
      result.push(line);
    }
    return result.join('\n');
  }
  $('pre[data-format]').each(function(j) {
    var code = $(this).html(),
        html = formatted(code);
    $(this).html(html);
  });
  $('pre[data-run]').each(function(j) {
    var code = $(this).text(),
        orightml = $(this).html(),
        nocode = $(this).data('nocode'),
        noreform = $(this).data('noreform'),
        norun = $(this).data('norun'),
        html = nocode ? '' : formatted(orightml),
        sel = noreform ? $(this) : $(this).html(html),
        default_width = 180,
        width = $(this).data('width') || default_width,
        height = $(this).data('height') || $(this).height(),
        iframe = $('<iframe>').css({
          border: "0",
          float: "right",
          height: height,
          width: width
        }).prependTo(this).get(0),
        cdoc = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument,
        doc = cdoc.document;
    if (nocode) {
      $(this).css('display', 'inline-block');
    }
    doc.open();
    doc.write(
        '<!doctype html>\n' +
        '<link rel="stylesheet" href="demo.css">' +
        '<body class="demo">' +
        '<script src="/turtlebits.js" panel="false" subpixel="5"><' +
        '/script>' +
        '<script src="/lib/seedrandom.js"><' + '/script>' +
        '<script type="text/coffeescript">\n' +
        'window.speed Infinity\n' +
        'Math.seedrandom("turtle")\n' +
        'move -60, 0\n' +
        sel.data('run') + '\n' +
        (norun ? '': code) + '\n' +
        (sel.data('after') ? sel.data('after') : '') +
        '<' + '/script>');
    doc.close();
  });
});
